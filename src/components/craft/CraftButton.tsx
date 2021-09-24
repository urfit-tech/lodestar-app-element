import { useEditor, useNode, UserComponent } from '@craftjs/core'
import React from 'react'
import styled from 'styled-components'
import Button from '../../components/Button'
import { CraftButtonProps } from '../../types/craft'
import { CraftHoveredMixin, CraftSelectedMixin } from '../common'

const StyledButtonWrapper = styled.div<{ block: boolean; craftEvents?: { hovered?: boolean; selected?: boolean } }>`
  ${props => (props.block ? 'display:block; width:100%;' : 'display:inline-block;')}
  ${props => props?.craftEvents?.hovered && CraftHoveredMixin}
  ${props => props?.craftEvents?.selected && CraftSelectedMixin}
  text-align: center;
`

const CraftButton: UserComponent<CraftButtonProps> = ({
  title,
  link,
  openNewTab,
  size,
  block,
  variant,
  color,
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
      block={block}
      craftEvents={enabled ? { selected, hovered } : {}}
    >
      <Button
        variant={variant}
        color={color}
        outlineColor={outlineColor}
        backgroundColor={backgroundType === 'solidColor' ? backgroundColor : undefined}
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
