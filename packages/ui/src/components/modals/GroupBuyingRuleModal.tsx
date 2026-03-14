import { useDisclosure } from '@chakra-ui/hooks'
import { Button, ListItem, OrderedList } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import CommonModal from '../../components/modals/CommonModal'
import { checkoutMessages } from '../../helpers/translation'

const StyledLink = styled(Button)`
  && {
    vertical-align: baseline;
    font-size: 14px;
  }
`

const StyledListItem = styled(ListItem)`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.18px;
  color: var(--gray-darker);
`

const GroupBuyingRuleModal: React.FC = () => {
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <StyledLink colorScheme="primary" variant="link" onClick={onOpen}>
        {formatMessage(checkoutMessages.text.groupBuyingRuleLink)}
      </StyledLink>
      <CommonModal isOpen={isOpen} title={formatMessage(checkoutMessages.label.groupBuyingRuleTitle)} onClose={onClose}>
        <OrderedList>
          <StyledListItem>{formatMessage(checkoutMessages.text.groupBuyingRule1)}</StyledListItem>
          <StyledListItem>{formatMessage(checkoutMessages.text.groupBuyingRule2)}</StyledListItem>
          <StyledListItem>{formatMessage(checkoutMessages.text.groupBuyingRule3)}</StyledListItem>
          <StyledListItem>{formatMessage(checkoutMessages.text.groupBuyingRule4)}</StyledListItem>
          <StyledListItem>{formatMessage(checkoutMessages.text.groupBuyingRule5)}</StyledListItem>
        </OrderedList>
      </CommonModal>
    </>
  )
}

export default GroupBuyingRuleModal
