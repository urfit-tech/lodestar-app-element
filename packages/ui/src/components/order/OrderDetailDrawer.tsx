import { gql, useQuery } from '@apollo/client'
import { CloseButton, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, HStack } from '@chakra-ui/react'
import { Skeleton } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { sum } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import hasura from '../../hasura'
import { currencyFormatter } from '../../helpers'
import { OrderDiscount, OrderLog, OrderProduct, PaymentLog } from '../../types/order'
import InvoiceCard from './InvoiceCard'
import OrderCard from './OrderCard'
import OrderOtherInfoCard from './OrderOtherInfoCard'
import PaymentCard from './PaymentCard'
import orderMessages from './translation'

dayjs.extend(timezone)
dayjs.extend(utc)

const currentTimeZone = dayjs.tz.guess()

const StyledDrawerTitle = styled.p`
  color: var(--gray-darker);
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
`

const StyledTitle = styled.p`
  color: var(--gray-darker);
  font-size: 20px;
  font-weight: bold;
  line-height: 38px;
  letter-spacing: 0.8px;
  margin: 32px 0px;
`

const OrderDetailDrawer: React.FC<{
  orderLogId: string | null
  onClose: () => void
  renderTrigger?: React.FC
}> = ({ orderLogId, onClose, renderTrigger }) => {
  const { formatMessage } = useIntl()
  const isOpen = Boolean(orderLogId)

  const {
    loadingOrderDetail,
    loadingSharingCode,
    orderLog,
    sharingCodes,
    orderProducts,
    orderDiscounts,
    totalPrice,
    orderExecutors,
    paymentLogs,
  } = useOrderDetail(orderLogId)

  return (
    <>
      {renderTrigger?.({})}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <HStack>
              <CloseButton onClick={onClose} />
              <StyledDrawerTitle>{formatMessage(orderMessages.OrderDetailDrawer.orderInfo)}</StyledDrawerTitle>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            {loadingOrderDetail ? (
              <Skeleton />
            ) : (
              <OrderCard
                orderId={orderLogId || ''}
                status={orderLog.status}
                createdAt={dayjs(orderLog.createdAt).tz(currentTimeZone).format('YYYY-MM-DD HH:mm')}
                name={orderLog.name}
                email={orderLog.email}
                totalPrice={currencyFormatter(totalPrice) || ''}
                orderProducts={orderProducts}
                orderDiscounts={orderDiscounts}
              />
            )}
            <StyledTitle>{formatMessage(orderMessages.OrderDetailDrawer.otherInfo)}</StyledTitle>
            {loadingOrderDetail && loadingSharingCode ? (
              <Skeleton />
            ) : (
              <OrderOtherInfoCard
                country={`${orderLog.options?.country || ''}${
                  (orderLog.options?.countryCode && `(${orderLog.options?.countryCode})`) || ''
                }`}
                referrer={orderLog.invoiceOptions?.referrerEmail || ''}
                sharingCode={sharingCodes.sharingCode}
                sharingNote={sharingCodes.sharingNote}
                orderLogExecutor={orderExecutors.map(v => `${v.name} - ${v.ratio}`).join('\\') || ''}
                giftPlan={orderProducts.reduce(
                  (accu, orderProduct) => (orderProduct.options?.type === 'gift' ? accu + orderProduct.name : accu),
                  '',
                )}
                recipientName={orderLog.shipping?.isOutsideTaiwanIsland === 'true' ? '' : orderLog.shipping?.name || ''}
                recipientPhone={
                  orderLog.shipping?.isOutsideTaiwanIsland === 'true' ? '' : orderLog.shipping?.phone || ''
                }
                recipientAddress={
                  orderLog.shipping?.isOutsideTaiwanIsland === 'true'
                    ? ''
                    : `${orderLog.shipping?.zipCode || ''}${orderLog.shipping?.city || ''}${
                        orderLog.shipping?.district || ''
                      }${orderLog.shipping?.address || ''}`
                }
              />
            )}
            <StyledTitle>{formatMessage(orderMessages.OrderDetailDrawer.invoiceInfo)}</StyledTitle>
            {loadingOrderDetail ? (
              <Skeleton />
            ) : (
              <InvoiceCard
                status={orderLog.invoiceOptions?.status || ''}
                invoiceIssuedAt={
                  orderLog.invoiceIssuedAt
                    ? dayjs(orderLog.invoiceIssuedAt).tz(currentTimeZone).format('YYYY-MM-DD HH:mm:ss')
                    : ''
                }
                invoiceNumber={orderLog.invoiceOptions?.invoiceNumber || ''}
                invoiceName={orderLog.invoiceOptions?.name || ''}
                invoicePhone={orderLog.invoiceOptions?.phone || ''}
                invoiceEmail={orderLog.invoiceOptions?.email || ''}
                invoiceTarget={
                  orderLog.invoiceOptions?.donationCode
                    ? formatMessage(orderMessages.OrderDetailDrawer.donation)
                    : orderLog.invoiceOptions?.uniformNumber
                    ? formatMessage(orderMessages.OrderDetailDrawer.company)
                    : formatMessage(orderMessages.OrderDetailDrawer.personal)
                }
                donationCode={orderLog.invoiceOptions?.donationCode || ''}
                invoiceCarrier={
                  orderLog.invoiceOptions?.phoneBarCode
                    ? formatMessage(orderMessages.OrderDetailDrawer.phone)
                    : orderLog.invoiceOptions?.citizenCode
                    ? formatMessage(orderMessages.OrderDetailDrawer.citizenCertificate)
                    : ''
                }
                uniformNumber={orderLog.invoiceOptions?.uniformNumber || ''}
                uniformTitle={orderLog.invoiceOptions?.uniformTitle || ''}
                invoiceAddress={`${orderLog.invoiceOptions?.postCode || ''} ${orderLog.invoiceOptions?.address || ''}`}
              />
            )}
            <StyledTitle>{formatMessage(orderMessages.OrderDetailDrawer.paymentInfo)}</StyledTitle>
            {loadingOrderDetail ? <Skeleton /> : <PaymentCard payments={paymentLogs} order={orderLog} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

const useOrderDetail = (orderLogId: string | null) => {
  const {
    loading: loadingOrderDetail,
    error: errorOrderDetail,
    data: orderDetailData,
  } = useQuery<hasura.GetOrderDetail, hasura.GetOrderDetailVariables>(
    gql`
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
    `,
    { variables: { orderLogId: orderLogId || '' } },
  )

  const {
    loading: loadingSharingCode,
    error: errorSharingCode,
    data: sharingCodeData,
  } = useQuery<hasura.GetSharingCode, hasura.GetSharingCodeVariables>(
    gql`
      query GetSharingCode($paths: [String!]) {
        sharing_code(where: { path: { _in: $paths } }) {
          id
          code
          note
        }
      }
    `,
    {
      variables: {
        paths: orderDetailData?.order_product.map(v => v.options?.from).filter(path => path !== '') || [],
      },
    },
  )

  const orderLog: Pick<
    OrderLog,
    'id' | 'status' | 'createdAt' | 'name' | 'email' | 'shipping' | 'options' | 'invoiceOptions' | 'invoiceIssuedAt'
  > = {
    id: orderDetailData?.order_log_by_pk?.id || '',
    status: orderDetailData?.order_log_by_pk?.status || '',
    createdAt: orderDetailData?.order_log_by_pk?.created_at,
    name: orderDetailData?.order_log_by_pk?.member?.name || '',
    email: orderDetailData?.order_log_by_pk?.member?.email || '',
    shipping: orderDetailData?.order_log_by_pk?.shipping,
    options: orderDetailData?.order_log_by_pk?.options,
    invoiceOptions: orderDetailData?.order_log_by_pk?.invoice_options,
    invoiceIssuedAt: orderDetailData?.order_log_by_pk?.invoice_issued_at,
  }

  const orderProducts: Pick<OrderProduct, 'id' | 'name' | 'price' | 'options'>[] =
    orderDetailData?.order_product.map(v => ({
      id: v.id,
      name: v.name,
      price: v.price,
      options: v.options,
    })) || []

  const orderDiscounts: Pick<OrderDiscount, 'id' | 'price' | 'name'>[] =
    orderDetailData?.order_discount.map(v => ({
      id: v.id,
      price: v.price,
      name: v.name,
    })) || []

  const productPrice = sum(orderProducts.map(v => v.price))
  const discountPrice = sum(orderDiscounts.map(orderDiscount => orderDiscount.price))
  const shippingFee = orderLog.shipping?.fee || 0
  const totalPrice = Math.max(productPrice - discountPrice + shippingFee)

  const orderExecutors: {
    id: string
    ratio: number
    name: string
  }[] =
    orderDetailData?.order_executor.map(v => ({
      id: v.id,
      ratio: v.ratio,
      name: v.member.name,
    })) || []

  const sharingCodes: { sharingCode: string; sharingNote: string } = {
    sharingCode: sharingCodeData?.sharing_code?.map(v => v.code).join(', ') || '',
    sharingNote: sharingCodeData?.sharing_code?.map(v => v.code).join(', ') || '',
  }

  const paymentLogs: Pick<PaymentLog, 'no' | 'status' | 'price' | 'gateway' | 'paidAt' | 'options'>[] =
    orderDetailData?.payment_log.map(v => ({
      no: v.no,
      status: v.status || '',
      price: v.price,
      gateway: v.gateway || '',
      paidAt: v.paid_at,
      options: v.options,
    })) || []

  return {
    loadingOrderDetail,
    loadingSharingCode,
    errorOrderDetail,
    errorSharingCode,
    orderLog,
    sharingCodes,
    orderProducts,
    orderDiscounts,
    totalPrice,
    orderExecutors,
    paymentLogs,
  }
}

export default OrderDetailDrawer
