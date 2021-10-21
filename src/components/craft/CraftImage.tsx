import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { StyledImage } from '../../components/common/Image'
import { CraftBoxModelProps, CraftImageProps } from '../../types/craft'
import { CraftRefBlock } from '../common'
import Responsive from '../common/Responsive'

const CraftImage: UserComponent<{
  desktop?: CraftImageProps & CraftBoxModelProps
  mobile?: CraftImageProps & CraftBoxModelProps
}> = ({ desktop, mobile }) => {
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
      <Responsive.Default>
        <StyledImage
          customStyle={{
            width: mobile?.width,
            mt: mobile?.margin?.mt,
            mr: mobile?.margin?.mr,
            mb: mobile?.margin?.mb,
            ml: mobile?.margin?.ml,
            pt: mobile?.padding?.pt,
            pr: mobile?.padding?.pr,
            pb: mobile?.padding?.pb,
            pl: mobile?.padding?.pl,
          }}
          src={mobile?.coverUrl}
        />
      </Responsive.Default>
      <Responsive.Desktop>
        <StyledImage
          customStyle={{
            width: desktop?.width,
            mt: desktop?.margin?.mt,
            mr: desktop?.margin?.mr,
            mb: desktop?.margin?.mb,
            ml: desktop?.margin?.ml,
            pt: desktop?.padding?.pt,
            pr: desktop?.padding?.pr,
            pb: desktop?.padding?.pb,
            pl: desktop?.padding?.pl,
          }}
          src={desktop?.coverUrl}
        />
      </Responsive.Desktop>
    </CraftRefBlock>
  )
}

export default CraftImage
