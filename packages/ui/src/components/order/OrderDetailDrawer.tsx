import { CloseButton, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, HStack } from '@chakra-ui/react'
import { Skeleton } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { currencyFormatter } from '@lodestar/helpers'
import { OrderDetailView, SharingCodes } from '@lodestar/types/order'
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

export type OrderDetailDrawerProps = {
  orderLogId: string | null
  onClose: () => void
  renderTrigger?: React.FC
  orderDetail: OrderDetailView
  sharingCodes: SharingCodes
  loadingOrderDetail?: boolean
  loadingSharingCode?: boolean
}

const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({
  orderLogId,
  onClose,
  renderTrigger,
  orderDetail,
  sharingCodes,
  loadingOrderDetail = false,
  loadingSharingCode = false,
}) => {
  const { formatMessage } = useIntl()
  const isOpen = Boolean(orderLogId)

  const { orderLog, orderProducts, orderDiscounts, orderExecutors, paymentLogs, totalPrice } = orderDetail

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

export default OrderDetailDrawer
