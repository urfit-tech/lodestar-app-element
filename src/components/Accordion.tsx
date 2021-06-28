import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { ReactComponent as AngleRightIcon } from '../images/icons/angle-right.svg'
import { CardProps, ParagraphProps, TitleProps } from '../types/style'
import { generateCustomCardStyle, StyledParagraph, StyledTitle } from './common'

const StyledAction = styled.div<{ isActive: boolean }>`
  font-size: 20px;
  ${props =>
    props.isActive &&
    css`
      transform: rotate(90deg);
      margin-right: 6px;
    `};
  color: var(--gray);
  transition: transform 0.5s ease-in-out;
`

const StyledAccordionHeader = styled.header`
  margin-bottom: 1.25rem;
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
  cursor: pointer;
`

const StyledAccordion = styled.article<{ customStyle: CardProps; isActive?: boolean }>`
  margin-bottom: 1.5rem;
  border-radius: 4px;
  padding: 1.25rem;
  max-height: ${props => (props.isActive ? '500px' : '64px')};
  overflow: hidden;
  background-color: var(--gray-lighter);
  transition: max-height 0s;

  &:hover {
    transition: max-height 1s ease-out;
  }

  && {
    ${generateCustomCardStyle}
  }
`

const Accordion: React.FC<{
  list: {
    title: string
    description: string
  }[]
  customStyle: {
    title: TitleProps
    paragraph: ParagraphProps
    card: CardProps
  }
}> = ({ list, customStyle }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div>
      {list.map((v, i) => (
        <StyledAccordion customStyle={customStyle.card} isActive={activeIndex === i}>
          <StyledAccordionHeader
            onClick={() => setActiveIndex(i)}
            className="d-flex justify-content-between align-items-center"
          >
            <StyledTitle customStyle={customStyle.title}>{v.title}</StyledTitle>
            <StyledAction isActive={activeIndex === i}>
              <AngleRightIcon />
            </StyledAction>
          </StyledAccordionHeader>
          <StyledParagraph customStyle={customStyle.paragraph}>{v.description}</StyledParagraph>
        </StyledAccordion>
      ))}
    </div>
  )
}

export default Accordion
