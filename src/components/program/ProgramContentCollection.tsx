import { useApolloClient } from '@apollo/react-hooks'
import { useEditor, UserComponent } from '@craftjs/core'
import gql from 'graphql-tag'
import { sum } from 'ramda'
import { useState } from 'react'
import { DeepPick } from 'ts-deep-pick/lib'
import { getProgramContentCollectionQuery } from '../../graphql/queries'
import * as hasura from '../../hasura'
import { ProgramContent, ProgramContentProps } from '../../types/program'
import Collection, { CollectionBaseProps } from '../common/Collection'

export type ProgramContentCollectionOptions =
  | {
      source: 'custom'
      idList: string[]
    }
  | {
      source: 'recentWatched'
      watchedAt?: Date
      limit?: number
    }
export type ProgramContentCollectionProps = CollectionBaseProps<ProgramContentCollectionOptions, ProgramContentProps>

const ProgramContentCollection: UserComponent<ProgramContentCollectionProps> = ({
  element,
  options,
  layout = { gutter: 8, gap: 8, columns: [1, 2, 4] },
}) => {
  const { loading, programContents } = useProgramContentCollection(options)
  const { editing } = useEditor(state => ({
    editing: state.options.enabled,
  }))
  return Collection(element)({
    loading,
    layout,
    propsList: programContents.map(programContent => ({
      title: programContent.title,
      coverUrl: programContent.contentSection.program.coverUrl,
      type: programContent.videos.length > 0 ? 'video' : 'text',
      duration: programContent.duration,
      progress: programContent.progress,
      editing,
    })),
  })
}

const useProgramContentCollection = (options: ProgramContentCollectionOptions) => {
  const [loading, setLoading] = useState(true)
  const [programContents, setProgramContents] = useState<
    DeepPick<
      ProgramContent,
      | 'id'
      | 'title'
      | 'duration'
      | 'progress'
      | 'lastProgress'
      | 'videos.[].id'
      | 'contentSection.program.id'
      | 'contentSection.program.coverUrl'
    >[]
  >([])
  const apolloClient = useApolloClient()
  switch (options.source) {
    case 'recentWatched':
      apolloClient
        .query<hasura.GET_RECENT_PROGRAM_PROGRESS, hasura.GET_RECENT_PROGRAM_PROGRESSVariables>({
          query: gql`
            query GET_RECENT_PROGRAM_PROGRESS($limit: Int) {
              program_content_progress(order_by: { updated_at: desc }, limit: $limit) {
                program_content {
                  ...programContentFields
                }
              }
            }
            ${programContentFields}
          `,
          variables: { limit: options.limit },
        })
        .then(
          ({ data }) =>
            data?.program_content_progress.map(pcp => ({
              id: pcp.program_content.id,
              title: pcp.program_content.title,
              duration: pcp.program_content.duration,
              progress: sum(pcp.program_content.program_content_progress.map(pcp => pcp.progress)),
              lastProgress: sum(pcp.program_content.program_content_progress.map(pcp => pcp.last_progress)),
              contentSection: {
                program: {
                  id: pcp.program_content.program_content_section.program.id,
                  coverUrl: pcp.program_content.program_content_section.program.cover_url,
                },
              },
              videos: pcp.program_content.program_content_videos.map(pcv => ({ id: pcv.attachment_id })),
            })) || [],
        )
        .finally(() => setLoading(false))
      break
    case 'custom':
      apolloClient
        .query<hasura.GET_PROGRAM_CONTENT_COLLECTION, hasura.GET_PROGRAM_CONTENT_COLLECTIONVariables>({
          query: getProgramContentCollectionQuery(programContentFields),
          variables: {
            limit: undefined,
            orderByClause: [],
            whereClause: {
              id: { _in: options.idList },
              published_at: { _is_null: false },
            },
          },
        })
        .then(({ data }) =>
          setProgramContents(
            data?.program_content.map(pc => ({
              id: pc.id,
              title: pc.title,
              duration: pc.duration,
              progress: sum(pc.program_content_progress.map(pcp => pcp.progress)),
              lastProgress: sum(pc.program_content_progress.map(pcp => pcp.last_progress)),
              contentSection: {
                program: {
                  id: pc.program_content_section.program.id,
                  coverUrl: pc.program_content_section.program.cover_url,
                },
              },
              videos: pc.program_content_videos.map(pcv => ({ id: pcv.attachment_id })),
            })) || [],
          ),
        )
        .finally(() => setLoading(false))
      break
  }

  return { loading, programContents }
}

const programContentFields = gql`
  fragment programContentFields on program_content {
    id
    title
    duration
    program_content_section {
      program {
        id
        cover_url
      }
    }
    program_content_progress {
      id
      progress
      last_progress
    }
    program_content_videos {
      attachment_id
    }
  }
`

export default ProgramContentCollection
