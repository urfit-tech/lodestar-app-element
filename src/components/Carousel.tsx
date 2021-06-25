import React from 'react'
import Slider, { Settings } from 'react-slick'
import styled from 'styled-components'
import DialogCard from './DialogCard'
import ReferrerCard from './ReferrerCard'
import Slide from './Slide'

const StyledSlider = styled(Slider)<{ variant?: 'cover' }>`
  && {
    ${props =>
      props.variant === 'cover' &&
      `
        .slick-dots {
          bottom: 25px;
        }
      `}

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

const Carousel: React.FC<{ variant?: 'cover' } & Settings> & {
  DialogCard: typeof DialogCard
  ReferrerCard: typeof ReferrerCard
  Slide: typeof Slide
} = ({ variant, children, ...props }) => (
  <StyledSlider variant={variant} {...props}>
    {children}
  </StyledSlider>
)

Carousel.DialogCard = DialogCard
Carousel.ReferrerCard = ReferrerCard
Carousel.Slide = Slide

export default Carousel
