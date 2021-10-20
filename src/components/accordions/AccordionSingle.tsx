import { useState } from 'react'
import styled, { css } from 'styled-components'
import { ReactComponent as AngleRightIcon } from '../../images/icons/angle-right.svg'
import { CardProps, ParagraphProps, TitleProps } from '../../types/style'
import { generateCustomCardStyle, generateCustomTitleStyle, StyledParagraph as Paragraph } from '../common'

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

const StyledTitle = styled.h3<{ customStyle: TitleProps }>`
  line-height: 1.5;
  && {
    ${generateCustomTitleStyle}
  }
`

const StyledParagraph = styled(Paragraph)<{ isActive?: boolean; customStyle: ParagraphProps }>`
  && {
    transition: 0.5s;
    ${props =>
      props.isActive
        ? css`
            margin-top: ${props.customStyle.mt} !important;
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

const StyledAccordion = styled.article<{ titleHeight: number; customStyle: CardProps; isActive?: boolean }>`
  border-radius: 4px;
  padding: 1.25rem;
  overflow: hidden;

  && {
    ${generateCustomCardStyle}
    ${props =>
      props.customStyle?.backgroundColor &&
      css`
        background-color: ${props.customStyle?.backgroundColor};
      `};
    ${props =>
      props.customStyle.backgroundImage &&
      css`
        background-image: url(${props.customStyle.backgroundImage});
        background-size: cover;
        background-position: center;
      `}
    ${props =>
      props.customStyle.bordered &&
      css`
        border: ${props.customStyle.borderColor ? `1px solid ${props.customStyle.borderColor}` : 'none'};
      `}
  }
`

const Accordion: React.FC<{
  title: string
  description: string
  customStyle: {
    title: TitleProps
    paragraph: ParagraphProps
    card: CardProps
  }
  isActive?: boolean
  onClick?: () => void
}> = ({ title, description, customStyle }) => {
  const [isActive, setAsActive] = useState(false)

  return (
    <StyledAccordion
      customStyle={customStyle.card}
      titleHeight={Number(customStyle.title.fontSize) + Number(customStyle.title.mb) + Number(customStyle.title.mt)}
      isActive={isActive}
    >
      <StyledAccordionHeader
        onClick={() => setAsActive(active => !active)}
        className="d-flex justify-content-between align-items-center"
      >
        <StyledTitle className="flex-grow-1" customStyle={customStyle.title}>
          {title}
        </StyledTitle>
        <StyledAction isActive={isActive}>
          <AngleRightIcon />
        </StyledAction>
      </StyledAccordionHeader>
      <StyledParagraph isActive={isActive} customStyle={customStyle.paragraph}>
        {description}
      </StyledParagraph>
    </StyledAccordion>
  )
}

export default Accordion
