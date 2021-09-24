import { useEditor, useNode, UserComponent } from '@craftjs/core'
import React from 'react'
import { StyledParagraph, StyledTitle } from '../../components/common'
import { CraftParagraphProps, CraftTitleProps } from '../../types/craft'
import { CraftRefBlock } from '../common'

const CraftTitleAndParagraph: UserComponent<{ title: CraftTitleProps; paragraph: CraftParagraphProps }> = ({
  title,
  paragraph,
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
      <StyledTitle
        customStyle={{
          fontSize: title.fontSize,
          textAlign: title.textAlign,
          fontWeight: title.fontWeight,
          color: title.color,
          ...title.margin,
          ...title.padding,
          ...title.border,
        }}
      >
        {title.titleContent}
      </StyledTitle>
      <StyledParagraph
        customStyle={{
          fontSize: paragraph.fontSize,
          textAlign: paragraph.textAlign,
          fontWeight: paragraph.fontWeight,
          color: paragraph.color,
          lineHeight: paragraph.lineHeight || 1,
          ...paragraph.margin,
          ...paragraph.padding,
          ...paragraph.border,
        }}
      >
        {paragraph.paragraphContent}
      </StyledParagraph>
    </CraftRefBlock>
  )
}

export default CraftTitleAndParagraph
