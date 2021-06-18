import React from 'react'
import Slider from 'react-slick'
import styled from 'styled-components'
import Dialog from './Dialog'
import Referrer from './Referrer'
import Slide from './Slide'

const StyledSlider = styled(Slider)`
  && {
    position: relative;

    .slick-dots {
      position: absolute;
      bottom: 5%;
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

    @media (min-width: 992px) {
      li button::before {
        font-size: 12px;
      }
    }
  }
`

const Carousel: React.FC & {
  Dialog: typeof Dialog
  Referrer: typeof Referrer
  Slide: typeof Slide
} = ({ children }) => (
  <StyledSlider
    dots
    infinite
    arrows={false}
    autoplay
    autoplaySpeed={5000}
    // arrows
    // dots={false}
    // draggable
    // swipeToSlide
    // slidesToShow={5}
    // slidesToScroll={1}
    // responsive={[
    //   {
    //     breakpoint: 192 * 5 - 1 + 128,
    //     settings: {
    //       slidesToShow: 4,
    //     },
    //   },
    //   {
    //     breakpoint: 192 * 4 - 1 + 128,
    //     settings: {
    //       slidesToShow: 3,
    //     },
    //   },
    //   {
    //     breakpoint: 192 * 3 - 1 + 128,
    //     settings: {
    //       slidesToShow: 2,
    //     },
    //   },
    //   {
    //     breakpoint: 192 * 2 - 1 + 128,
    //     settings: {
    //       slidesToShow: 1,
    //     },
    //   },
    // ]}
  >
    {children}
  </StyledSlider>
)

Carousel.Dialog = Dialog
Carousel.Referrer = Referrer
Carousel.Slide = Slide

export default Carousel
