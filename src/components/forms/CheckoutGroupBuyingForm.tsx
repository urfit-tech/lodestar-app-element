import { FormControl, FormErrorMessage, FormLabel, ListItem } from '@chakra-ui/react'
import { uniq } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { FormInput } from '../../components/input/FormInput'
import { useAuth } from '../../contexts/AuthContext'
import { checkoutMessages, commonMessages } from '../../helpers/translation'
import { useSearchMembers, useSimpleProduct } from '../../hooks/common'
import { CommonLargeTextMixin, CommonTextMixin, CommonTitleMixin } from '../common/index'

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
  onChange?: (value: { memberIds: string[]; withError: boolean }) => void
}> = ({ title, partnerCount, productId, onChange }) => {
  const { formatMessage } = useIntl()
  const { currentMember } = useAuth()
  const searchEmails = useSearchMembers()
  const { target } = useSimpleProduct({ id: productId || '' })
  const [emails, setEmails] = useState<string[]>(new Array(partnerCount).fill(''))
  const [members, setMembers] = useState<{ id: string; email: string }[]>([])

  useEffect(
    () => setEmails(emails => new Array(partnerCount).fill('').map((blankEmail, index) => emails[index] || blankEmail)),
    [partnerCount],
  )

  const handleChange = (value: string, index: number) => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }

    timeout = setTimeout(async () => {
      const newEmails = emails.map((v, i) => (i === index ? value : v))
      setEmails(newEmails)
      const members = await searchEmails(uniq(newEmails))
      setMembers(members)
      onChange?.({
        memberIds: members.map(member => member.id),
        withError: newEmails.filter(v => !!v).length !== members.length,
      })
    }, 300)
  }

  return (
    <div className="mb-4">
      <StyledPlanTitle className="mb-3">
        {formatMessage(checkoutMessages.label.groupBuyingPlan, { title: target?.title || title })}
      </StyledPlanTitle>

      {emails.map((email, i) => {
        const isInvalid = !!email && members.every(member => member.email !== email)
        const isSelf = !!email && email === currentMember?.email
        const isDuplicated = !!email && emails.filter(v => v === email).length > 1
        const errorMessage = isInvalid
          ? formatMessage(commonMessages.text.notFoundMemberEmail)
          : isSelf
          ? formatMessage(commonMessages.text.selfReferringIsNotAllowed)
          : isDuplicated
          ? formatMessage(checkoutMessages.text.existingPartner)
          : undefined

        return (
          <div key={i} className="col-12 col-lg-6 px-0 mb-3">
            <FormControl isInvalid={isInvalid || isSelf || isDuplicated}>
              <StyledFormLabel>{formatMessage(checkoutMessages.label.partnerEmail)}</StyledFormLabel>
              <FormInput
                type="email"
                status={email ? (isInvalid || isSelf || isDuplicated ? 'error' : 'success') : undefined}
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
