import { Select } from '@chakra-ui/react'
import { Form } from 'antd'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { checkoutMessages } from '@lodestar/helpers/translation'
import { PaymentOption, PaymentProps } from '@lodestar/types/checkout'
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

export type PaymentSelectorProps = {
  value: PaymentProps | null
  onChange: (value: PaymentProps | null) => void
  paymentOptions: PaymentOption[]
  isValidating?: boolean
}

const PaymentSelector: React.FC<PaymentSelectorProps> = ({ value, onChange, paymentOptions, isValidating }) => {
  const { formatMessage } = useIntl()
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
            (paymentOption) => JSON.stringify(paymentOption.payment) === JSON.stringify(selectedPaymentMethod),
          )
            ? JSON.stringify(selectedPaymentMethod)
            : undefined
        }
        onChange={(e) => handleChange(JSON.parse(e.target.value))}
        placeholder={formatMessage(checkoutMessages.label.paymentMethodPlaceholder)}
      >
        {paymentOptions.map((option) => (
          <option key={option.name} value={JSON.stringify(option.payment)}>
            {option.name}
          </option>
        ))}
      </Select>
    </Form.Item>
  )
}

export default PaymentSelector
