import { QueryHookOptions, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import hasura from '../hasura'

export const useProgramEnrollmentAggregate = (programId: string, options?: Pick<QueryHookOptions, 'skip'>) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PROGRAM_ENROLLMENT_AGGREGATE,
    hasura.GET_PROGRAM_ENROLLMENT_AGGREGATEVariables
  >(
    gql`
      query GET_PROGRAM_ENROLLMENT_AGGREGATE($programId: uuid!) {
        program_plan_enrollment_aggregate(where: { program_plan: { program_id: { _eq: $programId } } }) {
          aggregate {
            count
          }
        }
      }
    `,
    {
      skip: options?.skip,
      variables: {
        programId,
      },
    },
  )
  const enrolledCount = data?.program_plan_enrollment_aggregate?.aggregate?.count || 0

  return {
    loading,
    error,
    data: enrolledCount,
    refetch,
  }
}
