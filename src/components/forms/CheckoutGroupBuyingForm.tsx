import { FormControl, FormErrorMessage, FormLabel, ListItem } from '@chakra-ui/react'
import { uniq } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useAuth } from '../../contexts/AuthContext'
import { checkoutMessages, commonMessages } from '../../helpers/translation'
import { useSearchMembers, useSimpleProduct } from '../../hooks/common'
import { CommonLargeTextMixin, CommonTextMixin, CommonTitleMixin } from '../common/index'
import { FormInput } from '../inputs/FormInput'

export const StyledBlockTitle = styled.h2`
  ${CommonTitleMixin}
`
export const StyledListItem = styled(ListItem)`
  && {
    ${CommonTextMixin}
  }
`
const StyledPlanTitle = styled.h3`
  ${CommonLargeTextMixin}
  line-height: 1.5;
`
const StyledFormLabel = styled(FormLabel)`
  && {
    color: var(--gray-darker);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.4px;
  }
`

let timeout: NodeJS.Timeout | null = null

const CheckoutGroupBuyingForm: React.FC<{
  partnerCount: number
  title?: string
  productId?: string
  onChange?: (value: { memberIds: string[]; memberEmails: string[]; withError: boolean }) => void
}> = ({ title, partnerCount, productId, onChange }) => {
  const { formatMessage } = useIntl()
  const { currentMember } = useAuth()
  const searchEmails = useSearchMembers()
  const { target } = useSimpleProduct({ id: productId || '' })
  const [emails, setEmails] = useState<string[]>(new Array(partnerCount).fill(''))
  const [, setMembers] = useState<{ id: string; email: string }[]>([])

  useEffect(
    () => setEmails(emails => new Array(partnerCount).fill('').map((blankEmail, index) => emails[index] || blankEmail)),
    [partnerCount],
  )
  
  const checkEmail = (email: string) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/
    const isInvalid = !!email && !emailRegex.test(email)
    const isSelf = !!email && email === currentMember?.email
    const isDuplicated = !!email && emails.filter(v => v === email).length > 1
    const isError = isInvalid || isSelf || isDuplicated
    return { isInvalid, isSelf, isDuplicated, isError }
  }

  const handleChange = (value: string, index: number) => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }

    timeout = setTimeout(async () => {
      const newEmails = emails.map((v, i) => (i === index ? value : v))
      setEmails(newEmails)
      const errors = newEmails.map(email => {
        const { isError } = checkEmail(email)
        return isError
      })
      const members = await searchEmails(uniq(newEmails))
      const registeredMemberEmail = members.map(member => {
        return member.email
      })
      newEmails.forEach(newEmail => {
        if (registeredMemberEmail.includes(newEmail) === false) {
          members.push({ id: '', email: newEmail })
        }
      })

      setMembers(members)
      onChange?.({
        memberIds: members.map(member => member.id),
        memberEmails: members.map(member => member.email),
        withError: errors.includes(true),
      })
    }, 300)
  }

  return (
    <div className="mb-4">
      <StyledPlanTitle className="mb-3">
        {formatMessage(checkoutMessages.label.groupBuyingPlan, { title: target?.title || title })}
      </StyledPlanTitle>

      {emails.map((email, i) => {
        const { isInvalid, isSelf, isDuplicated, isError } = checkEmail(email)
        const errorMessage = isInvalid
          ? formatMessage(commonMessages.text.emailFormatError)
          : isSelf
          ? formatMessage(commonMessages.text.selfReferringIsNotAllowed)
          : isDuplicated
          ? formatMessage(checkoutMessages.text.existingPartner)
          : undefined

        return (
          <div key={i} className="col-12 col-lg-6 px-0 mb-3">
            <FormControl isInvalid={isError}>
              <StyledFormLabel>{formatMessage(checkoutMessages.label.partnerEmail, { index: i + 1 })}</StyledFormLabel>
              <FormInput
                type="email"
                status={email ? (isError ? 'error' : 'success') : undefined}
                placeholder={formatMessage(checkoutMessages.text.fillInPartnerEmail)}
                onChange={e => handleChange(e.target.value, i)}
              />
              {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
            </FormControl>
          </div>
        )
      })}
    </div>
  )
}

export default CheckoutGroupBuyingForm
