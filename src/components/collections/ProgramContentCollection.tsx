import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { sum } from 'ramda'
import { StringParam } from 'serialize-query-params'
import { DeepPick } from 'ts-deep-pick/lib'
import { useQueryParam } from 'use-query-params'
import { getProgramContentCollectionQuery } from '../../graphql/queries'
import * as hasura from '../../hasura'
import { notEmpty } from '../../helpers'
import { ProgramContent } from '../../types/data'
import { ElementComponent } from '../../types/element'
import { ProductCustomSource, ProductRecentWatchedSource } from '../../types/options'
import ProgramContentCard from '../cards/ProgramContentCard'
import Collection, { CollectionLayout, ContextCollection } from './Collection'

type ProgramContentData = DeepPick<
  ProgramContent,
  | 'id'
  | 'title'
  | 'duration'
  | 'progress'
  | 'lastProgress'
  | 'videos.[].id'
  | 'contentSection.program.id'
  | 'contentSection.program.coverUrl'
>
type ProgramContentContextCollection = ContextCollection<ProgramContentData>

export type ProgramContentCollectionProps = {
  source?: ProductCustomSource | ProductRecentWatchedSource
  variant?: 'card' | 'tile'
  layout?: CollectionLayout
  withSelector?: boolean
}
const ProgramContentCollection: ElementComponent<ProgramContentCollectionProps> = props => {
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)

  const { loading, errors, children, source = { from: 'recentWatched' } } = props
  if (loading || errors) {
    return null
  }

  const ElementCollection = Collection(props.variant === 'card' ? ProgramContentCard : ProgramContentCard)
  let ContextCollection: ProgramContentContextCollection
  switch (source.from) {
    case 'recentWatched':
      ContextCollection = collectRecentWatchedCollection(source)
      break
    case 'custom':
      ContextCollection = collectCustomCollection(source)
      break
    default:
      ContextCollection = collectRecentWatchedCollection(source)
  }

  return (
    <ContextCollection>
      {ctx => {
        return (
          <div className={props.className}>
            {ctx.loading ? (
              <ElementCollection layout={props.layout} loading />
            ) : ctx.errors ? (
              <ElementCollection layout={props.layout} errors={ctx.errors} />
            ) : (
              <ElementCollection
                layout={props.layout}
                data={ctx.data || []}
                renderElement={(programContent, ProgramContentElement) => {
                  return (
                    <ProgramContentElement
                      editing={props.editing}
                      title={programContent.title}
                      coverUrl={programContent.contentSection.program.coverUrl}
                      type={programContent.videos.length > 0 ? ('video' as const) : ('text' as const)}
                      duration={programContent.duration}
                      progress={programContent.progress}
                    />
                  )
                }}
              />
            )}
          </div>
        )
      }}
    </ContextCollection>
  )
}

const collectCustomCollection = (options: ProductCustomSource) => {
  const ProgramContentElementCollection: ProgramContentContextCollection = ({ children }) => {
    const {
      data: rawData,
      loading,
      error,
    } = useQuery<hasura.GET_PROGRAM_CONTENT_COLLECTION, hasura.GET_PROGRAM_CONTENT_COLLECTIONVariables>(
      getProgramContentCollectionQuery(programContentFields),
      {
        variables: {
          limit: undefined,
          orderByClause: [],
          whereClause: {
            id: { _in: options.idList },
            published_at: { _lt: 'now()' },
          },
        },
      },
    )
    const data = {
      ...rawData,
      program_content: options.idList
        .filter(programContentId => rawData?.program_content.find(p => p.id === programContentId))
        .map(programContentId => rawData?.program_content.find(p => p.id === programContentId))
        .filter(notEmpty),
    }
    const programContentCollectionData: ProgramContentData[] =
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
      })) || []
    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: programContentCollectionData,
    })
  }
  return ProgramContentElementCollection
}

const collectRecentWatchedCollection = (options: ProductRecentWatchedSource) => {
  const ProgramContentElementCollection: ProgramContentContextCollection = ({ children }) => {
    const { data, loading, error } = useQuery<
      hasura.GET_RECENT_PROGRAM_PROGRESS,
      hasura.GET_RECENT_PROGRAM_PROGRESSVariables
    >(
      gql`
        query GET_RECENT_PROGRAM_PROGRESS($limit: Int) {
          program_content_progress(order_by: { updated_at: desc }, limit: $limit) {
            program_content {
              ...programContentFields
            }
          }
        }
        ${programContentFields}
      `,
      { variables: { limit: options.limit } },
    )
    const programContentCollectionData: ProgramContentData[] =
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
      })) || []
    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: programContentCollectionData,
    })
  }
  return ProgramContentElementCollection
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
