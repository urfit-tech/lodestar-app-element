import { gql, useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { sum } from 'ramda'
import hasura from '@lodestar/graphql/hasura'
import { OrderDetailView } from '@lodestar/types/order'

const GET_ORDER_DETAIL_QUERY = gql`
  query GetOrderDetail($orderLogId: String!) {
    order_log_by_pk(id: $orderLogId) {
      id
      status
      created_at
      member {
        id
        name
        email
      }
      options
      invoice_options
      invoice_issued_at
      shipping
    }
    order_product(where: { order_id: { _eq: $orderLogId } }) {
      id
      price
      name
      options
    }
    order_discount(where: { order_id: { _eq: $orderLogId } }) {
      id
      price
      name
    }
    payment_log(where: { order_id: { _eq: $orderLogId } }) {
      no
      created_at
      status
      price
      gateway
      paid_at
      method
      custom_no
      options
    }
    order_executor(where: { order_id: { _eq: $orderLogId } }) {
      id
      ratio
      member {
        id
        name
      }
    }
  }
`

const GET_SHARING_CODE_QUERY = gql`
  query GetSharingCode($paths: [String!]) {
    sharing_code(where: { path: { _in: $paths } }) {
      id
      code
      note
    }
  }
`

export type UseOrderDetailResult = {
  data: OrderDetailView
  loading: boolean
  error?: Error
}

const composeOrderDetail = (data: hasura.GetOrderDetail | undefined): OrderDetailView => {
  const orderLog: OrderDetailView['orderLog'] = {
    id: data?.order_log_by_pk?.id || '',
    status: data?.order_log_by_pk?.status || '',
    createdAt: data?.order_log_by_pk?.created_at,
    name: data?.order_log_by_pk?.member?.name || '',
    email: data?.order_log_by_pk?.member?.email || '',
    shipping: data?.order_log_by_pk?.shipping,
    options: data?.order_log_by_pk?.options,
    invoiceOptions: data?.order_log_by_pk?.invoice_options,
    invoiceIssuedAt: data?.order_log_by_pk?.invoice_issued_at,
  }

  const orderProducts: OrderDetailView['orderProducts'] =
    data?.order_product.map((v) => ({
      id: v.id,
      name: v.name,
      price: v.price,
      options: v.options,
    })) || []

  const orderDiscounts: OrderDetailView['orderDiscounts'] =
    data?.order_discount.map((v) => ({
      id: v.id,
      price: v.price,
      name: v.name,
    })) || []

  const orderExecutors: OrderDetailView['orderExecutors'] =
    data?.order_executor.map((v) => ({
      id: v.id,
      ratio: v.ratio,
      name: v.member.name,
    })) || []

  const paymentLogs: OrderDetailView['paymentLogs'] =
    data?.payment_log.map((v) => ({
      no: v.no,
      status: v.status || '',
      price: v.price,
      gateway: v.gateway || '',
      paidAt: v.paid_at,
      options: v.options,
    })) || []

  const productPrice = sum(orderProducts.map((v) => v.price))
  const discountPrice = sum(orderDiscounts.map((d) => d.price))
  const shippingFee = orderLog.shipping?.fee || 0
  const totalPrice = Math.max(productPrice - discountPrice + shippingFee)

  return {
    orderLog,
    orderProducts,
    orderDiscounts,
    orderExecutors,
    paymentLogs,
    totalPrice,
  }
}

export const useOrderDetail = (orderLogId: string | null): UseOrderDetailResult => {
  const {
    loading,
    error,
    data: rawData,
  } = useQuery<hasura.GetOrderDetail, hasura.GetOrderDetailVariables>(GET_ORDER_DETAIL_QUERY, {
    variables: { orderLogId: orderLogId || '' },
    skip: !orderLogId,
  })

  const data = useMemo<OrderDetailView>(() => composeOrderDetail(rawData), [rawData])

  return {
    data,
    loading,
    error: error && new Error(error.message),
  }
}

export type UseSharingCodesResult = {
  data: { sharingCode: string; sharingNote: string }
  loading: boolean
  error?: Error
}

export const useSharingCodes = (paths: string[]): UseSharingCodesResult => {
  const {
    loading,
    error,
    data: rawData,
  } = useQuery<hasura.GetSharingCode, hasura.GetSharingCodeVariables>(GET_SHARING_CODE_QUERY, {
    variables: { paths },
  })

  const data = useMemo(
    () => ({
      sharingCode: rawData?.sharing_code?.map((v) => v.code).join(', ') || '',
      sharingNote: rawData?.sharing_code?.map((v) => v.code).join(', ') || '',
    }),
    [rawData],
  )

  return {
    data,
    loading,
    error: error && new Error(error.message),
  }
}
