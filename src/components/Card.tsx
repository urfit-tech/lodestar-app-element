import React from 'react'
import styled from 'styled-components'
import { CardProps, ParagraphProps, TitleProps } from '../types/style'
import { generateCustomParagraphStyle, generateCustomTitleStyle } from './common'

const StyleCardTitle = styled.h3<{ customStyle?: TitleProps; isDark: boolean }>`
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: ${props => (props.isDark ? 'white' : 'var(--gray-darker)')};

  ${generateCustomTitleStyle}
`

const StyledCardContent = styled.p<{ customStyle?: ParagraphProps }>`
  font-weight: 500;

  ${generateCustomParagraphStyle}
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

  &:hover {
    scale: 1.1;
  }
`

const Card: React.FC<{
  isDark?: boolean
  customStyle: { direction: 'row' | 'column' } & CardProps
}> & {
  Title: typeof StyleCardTitle
  Content: typeof StyledCardContent
} = ({ children, ...props }) => {
  return <StyledCard {...props}>{children}</StyledCard>
}

Card.Title = StyleCardTitle
Card.Content = StyledCardContent

export default Card
