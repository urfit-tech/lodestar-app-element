import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import moment from 'moment'
import { sum } from 'ramda'
import { DeepPick } from 'ts-deep-pick/lib'
import hasura from '../hasura'
import { notEmpty } from '../helpers'
import { CouponProps } from '../types/checkout'
import { Member, PeriodType, PodcastProgram, Program } from '../types/data'

export const usePublishedProgramCollection = (options: { ids?: string[]; limit?: number }) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PUBLISHED_PROGRAM_COLLECTION,
    hasura.GET_PUBLISHED_PROGRAM_COLLECTIONVariables
  >(
    gql`
      query GET_PUBLISHED_PROGRAM_COLLECTION($ids: [uuid!], $limit: Int) {
        program(where: { id: { _in: $ids } }, order_by: [{ position: asc }, { published_at: desc }], limit: $limit) {
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
          program_roles(where: { name: { _eq: "instructor" } }, order_by: { created_at: asc }) {
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
            period_amount
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
      variables: options,
    },
  )

  // @ts-ignore
  const programs: DeepPick<
    Program,
    | 'id'
    | 'coverUrl'
    | 'title'
    | 'abstract'
    | 'publishedAt'
    | 'isPrivate'
    | 'listPrice'
    | 'salePrice'
    | 'soldAt'
    | 'roles.[].id'
    | 'roles.[].member.id'
    | 'plans.[].id'
    | 'plans.[].listPrice'
    | 'plans.[].salePrice'
    | 'plans.[].soldAt'
    | 'plans.[].period.amount'
    | 'plans.[].period.type'
    | 'totalDuration'
  >[] =
    loading || error || !data
      ? []
      : data.program.map(program => ({
          id: program.id,
          coverUrl: program.cover_url,
          title: program.title,
          abstract: program.abstract || '',
          publishedAt: program.published_at && new Date(program.published_at),
          isPrivate: program.is_private,
          listPrice: program.list_price,
          salePrice: program.sale_price,
          soldAt: program.sold_at && new Date(program.sold_at),
          roles: program.program_roles.map(programRole => ({
            id: programRole.id,
            member: {
              id: programRole.member_id,
            },
          })),
          plans: program.program_plans.map(programPlan => ({
            id: programPlan.id,
            listPrice: programPlan.list_price,
            salePrice: programPlan.sale_price,
            soldAt: programPlan.sold_at && new Date(programPlan.sold_at),
            period: {
              amount: programPlan.period_amount,
              type: programPlan.period_type as PeriodType,
            },
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

export const usePublishedPodcastProgramCollection = (options?: { ids?: string[]; limit?: number }) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_PUBLISHED_PODCAST_PROGRAM_COLLECTION>(
    gql`
      query GET_PUBLISHED_PODCAST_PROGRAM_COLLECTION($limit: Int) {
        podcast_program(order_by: { published_at: desc }, where: { published_at: { _lt: "now()" } }, limit: $limit) {
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

  const podcastPrograms: DeepPick<
    PodcastProgram,
    | 'id'
    | 'coverUrl'
    | 'title'
    | 'totalDuration'
    | 'roles.[].member.id'
    | 'roles.[].member.name'
    | 'roles.[].member.pictureUrl'
    | 'listPrice'
    | 'salePrice'
    | 'soldAt'
  >[] =
    data?.podcast_program.map(v => ({
      id: v.id,
      coverUrl: v.cover_url,
      title: v.title,
      totalDuration: v.duration_second,
      roles: v.podcast_program_roles.map(ppr => ({
        member: {
          id: ppr.member?.id || '',
          name: ppr.member?.name || ppr.member?.username || '',
          pictureUrl: ppr.member?.picture_url || null,
        },
      })),
      listPrice: v.list_price,
      soldAt: moment(v.sold_at).toDate(),
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

  const member: DeepPick<Member, 'id' | 'pictureUrl' | 'name'> | null =
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

export const useInstructorCollection = (appId: string, options?: { ids?: string[]; limit?: number }) => {
  const { loading, error, data } = useQuery<
    hasura.GET_INSTRUCTOR_COLLECTION,
    hasura.GET_INSTRUCTOR_COLLECTIONVariables
  >(
    gql`
      query GET_INSTRUCTOR_COLLECTION($appId: String!, $limit: Int, $instructorIds: [String!]) {
        instructor: member_public(
          where: { app_id: { _eq: $appId }, id: { _in: $instructorIds }, role: { _in: ["content-creator"] } }
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
    { variables: { appId, limit: options?.limit, instructorIds: options?.ids } },
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

export const usePublishedActivityCollection = (options?: { ids: string[] }) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PUBLISHED_ACTIVITY_COLLECTION,
    hasura.GET_PUBLISHED_ACTIVITY_COLLECTIONVariables
  >(
    gql`
      query GET_PUBLISHED_ACTIVITY_COLLECTION($ids: [uuid!]) {
        activity(
          where: { published_at: { _lt: "now()" }, is_private: { _eq: false }, id: { _in: $ids } }
          order_by: [{ position: asc }, { published_at: desc }]
        ) {
          id
          cover_url
          title
          published_at
          is_participants_visible
          activity_categories {
            category {
              id
              name
            }
          }
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
    { variables: { ids: options?.ids } },
  )

  const activities =
    options?.ids
      .map(id => {
        const value = data?.activity.find(v => v.id === id)
        return value
          ? {
              id: value.id,
              coverUrl: value.cover_url,
              title: value.title,
              isParticipantsVisible: value.is_participants_visible,
              startedAt:
                value.activity_sessions_aggregate.aggregate?.min?.started_at &&
                new Date(value.activity_sessions_aggregate.aggregate.min.started_at),
              endedAt:
                value.activity_sessions_aggregate.aggregate?.max?.ended_at &&
                new Date(value.activity_sessions_aggregate.aggregate.max.ended_at),
              participantCount: value.activity_enrollments_aggregate.aggregate?.count || 0,
              totalSeats: value.activity_tickets_aggregate.aggregate?.sum?.count || 0,
              categories: value.activity_categories.map(v => ({ id: v.category.id, name: v.category.name })),
            }
          : null
      })
      .filter(notEmpty) || []

  return {
    loadingActivities: loading,
    errorActivities: error,
    refetchActivities: refetch,
    activities,
  }
}

export const useCouponCollection = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_COUPON_COLLECTION,
    hasura.GET_COUPON_COLLECTIONVariables
  >(
    gql`
      query GET_COUPON_COLLECTION($memberId: String!) {
        coupon(where: { member_id: { _eq: $memberId } }) {
          id
          status {
            outdated
            used
          }
          coupon_code {
            code
            coupon_plan {
              id
              title
              amount
              type
              constraint
              started_at
              ended_at
              description
              scope
              coupon_plan_products {
                id
                product_id
              }
            }
          }
        }
      }
    `,
    { variables: { memberId } },
  )

  const coupons: CouponProps[] =
    loading || error || !data
      ? []
      : data.coupon.map(coupon => ({
          id: coupon.id,
          status: {
            used: coupon.status?.used || false,
            outdated: coupon.status?.outdated || false,
          },
          couponCode: {
            code: coupon.coupon_code.code,
            couponPlan: {
              id: coupon.coupon_code.coupon_plan.id,
              startedAt: coupon.coupon_code.coupon_plan.started_at
                ? new Date(coupon.coupon_code.coupon_plan.started_at)
                : null,
              endedAt: coupon.coupon_code.coupon_plan.ended_at
                ? new Date(coupon.coupon_code.coupon_plan.ended_at)
                : null,
              type:
                coupon.coupon_code.coupon_plan.type === 1
                  ? 'cash'
                  : coupon.coupon_code.coupon_plan.type === 2
                  ? 'percent'
                  : 'cash',
              constraint: coupon.coupon_code.coupon_plan.constraint,
              amount: coupon.coupon_code.coupon_plan.amount,
              title: coupon.coupon_code.coupon_plan.title,
              description: coupon.coupon_code.coupon_plan.description,
              count: 0,
              remaining: 0,
              scope: coupon.coupon_code.coupon_plan.scope,
              productIds: coupon.coupon_code.coupon_plan.coupon_plan_products.map(
                couponPlanProduct => couponPlanProduct.product_id,
              ),
            },
          },
        }))

  return {
    loadingCoupons: loading,
    errorCoupons: error,
    coupons,
    refetchCoupons: refetch,
  }
}
