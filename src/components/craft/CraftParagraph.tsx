import { useEditor, useNode, UserComponent } from '@craftjs/core'
import React from 'react'
import { StyledParagraph } from '../../components/common'
import { CraftParagraphProps } from '../../types/craft'
import { CraftRefBlock } from '../common'

const CraftParagraph: UserComponent<CraftParagraphProps> = ({
  paragraphContent,
  fontSize,
  lineHeight,
  margin,
  textAlign,
  fontWeight,
  color,
  letterSpacing,
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
      <StyledParagraph
        customStyle={{
          fontSize,
          mt: margin.mt,
          mr: margin.mr,
          mb: margin.mb,
          ml: margin.ml,
          textAlign,
          fontWeight,
          color,
          lineHeight: lineHeight || 1,
          letterSpacing,
        }}
      >
        {paragraphContent}
      </StyledParagraph>
    </CraftRefBlock>
  )
}

export default CraftParagraph
