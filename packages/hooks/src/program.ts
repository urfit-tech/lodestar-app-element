import { gql, QueryHookOptions, useQuery } from '@apollo/client'
import { sum } from 'ramda'
import hasura from '../hasura'

export const useProgramEnrollmentAggregate = (programId: string, options?: Pick<QueryHookOptions, 'skip'>) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PROGRAM_ENROLLMENT_AGGREGATE,
    hasura.GET_PROGRAM_ENROLLMENT_AGGREGATEVariables
  >(
    gql`
      query GET_PROGRAM_ENROLLMENT_AGGREGATE($programId: uuid!) {
        program_statistics(where: { program_id: { _eq: $programId } }) {
          program_plan_enrolled_count
          program_package_plan_enrolled_count
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
  const enrolledCount =
    sum(
      data?.program_statistics.map(v => v.program_plan_enrolled_count + v.program_package_plan_enrolled_count) || [],
    ) || 0

  return {
    loading,
    error,
    data: enrolledCount,
    refetch,
  }
}
