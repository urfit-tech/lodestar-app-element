import styled, { css } from 'styled-components'
import { BackgroundProps } from '../types/style'

const StyledSection = styled.section<BackgroundProps>`
  position: relative;
  padding: 64px 0;
  background-color: ${props => (props.backgroundColor ? `url(${props.backgroundImage})` : 'white')};
  background-image: ${props => props.backgroundImage && `url(${props.backgroundImage})`};
  background-size: cover;
  background-position: center;

  ${props =>
    props.mode === 'light' &&
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
    props.mode === 'dark' &&
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
`

export default StyledSection
