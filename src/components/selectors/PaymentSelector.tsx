/* eslint-disable react-hooks/rules-of-hooks */
import { gql, useQuery } from '@apollo/client'
import { Select } from '@chakra-ui/react'
import { Form } from 'antd'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../contexts/AppContext'
import * as hasura from '../../hasura'
import { checkoutMessages } from '../../helpers/translation'
import { PaymentGatewayType, PaymentMethodType, PaymentProps } from '../../types/checkout'
import { CommonTitleMixin } from '../common'

const StyledTitle = styled.h1`
  margin-bottom: 0.75rem;
  line-height: 1.5;
  ${CommonTitleMixin}
`
const StyledDescription = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
  line-height: 1.5;
`

const PaymentSelector: React.FC<{
  value: PaymentProps | null
  onChange: (value: PaymentProps | null) => void
  isValidating?: boolean
}> = ({ value, onChange, isValidating }) => {
  const { formatMessage } = useIntl()
  const paymentOptions = getPaymentOptions() || []
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentProps | null>(value)

  const handleChange = (paymentType?: PaymentProps | null) => {
    const currentPaymentOption = typeof paymentType === 'undefined' ? selectedPaymentMethod : paymentType
    typeof paymentType !== 'undefined' && setSelectedPaymentMethod(paymentType)
    if (currentPaymentOption) {
      localStorage.setItem('kolable.cart.payment.perpetual', JSON.stringify(currentPaymentOption))
      onChange?.(currentPaymentOption)
    }
  }

  return (
    <Form.Item
      className="mb-0"
      style={{ width: '50%' }}
      required
      validateStatus={isValidating && !selectedPaymentMethod ? 'error' : undefined}
      help={isValidating && !selectedPaymentMethod && formatMessage(checkoutMessages.label.paymentMethodPlaceholder)}
    >
      <StyledTitle>{formatMessage(checkoutMessages.label.paymentMethod)}</StyledTitle>
      <StyledDescription className="mb-4">{formatMessage(checkoutMessages.message.warningPayment)}</StyledDescription>
      <Select
        value={
          selectedPaymentMethod &&
            paymentOptions.some(
              paymentOption => JSON.stringify(paymentOption.payment) === JSON.stringify(selectedPaymentMethod),
            )
            ? JSON.stringify(selectedPaymentMethod)
            : undefined
        }
        onChange={e => handleChange(JSON.parse(e.target.value))}
        placeholder={formatMessage(checkoutMessages.label.paymentMethodPlaceholder)}
      >
        {paymentOptions.map(option => (
          <option key={option.name} value={JSON.stringify(option.payment)}>
            {option.name}
          </option>
        ))}
      </Select>
    </Form.Item>
  )
}

const getPaymentOptions = () => {
  const { settings } = useApp()
  // 未設定 AVAILABLE_PAYMENT_GATEWAYS 時 fallback 為空陣列,代表「不限制」→ 顯示該 app 全部啟用的 gateway
  const availablePaymentGateways: string[] = JSON.parse(settings['AVAILABLE_PAYMENT_GATEWAYS'] || '[]')
  const maskedGateways: string[] = settings['payment.payment_gateway_mask']
    ? JSON.parse(settings['payment.payment_gateway_mask'])
    : []
  const { formatMessage } = useIntl()
  const { data, loading, error } = useQuery<hasura.getPaymentGatewayMethod>(
    gql`
      query getPaymentGatewayMethod {
        app_payment_gateway_method(where: { status: { _eq: "enabled" } }) {
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
    `,
  )

  const paymentOptions = data?.app_payment_gateway_method.reduce<{
    methodCount: { [key: string]: number }
    paymentOptions: {
      payment: {
        gateway: string
        method: string
      }
      name: string
    }[]
  }>(
    ({ methodCount, paymentOptions }, currentValue) => {
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
          ...paymentOptions,
          {
            payment: { gateway, method },
            name,
          },
        ],
      }
    },
    { methodCount: {}, paymentOptions: [] },
  ).paymentOptions

  return paymentOptions
    ?.filter(
      // 白名單:有設定才套用,沒設定(空陣列)則顯示全部
      option => availablePaymentGateways.length === 0 || availablePaymentGateways.includes(option.payment.gateway),
    )
    .filter(option => !maskedGateways.includes(option.payment.gateway))
}

export default PaymentSelector
