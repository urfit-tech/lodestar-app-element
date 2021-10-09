import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { StyledTitle } from '../../components/common'
import { CraftTitleProps } from '../../types/craft'
import { CraftRefBlock } from '../common'

const CraftTitle: UserComponent<CraftTitleProps> = ({
  titleContent,
  fontSize,
  margin,
  textAlign,
  fontWeight,
  color,
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
          fontSize,
          mt: margin.mt,
          mr: margin.mr,
          mb: margin.mb,
          ml: margin.ml,
          textAlign: textAlign,
          fontWeight: fontWeight,
          color: color,
        }}
      >
        {titleContent}
      </StyledTitle>
    </CraftRefBlock>
  )
}

export default CraftTitle
