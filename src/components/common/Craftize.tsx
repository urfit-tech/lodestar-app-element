import Icon from '@chakra-ui/icon'
import { SettingsIcon } from '@chakra-ui/icons'
import { Node, useEditor, useNode, useNodeReturnType, UserComponent } from '@craftjs/core'
import { useMediaQuery } from 'react-responsive'
import styled, { css, CSSObject } from 'styled-components'
import { ElementBaseProps, ElementComponent } from '../../types/element'
import Responsive, { DESKTOP_BREAK_POINT, TABLET_BREAK_POINT } from './Responsive'

const CraftRefBlock = styled.div<{
  editing?: boolean
  events?: { hovered?: boolean; selected?: boolean }
}>`
  position: relative;
  ${props =>
    props?.editing &&
    css`
      cursor: pointer;
      ${props?.events?.hovered && CraftHoveredMixin}
      ${props?.events?.selected && CraftSelectedMixin}
    `}
`

const StyledControls = styled.div`
  position: absolute;
  top: -44px;
  left: 0;
`

const StyledButton = styled.button`
  background: var(--gray-light);
  padding: 8px 16px;
  border-radius: 4px;
`

export const CraftHoveredMixin = css`
  border-radius: 2px;
  border: 1px dashed cornflowerblue;
`
export const CraftSelectedMixin = css`
  border-radius: 2px;
  border: 2px solid cornflowerblue;
`

// FIXME: why cannot use <P extends {editing?:boolean}> directly?
// FIXME: only accept for FC and CC, not VFC

export type PropsWithCraft<P> = ElementBaseProps<P> & {
  responsive?: { tablet?: P & { customStyle?: CSSObject }; desktop?: P & { customStyle?: CSSObject } }
  customStyle?: CSSObject
  renderExtra?: (node: useNodeReturnType<Node>) => React.ReactNode
}
const Craftize = <P extends object>(WrappedComponent: ElementComponent<P>) => {
  const StyledCraftElement = styled(WrappedComponent)(
    (props: PropsWithCraft<P>) => props.customStyle,
  ) as ElementComponent<P>
  const Component: UserComponent<PropsWithCraft<P>> = props => {
    const { editing } = useEditor(state => ({
      editing: state.options.enabled,
    }))
    const node = useNode(node => node)
    const isTablet = useMediaQuery({
      minWidth: TABLET_BREAK_POINT,
      maxWidth: DESKTOP_BREAK_POINT - 1,
    })
    const isDesktop = useMediaQuery({ minWidth: DESKTOP_BREAK_POINT })
    const responsiveProps = isDesktop
      ? { ...props, ...props.responsive?.desktop }
      : isTablet
      ? { ...props, ...props.responsive?.tablet }
      : props
    return (
      <CraftRefBlock editing={editing} events={{ hovered: node.events.hovered, selected: node.events.selected }}>
        {editing && (
          <StyledControls className="d-flex">
            <StyledButton ref={(ref: any) => ref && node.connectors.connect(node.connectors.drag(ref))}>
              <Icon as={SettingsIcon} />
            </StyledButton>
            {props.renderExtra?.(node)}
          </StyledControls>
        )}
        <Responsive.Default>
          <StyledCraftElement {...responsiveProps} editing={editing} />
        </Responsive.Default>
        <Responsive.Tablet>
          <StyledCraftElement {...responsiveProps} editing={editing} />
        </Responsive.Tablet>
        <Responsive.Desktop>
          <StyledCraftElement {...responsiveProps} editing={editing} />
        </Responsive.Desktop>
      </CraftRefBlock>
    )
  }
  return Component
}

export default Craftize
