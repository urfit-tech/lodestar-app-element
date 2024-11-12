import { gql, useQuery } from '@apollo/client'
import hasura from '../hasura'

export const useReviewable = (path: string, appId: string) =>
  useQuery<hasura.GET_REVIEWABLE, hasura.GET_REVIEWABLEVariables>(
    gql`
      query GET_REVIEWABLE($path: String!, $appId: String!) {
        reviewable(where: { path: { _eq: $path }, app_id: { _eq: $appId } }) {
          is_item_viewable
          is_score_viewable
          is_writable
        }
      }
    `,
    { variables: { path, appId } },
  )

export const useReviewAggregate = (path: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_REVIEW_AGGREGATE, hasura.GET_REVIEW_AGGREGATEVariables>(
    gql`
      query GET_REVIEW_AGGREGATE($path: String) {
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
