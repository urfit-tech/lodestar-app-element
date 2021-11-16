import styled, { css } from 'styled-components'
import { ElementComponent } from '../../types/element'
import CheckoutProductModal from '../modals/CheckoutProductModal'

export type ButtonProps = {
  title: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'text' | 'solid' | 'outline'
  block?: boolean
  colorScheme?: string
  link?: string
  openNewTab?: boolean
  productType?: string
  productId?: string
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-block;
  border-radius: 4px;
  user-select: none;
  cursor: pointer;
  transition: 0.3s;
  font-size: 16px;
  letter-spacing: 0.2px;
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
  const { loading, errors, editing } = props
  return loading || errors ? null : (
    <CheckoutProductModal
      renderTrigger={({ onOpen }) => (
        <StyledButton
          {...props}
          className={props.className}
          colorScheme="primary"
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
            if (props.productType) {
              onOpen?.()
            }
          }}
        >
          {props.title}
        </StyledButton>
      )}
      defaultProductId={props.productType ? `${props.productType}_${props.productId}` : ''}
    />
  )
}

export default Button
