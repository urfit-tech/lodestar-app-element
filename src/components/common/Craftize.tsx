import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { useMediaQuery } from 'react-responsive'
import styled, { css, CSSObject } from 'styled-components'
import { ElementBaseProps, ElementComponent } from '../../types/element'
import Responsive, { DESKTOP_BREAK_POINT, TABLET_BREAK_POINT } from './Responsive'

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
    const isTablet = useMediaQuery({
      minWidth: TABLET_BREAK_POINT,
      maxWidth: DESKTOP_BREAK_POINT - 1,
    })
    const isDesktop = useMediaQuery({ minWidth: DESKTOP_BREAK_POINT })
    console.log({ isTablet, isDesktop })
    const responsiveProps = isDesktop
      ? { ...props, ...props.responsive?.desktop }
      : isTablet
      ? { ...props, ...props.responsive?.tablet }
      : props
    const StyledCraftElement = styled(WrappedComponent)(responsiveProps.customStyle || {}) as ElementComponent<P>
    return (
      <CraftRefBlock ref={ref => ref && connect(ref)} events={{ hovered, selected }} options={{ enabled: editing }}>
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
