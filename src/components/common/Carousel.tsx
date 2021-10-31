import { Children } from 'react'
import { isFragment } from 'react-is'
import Slider, { Settings as SliderProps } from 'react-slick'
import styled from 'styled-components'
import { ElementComponent } from '../../types/element'

export type CarouselProps = SliderProps & { variant?: 'cover' }

const StyledSlider = styled(Slider)<CarouselProps>`
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

const Carousel: ElementComponent<CarouselProps> = props => {
  if (props.loading || props.errors) {
    return null
  }
  let children = props.children

  // validate top level dom is only one fragment
  if (Children.count(props.children) === 1 && isFragment(props.children)) {
    const { children: fragmentChildren } = props.children.props
    children = fragmentChildren
  }

  return (
    <StyledSlider
      className={props.className}
      arrows={props.editing || props.arrows}
      dots={props.editing || props.dots}
      autoplay={props.editing ? false : props.autoplay}
      draggable={props.editing ? false : props.draggable}
      slidesToShow={props.slidesToShow}
      slidesToScroll={props.slidesToScroll}
      infinite={props.infinite}
    >
      {Children.map(children, (child, idx) => (
        <div key={idx}>{child}</div>
      ))}
    </StyledSlider>
  )
}

export default Carousel
