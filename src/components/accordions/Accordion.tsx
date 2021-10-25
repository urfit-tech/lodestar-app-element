import { useState } from 'react'
import styled, { css } from 'styled-components'
import { ElementComponent } from '../../types/element'
import Paragraph from '../common/Paragraph'
import { ReactComponent as AngleRightIcon } from '../images/icons/angle-right.svg'

const StyledAction = styled.div<{ isActive: boolean }>`
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

const StyledParagraph = styled(Paragraph)<{ isActive: boolean }>`
  margin-top: 1.25rem;
  display: ${props => (props.isActive ? 'block' : `none`)};
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

const StyledAccordion = styled.article<{ isActive?: boolean }>`
  margin-bottom: 1.5rem;
  border-radius: 4px;
  padding: 1.25rem;
  overflow: hidden;
  background-color: var(--gray-lighter);
`

const Accordion: ElementComponent<{
  list: {
    title: string
    description: string
  }[]
}> = props => {
  const [activeIndex, setActiveIndex] = useState(0)
  if (props.loading || props.errors) {
    return null
  }
  return (
    <div>
      {props.list.map((v, i) => (
        <StyledAccordion key={v.title + i} className={props.className} isActive={activeIndex === i}>
          <StyledAccordionHeader
            onClick={() => setActiveIndex(i)}
            className="d-flex justify-content-between align-items-center"
          >
            <StyledTitle className="title">{v.title}</StyledTitle>
            <StyledAction isActive={activeIndex === i}>
              <AngleRightIcon />
            </StyledAction>
          </StyledAccordionHeader>
          <StyledParagraph className="paragraph" isActive={activeIndex === i}>
            {v.description}
          </StyledParagraph>
        </StyledAccordion>
      ))}
    </div>
  )
}

export default Accordion
