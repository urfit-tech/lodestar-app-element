import { gql, useQuery } from '@apollo/client'
import { sum } from 'ramda'
import { useMemo } from 'react'
import { notEmpty } from '@lodestar/helpers'
import * as hasura from '@lodestar/graphql/hasura'
import { getProgramContentCollectionQuery } from '@lodestar/graphql/queries'
import { ProductCustomSource, ProductRecentWatchedSource } from '@lodestar/types/options'
import { ProgramContentCollectionItem } from '@lodestar/types/programContent'

export type ProgramContentCollectionSource = ProductRecentWatchedSource | ProductCustomSource

export type UseProgramContentCollectionResult = {
  data: ProgramContentCollectionItem[]
  loading: boolean
  error?: Error
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
        cover_mobile_url
        cover_thumbnail_url
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

const PROGRAM_CONTENT_COLLECTION_QUERY = getProgramContentCollectionQuery(programContentFields)

const RECENT_PROGRAM_PROGRESS_QUERY = gql`
  query GET_RECENT_PROGRAM_PROGRESS($limit: Int) {
    program_content_progress(order_by: { updated_at: desc }, limit: $limit) {
      program_content {
        ...programContentFields
      }
    }
  }
  ${programContentFields}
`

type ProgramContentNode = hasura.GET_PROGRAM_CONTENT_COLLECTION['program_content'][number]

const composeProgramContentItem = (pc: ProgramContentNode): ProgramContentCollectionItem => ({
  id: pc.id,
  title: pc.title,
  duration: pc.duration ?? 0,
  progress: sum(pc.program_content_progress.map(pcp => pcp.progress)),
  lastProgress: sum(pc.program_content_progress.map(pcp => pcp.last_progress)),
  contentSection: {
    program: {
      id: pc.program_content_section.program.id,
      coverUrl: pc.program_content_section.program.cover_url || null,
      coverMobileUrl: pc.program_content_section.program.cover_mobile_url || null,
      coverThumbnailUrl: pc.program_content_section.program.cover_thumbnail_url || null,
    },
  },
  videos: pc.program_content_videos.map(pcv => ({ id: pcv.attachment_id })),
})

const composeCustomCollectionData = (
  data: hasura.GET_PROGRAM_CONTENT_COLLECTION,
): ProgramContentCollectionItem[] => data.program_content.map(composeProgramContentItem)

const composeRecentWatchedCollectionData = (
  data: hasura.GET_RECENT_PROGRAM_PROGRESS,
): ProgramContentCollectionItem[] =>
  data.program_content_progress.map(pcp => composeProgramContentItem(pcp.program_content))

const buildCustomVariables = (
  source: ProductCustomSource,
): hasura.GET_PROGRAM_CONTENT_COLLECTIONVariables => ({
  limit: undefined,
  orderByClause: [],
  whereClause: {
    id: { _in: source.idList || [] },
    published_at: { _lt: 'now()' },
  },
})

export const useProgramContentCollection = (
  source: ProgramContentCollectionSource,
): UseProgramContentCollectionResult => {
  // The two source branches hit different Hasura queries (`GET_PROGRAM_CONTENT_COLLECTION`
  // for `custom` vs. the inline `GET_RECENT_PROGRAM_PROGRESS` for `recentWatched`).
  // We issue both `useQuery` calls unconditionally to keep React's hook order
  // stable, then `skip` whichever one does not match the active `source.from`.
  const isCustom = source.from === 'custom'

  const customVariables = useMemo(
    () => (isCustom ? buildCustomVariables(source) : undefined),
    [isCustom, source],
  )
  const {
    data: customRawData,
    loading: customLoading,
    error: customError,
  } = useQuery<hasura.GET_PROGRAM_CONTENT_COLLECTION, hasura.GET_PROGRAM_CONTENT_COLLECTIONVariables>(
    PROGRAM_CONTENT_COLLECTION_QUERY,
    { variables: customVariables, skip: !isCustom },
  )

  const recentVariables = useMemo<hasura.GET_RECENT_PROGRAM_PROGRESSVariables | undefined>(
    () => (!isCustom ? { limit: source.limit } : undefined),
    [isCustom, source],
  )
  const {
    data: recentRawData,
    loading: recentLoading,
    error: recentError,
  } = useQuery<hasura.GET_RECENT_PROGRAM_PROGRESS, hasura.GET_RECENT_PROGRAM_PROGRESSVariables>(
    RECENT_PROGRAM_PROGRESS_QUERY,
    { variables: recentVariables, skip: isCustom },
  )

  const composed = useMemo<ProgramContentCollectionItem[]>(() => {
    if (isCustom) {
      if (!customRawData) return []
      // Preserve caller-supplied `idList` order (matches the original
      // collectCustomCollection behaviour — the query itself returns rows
      // in arbitrary order).
      const ordered: hasura.GET_PROGRAM_CONTENT_COLLECTION = {
        ...customRawData,
        program_content: (source.from === 'custom' ? source.idList || [] : [])
          .map(id => customRawData.program_content.find(pc => pc.id === id))
          .filter(notEmpty),
      }
      return composeCustomCollectionData(ordered)
    }
    return recentRawData ? composeRecentWatchedCollectionData(recentRawData) : []
  }, [isCustom, customRawData, recentRawData, source])

  const loading = isCustom ? customLoading : recentLoading
  const error = isCustom ? customError : recentError

  return {
    data: composed,
    loading,
    error: error && new Error(error.message),
  }
}
