import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { sum } from 'ramda'
import hasura from '../hasura'
import {
  ActivityProps,
  MemberPublicProps,
  PeriodType,
  PodcastProgramBriefProps,
  ProgramBriefProps,
  ProgramPlanProps,
  ProgramRoleProps,
  ProjectBasicProps,
  ProjectType,
} from '../types/data'

export const usePublishedProgramCollection = (options?: {
  instructorId?: string
  isPrivate?: boolean
  categoryId?: string
  limit?: number
}) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PUBLISHED_PROGRAM_COLLECTION,
    hasura.GET_PUBLISHED_PROGRAM_COLLECTIONVariables
  >(
    gql`
      query GET_PUBLISHED_PROGRAM_COLLECTION(
        $instructorId: String
        $isPrivate: Boolean
        $categoryId: String
        $limit: Int
      ) {
        program(
          where: {
            published_at: { _is_null: false }
            program_roles: { name: { _eq: "instructor" }, member_id: { _eq: $instructorId } }
            is_private: { _eq: $isPrivate }
            is_deleted: { _eq: false }
            _or: [{ _not: { program_categories: {} } }, { program_categories: { category_id: { _eq: $categoryId } } }]
          }
          order_by: [{ position: asc }, { published_at: desc }]
          limit: $limit
        ) {
          id
          cover_url
          title
          abstract
          support_locales
          published_at
          is_subscription
          is_sold_out
          is_private
          list_price
          sale_price
          sold_at
          program_roles(where: { name: { _eq: "instructor" } }) {
            id
            member_id
          }
          program_categories {
            id
            category {
              id
              name
            }
          }
          program_plans(order_by: { created_at: asc }, limit: 1) {
            id
            list_price
            sale_price
            sold_at
            period_type
          }
          program_content_sections {
            id
            program_contents_aggregate {
              aggregate {
                sum {
                  duration
                }
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        instructorId: options?.instructorId,
        isPrivate: options?.isPrivate,
        categoryId: options?.categoryId,
        limit: options?.limit,
      },
    },
  )

  const programs: (ProgramBriefProps & {
    roles: ProgramRoleProps[]
    plans: ProgramPlanProps[]
  })[] =
    loading || error || !data
      ? []
      : data.program
          .filter(
            program =>
              !options?.categoryId || program.program_categories.some(v => v.category.id === options.categoryId),
          )
          .map(program => ({
            id: program.id,
            coverUrl: program.cover_url,
            title: program.title,
            abstract: program.abstract,
            publishedAt: program.published_at && new Date(program.published_at),
            isSubscription: program.is_subscription,
            isSoldOut: program.is_sold_out,
            isPrivate: program.is_private,
            listPrice: program.list_price,
            salePrice: program.sale_price,
            soldAt: program.sold_at && new Date(program.sold_at),
            roles: program.program_roles.map(programRole => ({
              id: programRole.id,
              memberId: programRole.member_id,
            })),
            plans: program.program_plans.map(programPlan => ({
              id: programPlan.id,
              listPrice: programPlan.list_price,
              salePrice: programPlan.sale_price,
              soldAt: programPlan.sold_at && new Date(programPlan.sold_at),
              periodType: programPlan.period_type as PeriodType,
            })),
            totalDuration: sum(
              program.program_content_sections.map(
                section => section.program_contents_aggregate.aggregate?.sum?.duration || 0,
              ),
            ),
          }))

  return {
    loadingPrograms: loading,
    errorPrograms: error,
    programs,
    refetchPrograms: refetch,
  }
}

export const useProjectCollection = (options?: { categoryId?: string; projectType?: ProjectType; limit?: number }) => {
  const condition: hasura.GET_PROJECT_COLLECTIONVariables['condition'] = {
    published_at: { _is_null: false },
    type: { ...(options?.projectType ? { _eq: options.projectType } : { _in: ['on-sale', 'pre-order', 'funding'] }) },
    ...(options?.categoryId && { project_categories: { category_id: { _eq: options.categoryId } } }),
  }
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PROJECT_COLLECTION,
    hasura.GET_PROJECT_COLLECTIONVariables
  >(
    gql`
      query GET_PROJECT_COLLECTION($condition: project_bool_exp!, $limit: Int) {
        project(where: $condition, order_by: { position: asc }, limit: $limit) {
          id
          type
          title
          cover_url
          preview_url
          abstract
          target_amount
          target_unit
          expired_at
          is_participants_visible
          is_countdown_timer_visible
          project_sales {
            total_sales
          }
          project_plans {
            id
            project_plan_enrollments_aggregate {
              aggregate {
                count
              }
            }
          }
        }
      }
    `,
    { variables: { condition } },
  )

  const projects: ProjectBasicProps[] =
    data?.project.map(v => ({
      id: v.id,
      type: v.type,
      title: v.title,
      coverUrl: v.cover_url,
      previewUrl: v.preview_url,
      abstract: v.abstract,
      targetAmount: v.target_amount,
      targetUnit: v.target_unit as ProjectBasicProps['targetUnit'],
      expiredAt: v.expired_at ? new Date(v.expired_at) : null,
      isParticipantsVisible: v.is_participants_visible,
      isCountdownTimerVisible: v.is_countdown_timer_visible,
      totalSales: v.project_sales?.total_sales || 0,
      enrollmentCount: sum(
        v.project_plans.map(projectPlan => projectPlan.project_plan_enrollments_aggregate.aggregate?.count || 0),
      ),
    })) || []

  return {
    loadingProjects: loading,
    errorProjects: error,
    projects,
    refetchProjects: refetch,
  }
}

export const usePublishedPodcastProgramCollection = (options?: { limit?: number }) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_PUBLISHED_PODCAST_PROGRAM_COLLECTION>(
    gql`
      query GET_PUBLISHED_PODCAST_PROGRAM_COLLECTION($limit: Int) {
        podcast_program(order_by: { published_at: desc }, where: { published_at: { _is_null: false } }, limit: $limit) {
          id
          cover_url
          title
          duration_second
          list_price
          sale_price
          sold_at
          podcast_program_roles(where: { name: { _eq: "instructor" } }) {
            id
            member {
              id
              picture_url
              name
              username
            }
          }
        }
      }
    `,
    { variables: { limit: options?.limit } },
  )

  const podcastPrograms: PodcastProgramBriefProps[] =
    data?.podcast_program.map(v => ({
      id: v.id,
      coverUrl: v.cover_url,
      title: v.title,
      durationSecond: v.duration_second,
      instructor: v.podcast_program_roles[0]?.member
        ? {
            id: v.podcast_program_roles[0]?.member.id || '',
            avatarUrl: v.podcast_program_roles[0]?.member.picture_url,
            name: v.podcast_program_roles[0]?.member.name || v.podcast_program_roles[0]?.member.username || '',
          }
        : null,
      listPrice: v.list_price,
      salePrice: v.sold_at && new Date(v.sold_at).getTime() > Date.now() ? v.sale_price : undefined,
    })) || []

  return {
    loadingPodcastPrograms: loading,
    errorPodcastPrograms: error,
    podcastPrograms,
    refetchPodcastPrograms: refetch,
  }
}

export const usePublicMember = (memberId: string) => {
  const { loading, data, error, refetch } = useQuery<hasura.GET_PUBLIC_MEMBER, hasura.GET_PUBLIC_MEMBERVariables>(
    gql`
      query GET_PUBLIC_MEMBER($memberId: String!) {
        member_public(where: { id: { _eq: $memberId } }) {
          id
          picture_url
          name
          username
        }
      }
    `,
    { variables: { memberId } },
  )

  const member: MemberPublicProps | null =
    loading || error || !data || !data.member_public[0]
      ? null
      : {
          id: data.member_public[0].id || '',
          pictureUrl: data.member_public[0].picture_url,
          name: data.member_public[0].name || data.member_public[0].username || '',
        }

  return {
    loadingMember: loading,
    errorMember: error,
    member,
    refetchMember: refetch,
  }
}

export const useInstructorCollection = (appId: string, options?: { limit?: number }) => {
  const { loading, error, data } = useQuery<
    hasura.GET_INSTRUCTOR_COLLECTION,
    hasura.GET_INSTRUCTOR_COLLECTIONVariables
  >(
    gql`
      query GET_INSTRUCTOR_COLLECTION($limit: Int!, $appId: String) {
        instructor: member_public(
          where: { app_id: { _eq: $appId }, role: { _in: ["content-creator"] } }
          limit: $limit
          order_by: { created_at: desc }
        ) {
          id
          name
          abstract
          picture_url
          description
        }
      }
    `,
    { variables: { appId, limit: options?.limit || 9 } },
  )

  const instructors: {
    id: string | null
    name: string | null
    abstract: string | null
    description: string | null
    avatarUrl: string | null
  }[] =
    data?.instructor.map(v => ({
      id: v.id,
      name: v.name,
      abstract: v.abstract,
      description: v.description,
      avatarUrl: v.picture_url,
    })) || []

  return {
    loadingInstructors: loading,
    errorInstructors: error,
    instructors,
  }
}

export const usePublishedActivityCollection = (options?: { limit?: number }) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PUBLISHED_ACTIVITY_COLLECTION,
    hasura.GET_PUBLISHED_ACTIVITY_COLLECTIONVariables
  >(
    gql`
      query GET_PUBLISHED_ACTIVITY_COLLECTION($limit: Int) {
        activity(
          where: { published_at: { _is_null: false } }
          order_by: [{ position: asc }, { published_at: desc }]
          limit: $limit
        ) {
          id
          cover_url
          title
          published_at
          is_participants_visible
          activity_enrollments_aggregate {
            aggregate {
              count
            }
          }
          activity_sessions_aggregate {
            aggregate {
              min {
                started_at
              }
              max {
                ended_at
              }
            }
          }
          activity_tickets_aggregate {
            aggregate {
              sum {
                count
              }
            }
          }
        }
      }
    `,
    { variables: { limit: options?.limit } },
  )

  const activities: ActivityProps[] =
    loading || error || !data
      ? []
      : data.activity
          .filter(activity => activity.published_at && new Date(activity.published_at).getTime() < Date.now())
          .map(activity => ({
            id: activity.id,
            coverUrl: activity.cover_url,
            title: activity.title,
            isParticipantsVisible: activity.is_participants_visible,
            startedAt:
              activity.activity_sessions_aggregate.aggregate?.min?.started_at &&
              new Date(activity.activity_sessions_aggregate.aggregate.min.started_at),
            endedAt:
              activity.activity_sessions_aggregate.aggregate?.max?.ended_at &&
              new Date(activity.activity_sessions_aggregate.aggregate.max.ended_at),
            participantCount: activity.activity_enrollments_aggregate.aggregate?.count || 0,
            totalSeats: activity.activity_tickets_aggregate.aggregate?.sum?.count || 0,
          }))

  return {
    loadingActivities: loading,
    errorActivities: error,
    refetchActivities: refetch,
    activities,
  }
}
