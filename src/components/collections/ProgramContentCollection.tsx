import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { sum } from 'ramda'
import { DeepPick } from 'ts-deep-pick/lib'
import { getProgramContentCollectionQuery } from '../../graphql/queries'
import * as hasura from '../../hasura'
import { notEmpty } from '../../helpers'
import { ProgramContent } from '../../types/data'
import { ProgramContentElementProps } from '../../types/element'
import { CustomSourceOptions, RecentWatchedSourceOptions } from '../../types/options'
import Collection, { ElementCollection } from '../collections/Collection'

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
type ProgramContentCollectionData = ProgramContentData[]
type ProgramContentCollection<T> = (
  Element: React.ElementType<ProgramContentElementProps>,
) => (options: T) => ProgramContentElementCollection
export type ProgramContentElementCollection = ElementCollection<ProgramContentData>

export const CustomProgramContentCollection: ProgramContentCollection<CustomSourceOptions> = Element => options => {
  const ProgramContentElementCollection: ProgramContentElementCollection = props => {
    const { data: rawData, loading } = useQuery<
      hasura.GET_PROGRAM_CONTENT_COLLECTION,
      hasura.GET_PROGRAM_CONTENT_COLLECTIONVariables
    >(getProgramContentCollectionQuery(programContentFields), {
      variables: {
        limit: undefined,
        orderByClause: [],
        whereClause: {
          id: { _in: options.idList },
          published_at: { _is_null: false },
        },
      },
    })
    const data = {
      ...rawData,
      program_content: options.idList
        .filter(programContentId => rawData?.program_content.find(p => p.id === programContentId))
        .map(programContentId => rawData?.program_content.find(p => p.id === programContentId))
        .filter(notEmpty),
    }
    const programContentCollectionData: ProgramContentCollectionData =
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
    const ElementCollection = Collection({
      Element,
      data: programContentCollectionData,
      mapDataToProps: programContent => (loading ? { loading } : mapProgramContentToProps(programContent)),
    })
    return <ElementCollection {...props} />
  }
  return ProgramContentElementCollection
}

export const RecentWatchedProgramContentCollection: ProgramContentCollection<RecentWatchedSourceOptions> =
  Element => options => {
    const ProgramContentElementCollection: ProgramContentElementCollection = props => {
      const { data, loading } = useQuery<
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
      const programContentCollectionData: ProgramContentCollectionData =
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
      const ElementCollection = Collection({
        Element,
        data: programContentCollectionData,
        mapDataToProps: programContent => (loading ? { loading } : mapProgramContentToProps(programContent)),
      })
      return <ElementCollection {...props} />
    }
    return ProgramContentElementCollection
  }

const mapProgramContentToProps = (programContent: ProgramContentData) => ({
  title: programContent.title,
  coverUrl: programContent.contentSection.program.coverUrl,
  type: programContent.videos.length > 0 ? ('video' as const) : ('text' as const),
  duration: programContent.duration,
  progress: programContent.progress,
})

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
