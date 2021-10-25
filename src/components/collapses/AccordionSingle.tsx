import { useState } from 'react'
import styled, { css } from 'styled-components'
import { ReactComponent as AngleRightIcon } from '../../images/icons/angle-right.svg'
import { ElementComponent } from '../../types/element'
import Paragraph from '../common/Paragraph'

const StyledAction = styled.div<{ isActive?: boolean }>`
  font-size: 20px;
  ${props =>
    props.isActive &&
    css`
      transform: rotate(90deg);
    `};
  color: var(--gray);
  transition: transform 0.3s ease-in-out;
`

const StyledTitle = styled.h3`
  line-height: 1.5;
`

const StyledParagraph = styled(Paragraph)<{ isActive?: boolean }>`
  && {
    transition: 0.5s;
    ${props =>
      props.isActive
        ? css`
            height: fit-content;
          `
        : `margin-top: 0 !important; height:0; overflow:hidden;`};
  }
`

const StyledAccordionHeader = styled.header`
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
  cursor: pointer;
  line-height: 1;
`

const StyledAccordion = styled.article`
  border-radius: 4px;
  padding: 1.25rem;
  overflow: hidden;
`

const Accordion: ElementComponent<{
  title: string
  description: string
  isActive?: boolean
  onClick?: () => void
}> = props => {
  const [isActive, setAsActive] = useState(false)

  if (props.loading || props.errors) {
    return null
  }

  return (
    <StyledAccordion className={props.className}>
      <StyledAccordionHeader
        onClick={() => setAsActive(active => !active)}
        className="d-flex justify-content-between align-items-center"
      >
        <div className="flex-grow-1">
          <StyledTitle>{props.title}</StyledTitle>
        </div>
        <StyledAction isActive={props.isActive}>
          <AngleRightIcon />
        </StyledAction>
      </StyledAccordionHeader>
      <StyledParagraph isActive={props.isActive}>{props.description}</StyledParagraph>
    </StyledAccordion>
  )
}

export default Accordion
