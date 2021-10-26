import { useEditor, useNode, UserComponent } from '@craftjs/core'
import styled, { css, CSSObject } from 'styled-components'
import { ElementBaseProps, ElementComponent } from '../../types/element'
import Responsive from './Responsive'

const CraftRefBlock = styled.div<{
  options?: { enabled?: boolean }
  events?: { hovered?: boolean; selected?: boolean }
}>`
  ${props =>
    props?.options?.enabled &&
    css`
      cursor: pointer;
      ${props?.events?.hovered && CraftHoveredMixin}
      ${props?.events?.selected && CraftSelectedMixin}
    `}
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
}
const Craftize = <P extends object>(WrappedComponent: ElementComponent<P>) => {
  const Component: UserComponent<PropsWithCraft<P>> = props => {
    const { editing } = useEditor(state => ({
      editing: state.options.enabled,
    }))
    const {
      connectors: { connect },
      selected,
      hovered,
    } = useNode(node => ({
      selected: node.events.selected,
      hovered: node.events.hovered,
    }))
    const StyledCraftElement = styled(WrappedComponent)(props.customStyle || {}) as ElementComponent<P>
    return (
      <CraftRefBlock ref={ref => ref && connect(ref)} events={{ hovered, selected }} options={{ enabled: editing }}>
        <Responsive.Default>
          <StyledCraftElement {...(props.responsive?.tablet || props.responsive?.desktop || props)} editing={editing} />
        </Responsive.Default>
        <Responsive.Tablet>
          <StyledCraftElement {...(props.responsive?.tablet || props.responsive?.desktop || props)} editing={editing} />
        </Responsive.Tablet>
        <Responsive.Desktop>
          <StyledCraftElement {...(props.responsive?.desktop || props)} editing={editing} />
        </Responsive.Desktop>
      </CraftRefBlock>
    )
  }
  return Component
}

export default Craftize
