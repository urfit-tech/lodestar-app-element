import React from 'react'
import styled, { css } from 'styled-components'
import { ButtonProps } from '../types/style'

const StyledButton = styled.span<ButtonProps>`
  display: inline-block;
  border-radius: 2px;
  user-select: none;
  cursor: pointer;
  transition: 0.3s;
  font-size: 16px;
  letter-spacing: 0.2px;

  &:hover {
    color: #eeee;
  }

  color: ${props => props.color || 'white'};
  background-color: ${props => props.backgroundColor};
  ${props =>
    props.size === 'lg'
      ? 'padding: 10px 56px;'
      : props.size === 'md'
      ? 'padding: 10px 20px;'
      : props.size === 'sm'
      ? 'padding: 6px 16px;'
      : 'padding: 10px 20px;'}
  ${props => props.block && 'display: block'}
  ${props =>
    props.variant === 'solid'
      ? css`
          background-color: ${props => props.theme['@primary-color']};
        `
      : props.variant === 'outline'
      ? css`
          border: solid 1px #ffffff;
        `
      : ''}
`

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>
}

export default Button
