import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { generateCustomMarginStyle, generateCustomPaddingStyle, StyledTitle as Title } from '.'
import { BackgroundProps } from '../../types/style'

export const StyledLink = styled(Link)`
  margin-top: 40px;
`
export const StyledTitle = styled(Title)`
  margin: 0 auto;
  margin-bottom: 40px;
`
const StyledSection = styled.section<{ customStyle?: BackgroundProps }>`
  position: relative;
  background-color: ${props => props.customStyle?.backgroundColor || 'white'};
  background-image: ${props => props.customStyle?.backgroundImage && `url(${props.customStyle.backgroundImage})`};
  background-size: cover;
  background-position: center;

  ${props =>
    props.customStyle?.mode === 'light' &&
    css`
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(256, 256, 256, 0.4);
        z-index: -1;
      }
    `};

  ${props =>
    props.customStyle?.mode === 'dark' &&
    css`
      color: white;
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: -1;
      }
    `};

  && {
    ${generateCustomMarginStyle}
    ${generateCustomPaddingStyle}
  }
`

export default StyledSection
