import { gql, useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useApp } from '@lodestar/contexts/AppContext'
import hasura from '@lodestar/graphql/hasura'
import { checkoutMessages } from '@lodestar/helpers/translation'
import { MemberCreditCard, PaymentGatewayType, PaymentMethodType, PaymentOption } from '@lodestar/types/checkout'

const GET_MEMBER_COIN_REMAINING = gql`
  query GET_MEMBER_COIN_REMAINING($memberId: String!) {
    coin_status(where: { member_id: { _eq: $memberId } }) {
      remaining
    }
  }
`

const GET_MEMBER_CREDIT_CARDS = gql`
  query GET_MEMBER_CREDIT_CARDS($memberId: String!) {
    member_card(where: { member_id: { _eq: $memberId } }) {
      id
      card_identifier
      card_info
      card_holder
    }
  }
`

const GET_PAYMENT_GATEWAY_METHOD = gql`
  query getPaymentGatewayMethod($availablePaymentGateways: [String!]!) {
    app_payment_gateway_method(
      where: {
        status: { _eq: "enabled" }
        app_payment_gateway: { app_id: { _eq: "tli1956" }, gateway: { name: { _in: $availablePaymentGateways } } }
      }
    ) {
      method {
        name
      }
      app_payment_gateway {
        gateway {
          name
        }
      }
    }
  }
`

export const useMemberCoinsRemaining = (memberId: string) => {
  const { loading, error, data } = useQuery<
    hasura.GET_MEMBER_COIN_REMAINING,
    hasura.GET_MEMBER_COIN_REMAININGVariables
  >(GET_MEMBER_COIN_REMAINING, {
    variables: { memberId },
    skip: !memberId,
  })

  const remainingCoins = data?.coin_status.reduce<number>((total, coin) => {
    return (total += coin.remaining)
  }, 0)

  return {
    loadingMemberCoinsRemaining: loading,
    errorMemberCoinsRemaining: error,
    remainingCoins,
  }
}

export const useMemberCreditCards = (memberId: string) => {
  const { loading, error, data } = useQuery<hasura.GET_MEMBER_CREDIT_CARDS, hasura.GET_MEMBER_CREDIT_CARDSVariables>(
    GET_MEMBER_CREDIT_CARDS,
    { variables: { memberId }, skip: !memberId },
  )
  const memberCreditCards = useMemo<MemberCreditCard[]>(
    () =>
      data?.member_card.map<MemberCreditCard>((memberCreditCard) => ({
        id: memberCreditCard.id,
        cardInfo: memberCreditCard.card_info,
        cardIdentifier: memberCreditCard.card_identifier,
        cardHolder: memberCreditCard.card_holder ?? null,
      })) || [],
    [data],
  )

  return {
    loadingMemberCreditCards: loading,
    errorMemberCreditCards: error,
    memberCreditCards,
  }
}

type PaymentGatewayMethodResult = {
  method?: { name: string } | null
  app_payment_gateway?: { gateway?: { name: string } | null } | null
}

// eslint-disable-next-line react-hooks/rules-of-hooks
export const usePaymentGatewayMethod = () => {
  const {
    settings: { AVAILABLE_PAYMENT_GATEWAYS },
  } = useApp()
  const availablePaymentGateways: string[] = JSON.parse(AVAILABLE_PAYMENT_GATEWAYS)
  const { formatMessage } = useIntl()
  // The generated `hasura.getPaymentGatewayMethodVariables` type was codegen'd
  // before `$availablePaymentGateways` was added to the query. The query itself
  // has always taken that variable — pass it as a narrow structural shape rather
  // than re-generating the codegen.
  const { data, loading, error } = useQuery<hasura.getPaymentGatewayMethod, { availablePaymentGateways: string[] }>(
    GET_PAYMENT_GATEWAY_METHOD,
    { variables: { availablePaymentGateways } },
  )

  const paymentOptions = useMemo<PaymentOption[]>(() => {
    const result = data?.app_payment_gateway_method.reduce<{
      methodCount: { [key: string]: number }
      paymentOptions: PaymentOption[]
    }>(
      ({ methodCount, paymentOptions: acc }, currentValue: PaymentGatewayMethodResult) => {
        const method = currentValue.method?.name || ''
        const gateway = currentValue.app_payment_gateway?.gateway?.name || ''
        const methodLabel = checkoutMessages.label[method as PaymentMethodType]
        const gatewayLabel = checkoutMessages.label[gateway as PaymentGatewayType]
        const name =
          (methodLabel ? formatMessage(methodLabel) : method) +
          (methodCount[method] || gateway === 'paypal'
            ? ` ( ${gatewayLabel ? formatMessage(gatewayLabel) : gateway} )`
            : '')
        methodCount[method] = methodCount[method] ? methodCount[method] + 1 : 1

        return {
          methodCount,
          paymentOptions: [
            ...acc,
            {
              payment: { gateway, method },
              name,
            },
          ],
        }
      },
      { methodCount: {}, paymentOptions: [] },
    )
    return result?.paymentOptions ?? []
  }, [data, formatMessage])

  return {
    loadingPaymentGatewayMethod: loading,
    errorPaymentGatewayMethod: error,
    paymentOptions,
  }
}
