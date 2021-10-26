import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import hasura from '../hasura'

export const useEnrolledMembershipCardIds = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_ENROLLED_CARD_IDS,
    hasura.GET_ENROLLED_CARD_IDSVariables
  >(
    gql`
      query GET_ENROLLED_CARD_IDS($memberId: String!) {
        card_enrollment(where: { member_id: { _eq: $memberId } }) {
          card_id
        }
      }
    `,
    {
      variables: { memberId },
    },
  )

  const enrolledMembershipCardIds: string[] =
    loading || error || !data ? [] : data.card_enrollment.map(card => card.card_id)

  return {
    loadingMembershipCardIds: loading,
    errorMembershipCardIds: error,
    enrolledMembershipCardIds,
    refetchMembershipCardIds: refetch,
  }
}

export const useEnrolledMembershipCards = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_ENROLLED_CARDS, hasura.GET_ENROLLED_CARDSVariables>(
    gql`
      query GET_ENROLLED_CARDS($memberId: String!) {
        card_enrollment(where: { member_id: { _eq: $memberId } }, distinct_on: card_id) {
          card {
            id
            title
            description
            template
          }
          updated_at
        }
      }
    `,
    {
      variables: { memberId },
    },
  )

  const enrolledMembershipCards: {
    card: {
      id: string
      title: string
      description: string
      template: string
    }
    updatedAt: Date | null
  }[] =
    loading || error || !data
      ? []
      : data.card_enrollment.map(cardEnrollment => ({
          card: {
            id: cardEnrollment.card?.id || '',
            title: cardEnrollment.card?.title || '',
            description: cardEnrollment.card?.description || '',
            template: cardEnrollment.card?.template || '',
          },
          updatedAt: cardEnrollment.updated_at ? new Date(cardEnrollment.updated_at) : null,
        }))

  return {
    loadingMembershipCards: loading,
    errorMembershipCards: error,
    enrolledMembershipCards,
    refetchMembershipCards: refetch,
  }
}

export const useMembershipCard = (cardId: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_ENROLLED_CARD, hasura.GET_ENROLLED_CARDVariables>(
    gql`
      query GET_ENROLLED_CARD($cardId: uuid!) {
        card_by_pk(id: $cardId) {
          id
          title
          description
          template
          app_id
        }
      }
    `,
    { variables: { cardId } },
  )

  const membershipCard: {
    id: string
    title: string
    description: string
    template: string
  } | null =
    loading || error || !data || !data.card_by_pk
      ? null
      : {
          id: data.card_by_pk.id,
          title: data.card_by_pk.title,
          description: data.card_by_pk.description,
          template: data.card_by_pk.template,
        }

  return {
    loadingMembershipCard: loading,
    errorMembershipCard: error,
    membershipCard,
    refetchMembershipCard: refetch,
  }
}
