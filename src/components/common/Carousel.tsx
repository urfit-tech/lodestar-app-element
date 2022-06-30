import { Children, useEffect, useRef } from 'react'
import { isFragment } from 'react-is'
import Slider, { Settings } from 'react-slick'
import styled from 'styled-components'
import { ElementComponent, ElementProps } from '../../types/element'
import { BaseCarouselProps } from './BaseCarousel'

const StyledSlider = styled(Slider)<ElementProps<BaseCarouselProps>>`
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

const Carousel: ElementComponent<BaseCarouselProps> = props => {
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
    adaptiveHeight: Boolean(props.adaptiveHeight),
    arrows: Boolean(props.arrows),
    autoplay: Boolean(props.autoplay),
    autoplaySpeed: Number(props.autoplaySpeed) || 3000,
    centerMode: Boolean(props.centerMode),
    centerPadding: props.centerPadding,
    dots: Boolean(props.dots),
    draggable: props.draggable === undefined ? true : Boolean(props.draggable),
    infinite: Boolean(props.infinite),
    rows: Number(props.rows) || 1,
    slidesPerRow: Number(props.slidesPerRow) || 1,
    slidesToScroll: Number(props.slidesToScroll) || 1,
    slidesToShow: Number(props.slidesToShow) || 1,
    speed: Number(props.speed) || 500,
    swipeToSlide: Boolean(props.swipeToSlide),
    swipe: props.swipe === undefined ? true : Boolean(props.swipe),
    vertical: Boolean(props.vertical),
  }
  return (
    <StyledSlider
      className={props.className}
      ref={sliderRef}
      {...settings}
      swipe={props.editing ? false : settings.swipe}
      draggable={props.editing ? false : settings.draggable}
    >
      {Children.map(children, (child, idx) => (
        <div key={idx}>{child}</div>
      ))}
    </StyledSlider>
  )
}

export default Carousel
