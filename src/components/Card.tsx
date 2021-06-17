import React from 'react'
import styled from 'styled-components'

const StyleCardTitle = styled.h3<{ isDark: boolean }>`
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: ${props => (props.isDark ? 'white' : 'var(--gray-darker)')};
`

const StyledCardContent = styled.p`
  font-weight: 500;
`

const StyledCard = styled.div<{
  direction: 'row' | 'column'
  isDark?: boolean
  bordered?: boolean
  shadow?: boolean
}>`
  display: flex;
  flex-direction: ${props => props.direction};
  ${props => (props.direction === 'row' ? 'justify-content: center;' : '')}
  border-radius: 4px;
  width: 100%;
  padding: 32px;
  transition: 0.3s;
  user-select: none;
  background-color: ${props => (props.isDark ? `rgba(0, 0, 0, 0)` : `#ffffff`)};

  ${props => (props.bordered ? `border: 1px solid white;` : '')}
  ${props => (props.shadow ? `box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);` : ``)}

  &:hover {
    transform: scale(1.1);
  }
`

const Card: React.FC<{
  direction: 'row' | 'column'
  isDark?: boolean
  bordered?: boolean
  shadow?: boolean
}> & {
  Title: typeof StyleCardTitle
  Content: typeof StyledCardContent
} = ({ children, ...props }) => {
  return <StyledCard {...props}>{children}</StyledCard>
}

Card.Title = StyleCardTitle
Card.Content = StyledCardContent

export default Card
