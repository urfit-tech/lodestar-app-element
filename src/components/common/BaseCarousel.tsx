import { Children, useEffect, useRef } from 'react'
import { isFragment } from 'react-is'
import Slider, { Settings as SliderProps } from 'react-slick'
import styled from 'styled-components'
import { ElementComponent, ElementProps } from '../../types/element'

type BaseSliderProps = Pick<
  SliderProps,
  | 'adaptiveHeight'
  | 'arrows'
  | 'autoplay'
  | 'autoplaySpeed'
  | 'centerMode'
  | 'centerPadding'
  | 'dots'
  | 'dotsClass'
  | 'draggable'
  | 'fade'
  | 'infinite'
  | 'rows'
  | 'slidesPerRow'
  | 'slidesToScroll'
  | 'slidesToShow'
  | 'speed'
  | 'swipeToSlide'
  | 'swipe'
  | 'vertical'
>
export type BaseCarouselProps = BaseSliderProps & { variant?: 'cover'; currentSlide?: number }

const StyledSlider = styled(Slider)<ElementProps<BaseCarouselProps>>`
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
  .slick-next:before,
  .slick-prev:before {
    color: ${props => props.theme['@primary-color']};
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

const BaseCarousel: ElementComponent<BaseCarouselProps> = props => {
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
  const settings: BaseSliderProps = {
    adaptiveHeight: props.adaptiveHeight,
    arrows: props.arrows,
    autoplay: props.autoplay,
    autoplaySpeed: props.autoplaySpeed || 3000,
    centerMode: props.centerMode,
    centerPadding: props.centerPadding,
    dots: props.dots,
    dotsClass: props.dotsClass,
    draggable: props.draggable,
    infinite: props.infinite,
    rows: props.rows || 1,
    slidesPerRow: props.slidesPerRow || 1,
    slidesToScroll: props.slidesToScroll || 1,
    slidesToShow: props.slidesToShow || 1,
    speed: props.speed,
    swipeToSlide: props.swipeToSlide,
    swipe: props.swipe,
    vertical: props.vertical || false,
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

export default BaseCarousel
