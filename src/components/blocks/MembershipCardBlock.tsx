import { Icon } from '@chakra-ui/react'
import moment from 'moment'
import React from 'react'
import { AiOutlineCalendar } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import MembershipCard from '../cards/MembershipCard'
import { BraftContent } from '../common/StyledBraftEditor'

const StyledCardContainer = styled.div`
  min-width: 100px;
  margin-bottom: 2rem;
`
const StyledTitle = styled.h1`
  margin-bottom: 0.75rem;
  overflow: hidden;
  color: #585858;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.3;
  letter-spacing: 0.77px;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const StyledSubTitle = styled.div`
  margin-bottom: 1rem;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  letter-spacing: 0.18px;
`

const MembershipCardBlock: React.VFC<{
  template: string
  templateVars?: any
  title: string
  expiredAt?: Date
  description?: string
  variant?: string
}> = ({ template, templateVars, title, expiredAt, description, variant }) => {
  const { formatMessage } = useIntl()
  if (variant === 'list-item') {
    return (
      <div className="d-flex justify-content-between">
        <div className="flex-grow-1">
          <StyledTitle>{title}</StyledTitle>
          {description && <BraftContent>{description}</BraftContent>}
        </div>
        <StyledCardContainer className="m-0 ml-5">
          <MembershipCard template={template} templateVars={templateVars} />
        </StyledCardContainer>
      </div>
    )
  }

  return (
    <div>
      <StyledCardContainer>
        <MembershipCard template={template} templateVars={templateVars} />
      </StyledCardContainer>

      <StyledTitle>{title}</StyledTitle>

      <StyledSubTitle>
        <Icon as={AiOutlineCalendar} className="mr-2" />
        {expiredAt
          ? formatMessage(
              { id: 'common.expiredTime', defaultMessage: '{expiredTime} 止' },
              {
                expiredTime: moment(expiredAt).format('YYYY/MM/DD'),
              },
            )
          : formatMessage(commonMessages.content.noPeriod)}
      </StyledSubTitle>

      {description && <BraftContent>{description}</BraftContent>}
    </div>
  )
}

export default MembershipCardBlock
