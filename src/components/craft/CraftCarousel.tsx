import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { useHistory } from 'react-router-dom'
import { CraftTextStyleProps } from '../../types/craft'
import { CraftRefBlock } from '../common'
import Carousel from '../common/Carousel'

export type CraftCarouselProps = {
  type: 'normal' | 'simply'
  covers: {
    title?: string
    paragraph?: string
    desktopCoverUrl: string
    mobileCoverUrl: string
    link: string
    openNewTab: boolean
  }[]
  titleStyle?: CraftTextStyleProps
  paragraphStyle?: CraftTextStyleProps
}

const CraftCarousel: UserComponent<CraftCarouselProps> = ({ type, covers, titleStyle, paragraphStyle, children }) => {
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
  const history = useHistory()

  return (
    <CraftRefBlock ref={ref => ref && connect(drag(ref))} events={{ hovered, selected }} options={{ enabled }}>
      <Carousel dots infinite arrows={false} autoplay autoplaySpeed={5000} variant="cover">
        {covers.map(cover => (
          <Carousel.Slide
            key={cover.title}
            srcDesktop={cover.desktopCoverUrl}
            srcMobile={cover.mobileCoverUrl}
            title={cover.title}
            subtitle={cover.paragraph}
            onClick={() => {
              if (enabled || !cover.link) {
                return
              }
              cover.openNewTab
                ? window.open(cover.link)
                : cover.link.includes('http')
                ? window.location.assign(cover.link)
                : history.push(cover.link)
            }}
            customStyle={
              type === 'normal'
                ? {
                    title: {
                      fontSize: titleStyle?.fontSize || '',
                      textAlign: titleStyle?.textAlign || 'center',
                      fontWeight: titleStyle?.fontWeight || 'bold',
                      color: titleStyle?.color || '',
                      mt: titleStyle?.margin.mt || '',
                      mr: titleStyle?.margin.mr || '',
                      mb: titleStyle?.margin.mb || '',
                      ml: titleStyle?.margin.ml || '',
                    },
                    paragraph: {
                      fontSize: paragraphStyle?.fontSize || '',
                      textAlign: paragraphStyle?.textAlign || 'center',
                      fontWeight: paragraphStyle?.fontWeight || 'normal',
                      color: paragraphStyle?.color || '',
                      lineHeight: paragraphStyle?.lineHeight || 1,
                      mt: paragraphStyle?.margin.mt || '',
                      mr: paragraphStyle?.margin.mr || '',
                      mb: paragraphStyle?.margin.mb || '',
                      ml: paragraphStyle?.margin.ml || '',
                    },
                  }
                : {}
            }
          />
        ))}
      </Carousel>
    </CraftRefBlock>
  )
}

export default CraftCarousel
