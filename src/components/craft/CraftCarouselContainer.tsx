import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { Children } from 'react'
import { isFragment } from 'react-is'
import Carousel from '../../components/Carousel'
import { CraftMarginProps } from '../../types/craft'
import { CraftRefBlock } from '../common'
import { BREAK_POINT } from '../Responsive'

type CarouselContainerProps = {
  margin: CraftMarginProps
  dots?: boolean
  arrows?: boolean
  draggable?: boolean
  swipeToSlide?: boolean
  infinite?: boolean
  autoplay?: boolean
  speed?: number
  slidesToShow?: number
  slidesToScroll?: number
  autoplaySpeed?: number
}

export type CraftCarouselContainerProps = {
  desktop: CarouselContainerProps
  mobile: CarouselContainerProps
}

const CraftCarouselContainer: UserComponent<CraftCarouselContainerProps> = ({ desktop, mobile, children }) => {
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

  let child = children

  // validate top level dom is only one fragment
  if (Children.count(children) === 1 && isFragment(children)) {
    const { children: fragmentChildren } = children.props
    child = fragmentChildren
  }

  return (
    <CraftRefBlock ref={ref => ref && connect(drag(ref))} events={{ hovered, selected }} options={{ enabled }}>
      <Carousel
        dots
        infinite
        arrows={false}
        autoplay
        autoplaySpeed={5000}
        {...desktop}
        responsive={[
          {
            breakpoint: BREAK_POINT,
            settings: mobile,
          },
        ]}
        customStyle={{
          mobile: { margin: mobile.margin },
          desktop: { margin: desktop.margin },
        }}
      >
        {child}
      </Carousel>
    </CraftRefBlock>
  )
}

export default CraftCarouselContainer
