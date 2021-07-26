import React from 'react'
import styled from 'styled-components'
import { ParagraphProps, TitleProps } from '../types/style'
import { generateCustomParagraphStyle, generateCustomTitleStyle } from './common'

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
  background-image: url(${props => props.srcMobile});
  background-size: cover;
  background-position: center;

  @media (min-width: 992px) {
    background-image: url(${props => props.srcDesktop});
  }
`
const StyledCoverHeading = styled.h2<{ customStyle?: TitleProps }>`
  color: ${props => props.customStyle?.color || 'white'};
  font-size: 28px;
  font-weight: 500;
  letter-spacing: 0.23px;
  ${props => props.customStyle && `text-align: ${props.customStyle.textAlign}`};

  @media (min-width: 992px) {
    font-size: 52px;
    line-height: 1.3;
    letter-spacing: 1px;

    && {
      ${generateCustomTitleStyle}
    }
  }
`

const StyledParagraph = styled.p<{ customStyle?: ParagraphProps }>`
  color: #fff;
  font-size: 16px;
  font-weight: ${props =>
    props.customStyle &&
    (props.customStyle.fontWeight === 'bold'
      ? 800
      : props.customStyle.fontWeight === 'normal'
      ? 500
      : props.customStyle.fontWeight === 'lighter'
      ? 200
      : 500)};
  line-height: 1.69;
  letter-spacing: 0.2px;

  @media (min-width: 992px) {
    font-size: 27px;
    text-align: center;
  }

  && {
    ${generateCustomParagraphStyle}
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
  customStyle: {
    title?: TitleProps
    paragraph?: ParagraphProps
  }
}> = ({ srcDesktop, srcMobile, title, subtitle, buttonText, onClick, customStyle }) => {
  return (
    <SliderWrapper>
      <StyledCoverBackground
        srcDesktop={srcDesktop}
        srcMobile={srcMobile}
        className={`d-flex align-items-center${buttonText ? '' : ' cursor-pointer'} cover-background`}
        onClick={onClick}
      >
        <div className="container">
          <div className="col-12 col-md-10 col-lg-6 mx-auto">
            {title && (
              <StyledCoverHeading customStyle={customStyle.title} className="mb-3">
                {title}
              </StyledCoverHeading>
            )}
            {subtitle && (
              <StyledParagraph customStyle={customStyle.paragraph} className="mb-4">
                {subtitle}
              </StyledParagraph>
            )}
          </div>
          {buttonText && <StyledCoverButton>{buttonText}</StyledCoverButton>}
        </div>
      </StyledCoverBackground>
    </SliderWrapper>
  )
}

export default Slide
