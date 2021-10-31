import { Children, useEffect, useRef } from 'react'
import { isFragment } from 'react-is'
import Slider, { Settings, Settings as SliderProps } from 'react-slick'
import styled from 'styled-components'
import { ElementComponent, ElementProps } from '../../types/element'

export type CarouselProps = SliderProps & { variant?: 'cover'; currentSlide?: number }

const StyledSlider = styled(Slider)<ElementProps<CarouselProps>>`
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
    bottom: 8px;
    pointer-events: ${props => props.editing && 'none'};
    button::before {
      font-size: 10px;
      color: #cdcdcd;
    }
    .slick-active button::before {
      color: ${props => props.theme['@primary-color']};
    }
  }
`

const Carousel: ElementComponent<CarouselProps> = props => {
  const sliderRef = useRef<Slider>(null)
  useEffect(() => {
    console.log('currentSlide', props.currentSlide)
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
    arrows: true,
    dots: true,
    slidesToShow: 1,
    ...props,
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
