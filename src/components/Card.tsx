import React from 'react'
import styled from 'styled-components'
import { MultiLineTruncationMixin } from '../helpers/style'
import { CardProps, ParagraphProps, TitleProps } from '../types/style'
import {
  generateCustomMarginStyle,
  generateCustomPaddingStyle,
  generateCustomParagraphStyle,
  generateCustomTitleStyle,
} from './common'
import Image from './Image'

const StyleCardTitle = styled.h3<{ customStyle?: TitleProps; isDark?: boolean }>`
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: ${props => (props.isDark ? 'white' : 'var(--gray-darker)')};

  && {
    ${generateCustomTitleStyle}
  }
`
const StyledContentBlock = styled.div`
  padding: 1.25rem;
`
const StyledCardContent = styled.p<{ customStyle?: ParagraphProps }>`
  font-weight: 500;

  && {
    ${generateCustomParagraphStyle}
  }
`
const StyledDescription = styled.div`
  ${MultiLineTruncationMixin}
  margin-bottom: 12px;
  height: 3em;
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledMetaBlock = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  line-height: 1.5rem;
`
const StyledCard = styled.div<{ isDark?: boolean; customStyle: { direction: 'row' | 'column' } & CardProps }>`
  display: flex;
  flex-direction: ${props => props.customStyle.direction};
  ${props => (props.customStyle.direction === 'row' ? 'justify-content: center;' : '')}
  border-radius: 4px;
  width: 100%;
  padding: 32px;
  transition: 0.3s;
  user-select: none;
  background-color: ${props => (props.isDark ? `rgba(0, 0, 0, 0)` : `#ffffff`)};

  ${props => (props.customStyle.bordered ? `border: 1px solid white;` : '')}
  ${props => (props.customStyle.shadow ? `box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);` : ``)}

  && {
    ${generateCustomMarginStyle}
    ${generateCustomPaddingStyle}
  }
`

const Card: React.FC<{
  isDark?: boolean
  customStyle: { direction: 'row' | 'column' } & CardProps
}> & {
  Image: typeof Image
  Title: typeof StyleCardTitle
  Content: typeof StyledCardContent
  ContentBlock: typeof StyledContentBlock
  Description: typeof StyledDescription
  MetaBlock: typeof StyledMetaBlock
} = ({ children, ...props }) => {
  return <StyledCard {...props}>{children}</StyledCard>
}

Card.Image = Image
Card.Title = StyleCardTitle
Card.Content = StyledCardContent
Card.ContentBlock = StyledContentBlock
Card.Description = StyledDescription
Card.MetaBlock = StyledMetaBlock

export default Card
