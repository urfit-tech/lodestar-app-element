import { useState } from 'react'
import styled, { css } from 'styled-components'
import { ReactComponent as AngleRightIcon } from '../images/icons/angle-right.svg'
import { CardProps, ParagraphProps, TitleProps } from '../types/style'
import { generateCustomCardStyle, generateCustomTitleStyle, StyledParagraph as Paragraph } from './common'

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

const StyledTitle = styled.h3<{ customStyle: TitleProps }>`
  line-height: 1.5;
  && {
    ${generateCustomTitleStyle}
  }
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

const StyledAccordion = styled.article<{ titleHeight: number; customStyle: CardProps; isActive?: boolean }>`
  margin-bottom: 1.5rem;
  border-radius: 4px;
  padding: 1.25rem;
  overflow: hidden;
  background-color: var(--gray-lighter);

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
        <StyledAccordion
          key={v.title + i}
          customStyle={customStyle.card}
          titleHeight={Number(customStyle.title.fontSize) + Number(customStyle.title.mb) + Number(customStyle.title.mt)}
          isActive={activeIndex === i}
        >
          <StyledAccordionHeader
            onClick={() => setActiveIndex(i)}
            className="d-flex justify-content-between align-items-center"
          >
            <StyledTitle customStyle={customStyle.title}>{v.title}</StyledTitle>
            <StyledAction isActive={activeIndex === i}>
              <AngleRightIcon />
            </StyledAction>
          </StyledAccordionHeader>
          <StyledParagraph isActive={activeIndex === i} customStyle={customStyle.paragraph}>
            {v.description}
          </StyledParagraph>
        </StyledAccordion>
      ))}
    </div>
  )
}

export default Accordion
