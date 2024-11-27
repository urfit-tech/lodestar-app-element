import { gql, useQuery } from '@apollo/client'
import { defaultTo, evolve, head, mergeRight, pipe, prop } from 'ramda'
import hasura from '../hasura'

export const useReviewable = (path: string, appId: string) =>
  useQuery<hasura.GetReviewable, hasura.GetReviewableVariables>(
    gql`
      query GetReviewable($path: String!, $appId: String!) {
        reviewable(where: { path: { _eq: $path }, app_id: { _eq: $appId } }) {
          is_item_viewable
          is_score_viewable
          is_writable
        }
      }
    `,
    { variables: { path, appId } },
  )

export const reviewableAdaptor: (reviewable: hasura.GetReviewable | undefined) => {
  is_item_viewable: boolean
  is_score_viewable: boolean
  is_writable: boolean
} = pipe(
  (prop as any)('reviewable'),
  (defaultTo as any)([]),
  head,
  (mergeRight as any)({
    is_item_viewable: true,
    is_score_viewable: true,
    is_writable: true,
  }),
)

export const useAdaptedReviewable = (path: string, appId: string) =>
  evolve({
    data: reviewableAdaptor,
  })(useReviewable(path, appId))

export const useReviewAggregate = (path: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GetReviewAggregate, hasura.GetReviewAggregateVariables>(
    gql`
      query GetReviewAggregate($path: String) {
        review_public_aggregate(where: { path: { _eq: $path } }) {
          aggregate {
            avg {
              score
            }
            count
          }
        }
      }
    `,
    {
      variables: {
        path,
      },
    },
  )
  const averageScore = data?.review_public_aggregate.aggregate?.avg?.score || 0
  const reviewCount = data?.review_public_aggregate.aggregate?.count || 0

  return {
    loading,
    error,
    refetch,
    averageScore,
    reviewCount,
  }
}
