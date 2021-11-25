import styled, { css } from 'styled-components'
import { ElementComponent } from '../../types/element'
import { ProductOpenLinkSource, ProductPurchaseProductSource } from '../../types/options'
import CheckoutProductModal from '../modals/CheckoutProductModal'

export type ButtonProps = {
  title: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'text' | 'solid' | 'outline'
  block?: boolean
  colorScheme?: string
  link?: string
  openNewTab?: boolean
  source?: ProductOpenLinkSource | ProductPurchaseProductSource
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-block;
  border-radius: 4px;
  user-select: none;
  cursor: pointer;
  transition: 0.3s;
  font-size: 16px;
  letter-spacing: 0.2px;

  &&:disabled,
  &&.disabled {
    color: #fff;
    border-color: #a0a0a0;
    background-color: #a0a0a0;
    cursor: not-allowed !important;
  }
  &&:disabled:hover,
  &&:disabled:focus,
  &&.disabled:hover,
  &&.disabled:focus {
    color: #fff;
    border-color: #a0a0a0;
    background-color: #a0a0a0;
    cursor: not-allowed !important;
  }
  ${props =>
    props.size === 'lg'
      ? 'padding: 10px 42px;'
      : props.size === 'md'
      ? 'padding: 10px 20px;'
      : props.size === 'sm'
      ? 'padding: 6px 16px;'
      : 'padding: 10px 20px;'};
  ${props =>
    props.block &&
    css`
      width: 100% !important;
      display: block;
    `};
`

const Button: ElementComponent<ButtonProps> = props => {
  const { loading, errors, editing } = props
  return loading || errors ? null : props.source?.from ? (
    <CheckoutProductModal
      renderTrigger={({ onOpen, disable, isLoginAlert }) => (
        <StyledButton
          {...props}
          className={`${props.className} ${disable ? 'disabled' : ''}`}
          colorScheme="primary"
          disabled={props.source?.from === 'purchaseProduct' ? disable : false}
          onClick={() => {
            if (editing) return
            if (props.source?.from) {
              switch (props.source.from) {
                case 'openLink':
                  if (!props.source.openNewTab && props.source.link) {
                    window.location.href = props.source.link
                  }
                  if (props.source.openNewTab && props.source.link) {
                    window.open(props.source.link)
                  }
                  break
                case 'purchaseProduct':
                  if (isLoginAlert) return window.alert('請先登入')
                  onOpen?.()
                  break
                default:
                  break
              }
            }
          }}
        >
          {props.title}
        </StyledButton>
      )}
      defaultProductId={props.source?.from === 'purchaseProduct' ? `${props.source.productId}` : ''}
    />
  ) : (
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
      }}
    >
      {props.title}
    </StyledButton>
  )
}

export default Button
