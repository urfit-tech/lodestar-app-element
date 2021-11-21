import { Children, useEffect, useRef } from 'react'
import { isFragment } from 'react-is'
import Slider, { Settings, Settings as SliderProps } from 'react-slick'
import styled from 'styled-components'
import { ElementComponent, ElementProps } from '../../types/element'

export type CarouselProps = Pick<
  SliderProps,
  | 'autoplay'
  | 'autoplaySpeed'
  | 'arrows'
  | 'dots'
  | 'slidesToShow'
  | 'slidesToScroll'
  | 'dotsClass'
  | 'swipe'
  | 'draggable'
  | 'infinite'
> & { variant?: 'cover'; currentSlide?: number }

const StyledSlider = styled(Slider)<ElementProps<CarouselProps>>`
  overflow: hidden;
  min-height: 200px;
  .slick-list {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translate(0, -50%) !important; // !important for the iframe of lodestar-app-admin
  }
  .slick-arrow {
    z-index: 1;
    pointer-events: ${props => props.editing && 'none'};
  }
  .slick-prev {
    left: 4px;
  }
  .slick-next {
    right: 4px;
  }
  .slick-dots {
    z-index: 1;
    bottom: 8px;
    pointer-events: ${props => props.editing && 'none'};
    button::before {
      content: '';
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #cdcdcd;
    }
    .slick-active button::before {
      background-color: ${props => props.theme['@primary-color']};
    }
  }
`

const Carousel: ElementComponent<CarouselProps> = props => {
  const sliderRef = useRef<Slider>(null)
  useEffect(() => {
    sliderRef.current?.slickGoTo(props.currentSlide || 0)
  }, [props.currentSlide])

  if (props.loading || props.errors) {
    return null
  }
  let children = props.children

  // validate top level dom is only one fragment
  if (Children.count(props.children) === 1 && isFragment(props.children)) {
    const { children: fragmentChildren } = props.children.props
    children = fragmentChildren
  }
  const settings: Settings = {
    arrows: props.arrows,
    dots: props.dots,
    slidesToShow: props.slidesToShow || 1,
    slidesToScroll: props.slidesToScroll || 1,
    autoplay: props.autoplay,
    autoplaySpeed: props.autoplaySpeed || 3000,
    swipe: props.swipe,
    draggable: props.draggable,
    infinite: props.infinite,
  }
  return (
    <StyledSlider
      className={props.className}
      ref={sliderRef}
      {...settings}
      swipe={props.editing ? false : props.swipe}
      draggable={props.editing ? false : props.draggable}
    >
      {Children.map(children, (child, idx) => (
        <div key={idx}>{child}</div>
      ))}
    </StyledSlider>
  )
}

export default Carousel
