import { gql, useQuery } from '@apollo/client'
import { Radio } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio'
import React, { useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import hasura from '../../hasura'
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
type CreditCardSelectorProps = {
  memberId: string
  value?: string | null
  onChange?: (value: string | null) => void
}
const CreditCardSelector: React.FC<CreditCardSelectorProps> = ({ memberId, value, onChange }) => {
  const { memberCreditCards } = useMemberCreditCards(memberId)
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
      {memberCreditCards.map(memberCreditCard => {
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

export const useMemberCreditCards = (memberId: string) => {
  const { data } = useQuery<hasura.GET_MEMBER_CREDIT_CARDS, hasura.GET_MEMBER_CREDIT_CARDSVariables>(
    gql`
      query GET_MEMBER_CREDIT_CARDS($memberId: String!) {
        member_card(where: { member_id: { _eq: $memberId } }) {
          id
          card_identifier
          card_info
          card_holder
        }
      }
    `,
    { variables: { memberId } },
  )
  const memberCreditCards = useMemo(
    () =>
      data?.member_card.map(memberCreditCard => ({
        id: memberCreditCard.id,
        cardInfo: memberCreditCard.card_info,
        cardIdentifier: memberCreditCard.card_identifier,
        cardHolder: memberCreditCard.card_holder,
      })) || [],
    [data],
  )

  return { memberCreditCards }
}

export default CreditCardSelector
