import Slider, { Settings as SliderProps } from 'react-slick'
import styled from 'styled-components'
import { ElementComponent } from '../../types/element'

type CarouselProps = SliderProps & { variant?: 'cover' }

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
  return <StyledSlider {...props}>{props.children}</StyledSlider>
}

export default Carousel
