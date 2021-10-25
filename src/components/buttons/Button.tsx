import { Button as ChakraButton } from '@chakra-ui/react'
import styled, { css } from 'styled-components'
import { ElementComponent } from '../../types/element'

export type ButtonProps = {
  title: string
  size: 'sm' | 'md' | 'lg'
  variant?: 'text' | 'solid' | 'outline'
  block?: boolean
  colorScheme?: string
  link?: string
  openNewTab?: boolean
}

const StyledButton = styled(ChakraButton)<ButtonProps>`
  display: inline-block;
  border-radius: 4px;
  user-select: none;
  cursor: pointer;
  transition: 0.3s;
  font-size: 16px;
  letter-spacing: 0.2px;

  &:hover {
    color: #eeee;
  }

  color: ${props => props.color || '#585858'};
  ${props => props.backgroundColor && `background: ${props.backgroundColor} !important`};
  ${props => props.backgroundColor && `background-color: ${props.backgroundColor} `};
  ${props => props.outlineColor && `border: solid 1px ${props.outlineColor} !important`};

  ${props =>
    props.size === 'lg'
      ? 'padding: 10px 42px;'
      : props.size === 'md'
      ? 'padding: 10px 20px;'
      : props.size === 'sm'
      ? 'padding: 6px 16px;'
      : 'padding: 10px 20px;'}
  ${props =>
    props.block &&
    css`
      width: 100% !important;
      display: block;
    `}
`

const Button: ElementComponent<ButtonProps> = props => {
  const { loading, errors, editing, children } = props
  return loading || errors ? (
    <StyledButton>{children}</StyledButton>
  ) : (
    <StyledButton
      {...props}
      onClick={() => {
        if (editing) {
          return
        }
        if (props.link && !props.openNewTab) {
          window.location.href = props.link
        }
        if (props.link && props.openNewTab) {
          window.open(props.link)
        }
      }}
    >
      {props.title}
    </StyledButton>
  )
}

export default Button
