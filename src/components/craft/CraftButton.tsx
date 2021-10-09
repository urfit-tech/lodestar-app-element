import { useEditor, useNode, UserComponent } from '@craftjs/core'
import styled from 'styled-components'
import Button from '../../components/Button'
import { CraftButtonProps } from '../../types/craft'
import { CraftHoveredMixin, CraftSelectedMixin } from '../common'

const StyledButtonWrapper = styled.div<{
  align?: CraftButtonProps['align']
  craftEvents?: { hovered?: boolean; selected?: boolean }
}>`
  ${props => props?.craftEvents?.hovered && CraftHoveredMixin}
  ${props => props?.craftEvents?.selected && CraftSelectedMixin}
  ${props => props?.align && `text-align:${props?.align};`}
  width:100%;
`

const CraftButton: UserComponent<CraftButtonProps> = ({
  title,
  link,
  openNewTab,
  size,
  block,
  variant,
  color,
  align,
  outlineColor,
  backgroundColor,
  backgroundType,
}) => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const {
    connectors: { connect, drag },
    selected,
    hovered,
  } = useNode(node => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
  }))

  return (
    <StyledButtonWrapper
      ref={ref => ref && connect(drag(ref))}
      craftEvents={enabled ? { selected, hovered } : {}}
      align={align}
    >
      <Button
        variant={variant}
        color={color}
        outlineColor={outlineColor || 'transparent'}
        backgroundColor={backgroundType === 'solidColor' ? backgroundColor : 'none'}
        size={size}
        block={block}
        link={link}
        openNewTab={openNewTab}
        craftEnabled={enabled}
      >
        {title}
      </Button>
    </StyledButtonWrapper>
  )
}

export default CraftButton
