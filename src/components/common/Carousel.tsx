import { useHistory } from 'react-router'
import Slider from 'react-slick'
import styled from 'styled-components'
import { ElementComponent } from '../../types/element'
import Slide from './Slide'

const StyledSlider = styled(Slider)<{ variant?: 'cover'; customStyle?: CarouselProps }>`
  && {
    ${props =>
      props.variant === 'cover' &&
      `
        .slick-dots {
          bottom: 25px;
        }
      `}
    .slick-dots {
      z-index: 1;
    }

    li button::before {
      opacity: 1;
      font-size: 10px;
      color: #cdcdcd;
      transition: 0.3s;
    }
    li.slick-active button::before {
      color: ${props => props.theme['@primary-color']};
    }
  }
`

type CarouselCover = {
  title?: string
  paragraph?: string
  desktopCoverUrl: string
  mobileCoverUrl: string
  link: string
  openNewTab: boolean
}

type CarouselProps = {
  type: 'normal' | 'simply'
  covers: CarouselCover[]
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

const Carousel: ElementComponent<CarouselProps> = props => {
  const history = useHistory()
  if (props.loading || props.errors) {
    return null
  }
  return (
    <StyledSlider
      dots={props.dots}
      draggable={props.draggable}
      swipeToSlide={props.swipeToSlide}
      infinite={props.infinite}
      speed={props.speed}
      arrows={props.arrows}
      autoplay={props.autoplay}
      autoplaySpeed={props.autoplaySpeed}
      slidesToShow={props.slidesToShow}
      slidesToScroll={props.slidesToScroll}
      variant="cover"
    >
      {props.covers.map(cover => (
        <Slide
          key={cover.title}
          srcDesktop={cover.desktopCoverUrl}
          srcMobile={cover.mobileCoverUrl}
          title={cover.title}
          subtitle={cover.paragraph}
          onClick={() => {
            if (props.editing || !cover.link) {
              return
            }
            cover.openNewTab
              ? window.open(cover.link)
              : cover.link.includes('http')
              ? window.location.assign(cover.link)
              : history.push(cover.link)
          }}
        />
      ))}
    </StyledSlider>
  )
}

export default Carousel
