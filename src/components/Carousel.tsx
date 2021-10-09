import Slider, { Settings } from 'react-slick'
import styled from 'styled-components'
import { generateCustomMarginStyle } from '../components/common/index'
import { CarouselProps } from '../types/style'
import DialogCard from './DialogCard'
import ReferrerCard from './ReferrerCard'
import { BREAK_POINT } from './Responsive'
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

    ${props => generateCustomMarginStyle({ customStyle: props.customStyle?.mobile?.margin })}
    @media (min-width: ${BREAK_POINT}px) {
      li button::before {
        font-size: 12px;
      }
      ${props => generateCustomMarginStyle({ customStyle: props.customStyle?.desktop?.margin })}
    }
  }
`

const Carousel: React.FC<{ variant?: 'cover'; customStyle?: CarouselProps } & Settings> & {
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
