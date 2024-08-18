import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { OrderLog, PaymentLog } from '../../types/order'
import orderMessages from './translations'

dayjs.extend(timezone)
dayjs.extend(utc)

const currentTimeZone = dayjs.tz.guess()

const StyledCard = styled.div`
  padding: 16px;
  border-radius: 4px;
  border: solid 1px #ececec;
  margin-bottom: 16px;
`

const StyledInfoTitle = styled.div`
  color: var(--gray-darker);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.2px;
  width: 35%;
`

const StyledInfoMessage = styled.div`
  width: 65%;
`

const PaymentCard: React.FC<{
  payments: Pick<PaymentLog, 'no' | 'status' | 'price' | 'gateway' | 'paidAt' | 'options'>[]
  order: Pick<
    OrderLog,
    'id' | 'status' | 'createdAt' | 'name' | 'email' | 'shipping' | 'options' | 'invoiceOptions' | 'invoiceIssuedAt'
  >
}> = ({ payments, order }) => {
  const { formatMessage } = useIntl()

  return (
    <>
      {payments
        .sort((a, b) => Number(a.no[a.no.length - 1]) - Number(b.no[b.no.length - 1]))
        .map((payment, index) => {
          const contentList = [
            { title: formatMessage(orderMessages.PaymentCard.paymentStatus), message: payment.status, isRender: true },
            {
              title: formatMessage(orderMessages.PaymentCard.paidAt),
              message: payment.paidAt ? dayjs(payment.paidAt).tz(currentTimeZone).format('YYYY-MM-DD HH:mm') : '',
              isRender: true,
            },
            {
              title: formatMessage(orderMessages.PaymentCard.paymentNo),
              message: payment.no,
              isRender: true,
            },
            {
              title: formatMessage(orderMessages.PaymentCard.price),
              message: payment.price.toLocaleString(),
              isRender: true,
            },
            { title: formatMessage(orderMessages.PaymentCard.gateway), message: payment.gateway, isRender: true },
          ]
          return (
            <StyledCard key={payment.no}>
              <div className="container">
                {contentList.map((row, idx) =>
                  row.isRender ? (
                    <div className="row mb-2 justify-content-between" key={idx}>
                      <StyledInfoTitle className="column">{row.title}</StyledInfoTitle>
                      <StyledInfoMessage className="column">{row.message}</StyledInfoMessage>
                    </div>
                  ) : null,
                )}
                {!!order.options?.installmentPlans && (
                  <div className="row mb-2 justify-content-between">
                    <StyledInfoTitle className="column">款項</StyledInfoTitle>
                    <StyledInfoMessage className="column">
                      {order.options?.installmentPlans?.length === 2
                        ? order.options?.installmentPlans?.filter(plan => plan.price === payment.price)[0]?.index === 0
                          ? '訂金'
                          : '尾款'
                        : `${
                            order.options?.installmentPlans?.filter(plan => plan.price === payment.price)[0]?.index + 1
                          } 期`}
                    </StyledInfoMessage>
                  </div>
                )}
                {!!payment.options?.bankCode && (
                  <div className="row mb-2 justify-content-between">
                    <StyledInfoTitle className="column">銀行後五碼</StyledInfoTitle>
                    <StyledInfoMessage className="column">{payment.options?.bankCode}</StyledInfoMessage>
                  </div>
                )}
              </div>
            </StyledCard>
          )
        })}
    </>
  )
}
export default PaymentCard
