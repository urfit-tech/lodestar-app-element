import styled from 'styled-components'
import useWindowDimensions from '../../hooks/util'
import { ElementComponent } from '../../types/element'

const SliderWrapper = styled.div`
  position: relative;
  padding-top: 70%;

  @media (min-width: 992px) {
    padding-top: 32%;
  }
`

const StyledCoverBackground = styled.div<{ srcDesktop: string; srcMobile: string }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  background-size: cover;
  background-position: center;

  @media (min-width: 992px) {
  }
`
const StyledCoverHeading = styled.h2`
  color: white;
  font-size: 28px;
  font-weight: 500;
  letter-spacing: 0.23px;

  @media (min-width: 992px) {
    font-size: 52px;
    line-height: 1.3;
    letter-spacing: 1px;
  }
`

const StyledParagraph = styled.p`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.69;
  letter-spacing: 0.2px;

  @media (min-width: 992px) {
    font-size: 27px;
    text-align: center;
  }
`

const StyledCoverButton = styled.div`
  border-radius: 4px;
  width: 142px;
  height: 44px;
  background: ${props => props.theme['@primary-color']};
  color: white;
  line-height: 44px;
  @media (min-width: 992px) {
    text-align: center;
  }
`

const Slide: ElementComponent<{
  srcDesktop: string
  srcMobile: string
  title?: string
  subtitle?: string
  onClick?: () => void
  buttonText?: React.ReactElement | string
}> = props => {
  if (props.loading || props.errors) {
    return null
  }
  const { srcDesktop, srcMobile, title, subtitle, buttonText, onClick } = props
  const { width } = useWindowDimensions()
  return (
    <SliderWrapper>
      <StyledCoverBackground
        srcDesktop={srcDesktop}
        srcMobile={srcMobile}
        className={`d-flex align-items-center${buttonText ? '' : ' cursor-pointer'} cover-background`}
        onClick={onClick}
      >
        <img src={width > 991 ? srcDesktop : srcMobile} />
        <div className="container">
          <div className="col-12 col-md-10 col-lg-6 mx-auto">
            {title && <StyledCoverHeading className="mb-3">{title}</StyledCoverHeading>}
            {subtitle && <StyledParagraph className="mb-4">{subtitle}</StyledParagraph>}
          </div>
          {buttonText && <StyledCoverButton>{buttonText}</StyledCoverButton>}
        </div>
      </StyledCoverBackground>
    </SliderWrapper>
  )
}

export default Slide
