import React from 'react'
import styled from 'styled-components'

const SliderWrapper = styled.div`
  position: relative;
  padding-top: 70%;

  @media (min-width: 992px) {
    padding-top: 36%;
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
  background-image: url(${props => props.srcMobile});

  @media (min-width: 992px) {
    background-image: url(${props => props.srcDesktop});
  }
`
const StyledCoverHeading = styled.h2`
  color: #fff;
  font-size: 28px;
  font-weight: 500;
  letter-spacing: 0.23px;

  @media (min-width: 992px) {
    font-size: 52px;
    line-height: 1.3;
    letter-spacing: 1px;
    text-align: center;
  }
`

const StyledCoverSubHeading = styled.h3`
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

const Slide: React.FC<{
  srcDesktop: string
  srcMobile: string
  title: string
  subtitle: string
  onClick?: () => void
  buttonText?: React.ReactElement | string
}> = ({ srcDesktop, srcMobile, title, subtitle, buttonText, onClick }) => {
  return (
    <SliderWrapper>
      <StyledCoverBackground
        srcDesktop={srcDesktop}
        srcMobile={srcMobile}
        className={`d-flex align-items-center${buttonText ? '' : ' cursor-pointer'} cover-background`}
        onClick={onClick}
      >
        <div className="container">
          {title && (
            <StyledCoverHeading as="h1" className="mb-3 cover-heading">
              {title}
            </StyledCoverHeading>
          )}
          {subtitle && (
            <StyledCoverSubHeading as="h2" className="mb-4 cover-sub-heading">
              {subtitle}
            </StyledCoverSubHeading>
          )}
          {buttonText && <StyledCoverButton className="cover-button">{buttonText}</StyledCoverButton>}
        </div>
      </StyledCoverBackground>
    </SliderWrapper>
  )
}

export default Slide
