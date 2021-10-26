import { FormControl, FormErrorMessage, FormLabel, ListItem, OrderedList, Stat } from '@chakra-ui/react'
import { uniq } from 'ramda'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useAuth } from '../../contexts/AuthContext'
import { CommonLargeTextMixin, CommonTextMixin, CommonTitleMixin } from '../../helpers/style'
import { checkoutMessages, commonMessages } from '../../helpers/translation'
import { useSearchMembers } from '../../hooks/member'
import { FormInput } from '../input/FormInput'
import GroupBuyingRuleModal from '../modals/GroupBuyingRuleModal'

const StyledBlockTitle = styled.h2`
  ${CommonTitleMixin}
`

const StyledPlanTitle = styled.h3`
  ${CommonLargeTextMixin}
  line-height: 1.5;
`

const StyledListItem = styled(ListItem)`
  && {
    ${CommonTextMixin}
  }
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
  title: string
  partnerCount: number
  onChange?: (value: { memberIds: string[]; withError: boolean }) => void
}> = ({ title, partnerCount, onChange }) => {
  const { formatMessage } = useIntl()
  const { currentMember } = useAuth()
  const searchEmails = useSearchMembers()
  const [emails, setEmails] = useState<string[]>(new Array(partnerCount).fill(''))
  const [members, setMembers] = useState<{ id: string; email: string }[]>([])

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
    <Stat>
      <StyledBlockTitle className="mb-3">{formatMessage(checkoutMessages.label.groupBuying)}</StyledBlockTitle>
      <OrderedList className="mb-4">
        <StyledListItem>{formatMessage(checkoutMessages.text.groupBuyingDescription1)}</StyledListItem>
        <StyledListItem>{formatMessage(checkoutMessages.text.groupBuyingDescription2)}</StyledListItem>
        <StyledListItem>
          {formatMessage(checkoutMessages.text.groupBuyingDescription3, { modal: <GroupBuyingRuleModal /> })}
        </StyledListItem>
      </OrderedList>

      <div className="mb-4">
        <StyledPlanTitle className="mb-3">
          {formatMessage(checkoutMessages.label.groupBuyingPlan, { title })}
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
    </Stat>
  )
}

export default CheckoutGroupBuyingForm
