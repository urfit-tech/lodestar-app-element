import { Radio } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio'
import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { MemberCreditCard } from '@lodestar/types/checkout'
import selectorsMessages from './translation'

const StyledRadio = styled(Radio)`
  display: block !important;
  height: 48px;
  line-height: 48px !important;
`

export type CardHolder = {
  phoneNumber: string
  name: string
  email: string
  zipCode?: string
  address?: string
  nationalId?: string
}

export type CreditCardSelectorProps = {
  memberCreditCards: MemberCreditCard[]
  value?: string | null
  onChange?: (value: string | null) => void
}

const CreditCardSelector: React.FC<CreditCardSelectorProps> = ({ memberCreditCards, value, onChange }) => {
  const { formatMessage } = useIntl()

  const handleCreditCardChange = (e: RadioChangeEvent) => {
    const value = e.target.value
    onChange && onChange(value === 'new' ? null : value)
  }

  useEffect(() => {
    onChange?.(memberCreditCards[0]?.id)
  }, [memberCreditCards, onChange])

  return (
    <Radio.Group onChange={handleCreditCardChange} value={value === null ? 'new' : value}>
      {memberCreditCards.map((memberCreditCard) => {
        return (
          <StyledRadio key={memberCreditCard.cardIdentifier} value={memberCreditCard.id}>
            <span className="ml-1">
              {formatMessage(selectorsMessages.CreditCardSelector.lastFourDigits)}
              {memberCreditCard.cardInfo['last_four']}
            </span>
          </StyledRadio>
        )
      })}
      <StyledRadio value="new">
        <span className="ml-1">{formatMessage(selectorsMessages.CreditCardSelector.addCreditCard)}</span>
      </StyledRadio>
    </Radio.Group>
  )
}

export default CreditCardSelector
