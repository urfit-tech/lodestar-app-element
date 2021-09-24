import { useEditor, useNode, UserComponent } from '@craftjs/core'
import React from 'react'
import { CraftMarginProps, CraftPaddingProps } from '../../types/craft'
import { CraftRefBlock } from '../common'

const CraftContainer: UserComponent<{
  margin: CraftMarginProps
  padding?: CraftPaddingProps
}> = ({ margin, padding, children }) => {
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
    <CraftRefBlock
      ref={ref => ref && connect(drag(ref))}
      style={{
        margin: `${margin.mt}px ${margin.mr}px ${margin.mb}px ${margin.ml}px`,
        padding: padding && `${padding.pt}px ${padding.pr}px ${padding.pb}px ${padding.pl}px`,
      }}
      events={{ hovered, selected }}
      options={{ enabled }}
    >
      {children}
    </CraftRefBlock>
  )
}

export default CraftContainer
