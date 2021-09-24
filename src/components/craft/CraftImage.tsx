import { useEditor, useNode, UserComponent } from '@craftjs/core'
import React from 'react'
import StyledImage from '../../components/Image'
import { CraftBoxModelProps, CraftImageProps } from '../../types/craft'
import { CraftRefBlock } from '../common'

const CraftImage: UserComponent<CraftImageProps & CraftBoxModelProps & { coverUrl: string }> = ({
  coverUrl,
  width,
  margin,
  padding,
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
    <CraftRefBlock ref={ref => ref && connect(drag(ref))} events={{ hovered, selected }} options={{ enabled }}>
      <StyledImage
        customStyle={{
          width,
          mt: margin?.mt,
          mr: margin?.mr,
          mb: margin?.mb,
          ml: margin?.ml,
          pt: padding?.pt,
          pr: padding?.pr,
          pb: padding?.pb,
          pl: padding?.pl,
        }}
        src={coverUrl}
      />
    </CraftRefBlock>
  )
}

export default CraftImage
