import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { CraftMarginProps, CraftPaddingProps, CraftTextStyleProps } from '../../types/craft'
import Accordion from '../AccordionSingle'
import { CraftRefBlock } from '../common'

export type CraftCollapseProps = {
  title: string
  titleStyle: CraftTextStyleProps
  paragraph: string
  paragraphStyle: CraftTextStyleProps
  cardMargin: CraftMarginProps
  cardPadding: CraftPaddingProps
  variant: 'backgroundColor' | 'outline' | 'none'
  outlineColor?: string
  backgroundType?: 'none' | 'solidColor' | 'backgroundImage'
  solidColor?: string
  backgroundImageUrl?: string
}

const CraftCollapse: UserComponent<CraftCollapseProps> = ({
  cardMargin,
  cardPadding,
  variant,
  outlineColor,
  backgroundType,
  solidColor,
  backgroundImageUrl,
  title,
  titleStyle,
  paragraph,
  paragraphStyle,
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
      <Accordion
        customStyle={{
          card: {
            bordered: variant !== 'none',
            shadow: false,
            borderColor: outlineColor,
            backgroundColor: variant !== 'none' && backgroundType === 'solidColor' ? solidColor : undefined,
            backgroundImage:
              variant !== 'none' && backgroundType === 'backgroundImage' ? backgroundImageUrl : undefined,
            ...cardMargin,
            ...cardPadding,
          },
          title: {
            textAlign: titleStyle.textAlign,
            fontSize: titleStyle.fontSize,
            fontWeight: titleStyle.fontWeight,
            color: titleStyle.color || '#585858',
            ...titleStyle.margin,
          },
          paragraph: {
            textAlign: paragraphStyle.textAlign,
            fontSize: paragraphStyle.fontSize,
            fontWeight: paragraphStyle.fontWeight,
            color: paragraphStyle.color || '#585858',
            lineHeight: paragraphStyle.lineHeight || 1.5,
            ...paragraphStyle.margin,
          },
        }}
        title={title}
        description={paragraph}
      />
    </CraftRefBlock>
  )
}

export default CraftCollapse
