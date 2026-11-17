import { gql, useQuery } from '@apollo/client'
import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useAuth } from '../contexts/AuthContext'
import hasura from '../hasura'
import { notEmpty } from '../helpers'
import { commonMessages } from '../helpers/translation'
import { PeriodType } from '../types/data'
import { Target } from '../types/product'

// 以 email 找會員改走後端 API（限本租戶、精確比對、每人有查詢次數上限），不再直接查 member_public.email
const MEMBER_EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/
const MEMBER_LOOKUP_DEBOUNCE_MS = 400
const MEMBER_LOOKUP_MAX_EMAILS = 20

const lookupMembersByEmail = async (authToken: string, emails: string[]) => {
  const { data } = await axios.post<{ code: string; result?: { members?: { id: string; email: string }[] } | null }>(
    `${process.env.REACT_APP_API_BASE_ROOT}/member/lookup-by-email`,
    { emails },
    { headers: { Authorization: `Bearer ${authToken}` } },
  )
  if (data?.code !== 'SUCCESS') {
    throw new Error(data?.code || 'E_MEMBER_LOOKUP')
  }
  return data.result?.members || []
}

export const useMemberValidation = (email: string) => {
  const { currentMemberId, authToken } = useAuth()
  const [lookup, setLookup] = useState<{ email: string; memberId: string | null; error?: Error }>()
  const requestSeqRef = useRef(0)
  // 空值、格式不符或未登入都不呼叫 API，直接視為查無此會員
  const shouldLookup = !!email && MEMBER_EMAIL_REGEX.test(email) && !!authToken

  const fetchMemberId = useCallback(
    async (targetEmail: string) => {
      if (!authToken) return
      const seq = ++requestSeqRef.current
      try {
        const members = await lookupMembersByEmail(authToken, [targetEmail])
        if (seq === requestSeqRef.current) setLookup({ email: targetEmail, memberId: members[0]?.id || null })
      } catch (error) {
        if (seq === requestSeqRef.current) setLookup({ email: targetEmail, memberId: null, error: error as Error })
      }
    },
    [authToken],
  )

  useEffect(() => {
    if (!shouldLookup) return
    const timer = setTimeout(() => fetchMemberId(email), MEMBER_LOOKUP_DEBOUNCE_MS)
    return () => {
      clearTimeout(timer)
      // email 改變或元件卸載後，忽略還沒回來的舊結果
      requestSeqRef.current++
    }
  }, [email, shouldLookup, fetchMemberId])

  const isResolved = shouldLookup && lookup?.email === email
  const loading = shouldLookup && !isResolved
  const error = isResolved ? lookup?.error : undefined
  const memberId: string | null = isResolved ? lookup?.memberId || null : null
  const refetch = () => (shouldLookup ? fetchMemberId(email) : Promise.resolve())

  const validateStatus: 'success' | 'error' | 'validating' | undefined = !email
    ? undefined
    : loading
    ? 'validating'
    : !memberId || memberId === currentMemberId
    ? 'error'
    : 'success'

  return {
    loadingMemberId: loading,
    errorMemberId: error,
    memberId,
    validateStatus,
    refetchMemberId: refetch,
  }
}

export const useSimpleProduct = ({ id, startedAt }: { id: string; startedAt?: Date }) => {
  const { formatMessage } = useIntl()
  const [type, targetId] = id.split('_')

  const { loading, error, data } = useQuery<hasura.GET_SIMPLE_PRODUCT, hasura.GET_SIMPLE_PRODUCTVariables>(
    GET_SIMPLE_PRODUCT,
    {
      variables: {
        targetId,
        startedAt,
      },
      skip: !id,
    },
  )

  const target: Target | null = data?.program_plan_by_pk
    ? {
        id: data.program_plan_by_pk.id,
        productType: 'ProgramPlan',
        title: `${data.program_plan_by_pk.program?.title || ''} - ${data.program_plan_by_pk.title || ''}`,
        coverUrl: data.program_plan_by_pk.program?.cover_url || undefined,
        listPrice: data.program_plan_by_pk.list_price,
        isOnSale: data.program_plan_by_pk.sold_at
          ? new Date(data.program_plan_by_pk.sold_at).getTime() > Date.now()
          : false,
        salePrice:
          data.program_plan_by_pk.sold_at && new Date(data.program_plan_by_pk.sold_at).getTime() > Date.now()
            ? data.program_plan_by_pk.sale_price
            : undefined,
        discountDownPrice: data.program_plan_by_pk.discount_down_price || undefined,
        periodAmount: data.program_plan_by_pk.period_amount,
        periodType: data.program_plan_by_pk.period_type as PeriodType,
        groupBuyingPeople: data.program_plan_by_pk?.group_buying_people || 0,
        isSubscription: !!data.program_plan_by_pk?.auto_renewed,
      }
    : data?.program_package_plan_by_pk
    ? {
        id: data.program_package_plan_by_pk.id,
        productType: 'ProgramPackagePlan',
        title: data.program_package_plan_by_pk.title,
        coverUrl: data.program_package_plan_by_pk.program_package?.cover_url || undefined,
        listPrice: data.program_package_plan_by_pk.list_price,
        isOnSale: data.program_package_plan_by_pk.sold_at
          ? new Date(data.program_package_plan_by_pk.sold_at).getTime() > Date.now()
          : false,
        salePrice:
          data.program_package_plan_by_pk.sold_at &&
          new Date(data.program_package_plan_by_pk.sold_at).getTime() > Date.now()
            ? data.program_package_plan_by_pk.sale_price
            : undefined,
        discountDownPrice: data.program_package_plan_by_pk.discount_down_price,
        periodAmount: data.program_package_plan_by_pk.period_amount,
        periodType: data.program_package_plan_by_pk.period_type as PeriodType,
        isSubscription: data.program_package_plan_by_pk.is_subscription,
      }
    : data?.activity_ticket_by_pk
    ? {
        id: data.activity_ticket_by_pk.id,
        productType: 'ActivityTicket',
        title: `${data.activity_ticket_by_pk.activity?.title || ''} - ${data.activity_ticket_by_pk.title || ''}`,
        listPrice: data.activity_ticket_by_pk.price,
        coverUrl: data.activity_ticket_by_pk.activity?.cover_url || undefined,
        isSubscription: false,
        endedAt: data.activity_ticket_by_pk.ended_at,
      }
    : data?.card_by_pk
    ? {
        id: data.card_by_pk.id,
        productType: 'Card',
        title: data.card_by_pk.title,
        listPrice: 0,
        isSubscription: false,
      }
    : data?.project_plan_by_pk
    ? {
        id: data.project_plan_by_pk.id,
        productType: 'ProjectPlan',
        title: `${data.project_plan_by_pk.project?.title || ''} - ${data.project_plan_by_pk.title || ''}`,
        coverUrl: data.project_plan_by_pk.cover_url || undefined,
        listPrice: data.project_plan_by_pk.list_price,
        isOnSale: data.project_plan_by_pk.sold_at
          ? new Date(data.project_plan_by_pk.sold_at).getTime() > Date.now()
          : false,
        salePrice:
          data.project_plan_by_pk.sold_at && new Date(data.project_plan_by_pk.sold_at).getTime() > Date.now()
            ? data.project_plan_by_pk.sale_price
            : undefined,
        discountDownPrice: data.project_plan_by_pk.discount_down_price || undefined,
        periodAmount: data.project_plan_by_pk.period_amount,
        periodType: data.project_plan_by_pk.period_type as PeriodType,
        isLimited: data.project_plan_by_pk.is_limited,
        isPhysical: data.project_plan_by_pk.is_physical,
        isSubscription: data.project_plan_by_pk.is_subscription,
        expiredAt: data.project_plan_by_pk.project.expired_at,
      }
    : data?.podcast_program_by_pk
    ? {
        id: data.podcast_program_by_pk.id,
        productType: 'PodcastProgram',
        title: data.podcast_program_by_pk.title,
        coverUrl: data.podcast_program_by_pk.cover_url || undefined,
        listPrice: data.podcast_program_by_pk.list_price,
        isOnSale: data.podcast_program_by_pk.sold_at
          ? new Date(data.podcast_program_by_pk.sold_at).getTime() > Date.now()
          : false,
        salePrice:
          data.podcast_program_by_pk.sold_at && new Date(data.podcast_program_by_pk.sold_at).getTime() > Date.now()
            ? data.podcast_program_by_pk.sale_price
            : undefined,
        isSubscription: false,
      }
    : data?.podcast_plan_by_pk && data.podcast_plan_by_pk.creator
    ? {
        id: data.podcast_plan_by_pk.id,
        productType: 'PodcastPlan',
        title: `${formatMessage(commonMessages.title.podcastSubscription)} - ${
          data.podcast_plan_by_pk.creator.name || data.podcast_plan_by_pk.creator.username
        }`,
        coverUrl: 'https://static.kolable.com/images/reservation.svg',
        isSubscription: data.podcast_plan_by_pk.is_subscription,
      }
    : data?.appointment_plan_by_pk
    ? {
        id: data.appointment_plan_by_pk.id,
        productType: 'AppointmentPlan',
        title: data.appointment_plan_by_pk.title,
        coverUrl: data.appointment_plan_by_pk.creator && data.appointment_plan_by_pk.creator.picture_url,
        startedAt: data.appointment_plan_by_pk.appointment_periods[0]?.started_at,
        endedAt: data.appointment_plan_by_pk.appointment_periods[0]?.ended_at,
        isSubscription: false,
      }
    : data?.merchandise_spec_by_pk
    ? {
        id: data.merchandise_spec_by_pk.id,
        productType: 'MerchandiseSpec',
        title: `${data.merchandise_spec_by_pk.merchandise.title} - ${data.merchandise_spec_by_pk.title}`,
        listPrice: data.merchandise_spec_by_pk.list_price,
        isOnSale: data.merchandise_spec_by_pk.merchandise.sold_at
          ? new Date(data.merchandise_spec_by_pk.merchandise.sold_at).getTime() > Date.now()
          : false,
        salePrice:
          data.merchandise_spec_by_pk.merchandise.sold_at &&
          new Date(data.merchandise_spec_by_pk.merchandise.sold_at).getTime() > Date.now()
            ? data.merchandise_spec_by_pk.sale_price
            : undefined,
        coverUrl: data.merchandise_spec_by_pk.merchandise.merchandise_imgs[0]?.url,
        // quantity: options.quantity,
        isPhysical: data.merchandise_spec_by_pk.merchandise.is_physical,
        isCustomized: data.merchandise_spec_by_pk.merchandise.is_customized,
        isSubscription: false,
        currencyId: data.merchandise_spec_by_pk.merchandise.currency_id,
      }
    : data?.voucher_plan_by_pk
    ? {
        id: data.voucher_plan_by_pk.id,
        productType: 'VoucherPlan',
        title: data.voucher_plan_by_pk.title,
        isOnSale: false,
        listPrice: data.voucher_plan_by_pk.sale_price,
        salePrice: data.voucher_plan_by_pk.sale_price,
        saleAmount: data.voucher_plan_by_pk?.sale_amount || 1,
        isSubscription: false,
      }
    : null

  return {
    loading,
    error,
    target,
    type,
  }
}

export const GET_SIMPLE_PRODUCT = gql`
  query GET_SIMPLE_PRODUCT($targetId: uuid!, $startedAt: timestamptz) {
    program_by_pk(id: $targetId) {
      id
      title
      cover_url
      is_subscription
      list_price
      sale_price
      sold_at
      program_categories(order_by: { position: asc }) {
        id
        category {
          id
          name
        }
      }
      program_roles {
        id
        name
        member_id
        member {
          id
          name
        }
      }
    }
    program_plan_by_pk(id: $targetId) {
      id
      title
      list_price
      sale_price
      sold_at
      discount_down_price
      currency_id
      period_amount
      period_type
      group_buying_people
      program {
        id
        title
        cover_url
      }
      auto_renewed
    }
    program_package_plan_by_pk(id: $targetId) {
      id
      title
      list_price
      sale_price
      sold_at
      discount_down_price
      period_amount
      period_type
      is_subscription
      program_package {
        id
        title
        cover_url
      }
    }
    card_by_pk(id: $targetId) {
      id
      title
    }
    activity_ticket_by_pk(id: $targetId) {
      id
      title
      price
      ended_at
      activity {
        id
        title
        cover_url
      }
    }
    project_plan_by_pk(id: $targetId) {
      id
      title
      cover_url
      list_price
      sale_price
      sold_at
      discount_down_price
      period_amount
      period_type
      project {
        id
        title
        expired_at
      }
      is_limited
      is_physical
      is_subscription
    }
    podcast_program_by_pk(id: $targetId) {
      id
      title
      cover_url
      list_price
      sale_price
      sold_at
    }
    podcast_plan_by_pk(id: $targetId) {
      id
      title
      list_price
      sale_price
      sold_at
      creator {
        name
        username
      }
      is_subscription
    }
    appointment_plan_by_pk(id: $targetId) {
      id
      title
      price
      creator {
        name
        username
        picture_url
      }
      appointment_periods(where: { started_at: { _eq: $startedAt } }) {
        started_at
        ended_at
        booked
      }
    }
    merchandise_spec_by_pk(id: $targetId) {
      id
      title
      list_price
      sale_price
      merchandise {
        id
        title
        sold_at
        is_physical
        is_customized
        currency_id
        merchandise_imgs(where: { type: { _eq: "cover" } }) {
          id
          url
        }
      }
    }
    voucher_plan_by_pk(id: $targetId) {
      id
      title
      sale_price
      sale_amount
    }
  }
`

export const useSearchMembers = () => {
  const { authToken } = useAuth()
  // 同一個表單內查過的 email 不重查（null 表示查無此會員），避免每次輸入都把所有 email 重送一次
  const memberIdByEmailRef = useRef(new Map<string, string | null>())
  const searchMembers = async (emails: string[]) => {
    try {
      const targetEmails = emails
        .filter(notEmpty)
        .filter((email, index, array) => MEMBER_EMAIL_REGEX.test(email) && array.indexOf(email) === index)
      if (!authToken) return []

      const memberIdByEmail = memberIdByEmailRef.current
      const uncachedEmails = targetEmails.filter(email => !memberIdByEmail.has(email))
      for (let i = 0; i < uncachedEmails.length; i += MEMBER_LOOKUP_MAX_EMAILS) {
        const chunk = uncachedEmails.slice(i, i + MEMBER_LOOKUP_MAX_EMAILS)
        const members = await lookupMembersByEmail(authToken, chunk)
        chunk.forEach(email => memberIdByEmail.set(email, members.find(member => member.email === email)?.id || null))
      }

      return targetEmails
        .map(email => ({ id: memberIdByEmail.get(email) || '', email }))
        .filter(member => member.id && member.email)
    } catch {
      return []
    }
  }

  return searchMembers
}
