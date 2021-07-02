import styled, { css } from 'styled-components'
import { BackgroundProps } from '../types/style'

const StyledSection = styled.section<{ customStyle: BackgroundProps }>`
  position: relative;
  padding: 64px 0;
  background-color: ${props =>
    props.customStyle.backgroundColor ? `url(${props.customStyle.backgroundImage})` : 'white'};
  background-image: ${props => props.customStyle.backgroundImage && `url(${props.customStyle.backgroundImage})`};
  background-size: cover;
  background-position: center;

  ${props =>
    props.customStyle.mode === 'light' &&
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
    props.customStyle.mode === 'dark' &&
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
    ${props => css`
      margin: ${props.customStyle.mt}px ${props.customStyle.mr}px ${props.customStyle.mb}px ${props.customStyle.ml}px;
      padding: ${props.customStyle.pt}px ${props.customStyle.pr}px ${props.customStyle.pb}px ${props.customStyle.pl}px;
    `}
  }
`

export default StyledSection
