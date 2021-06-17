import styled, { css } from 'styled-components'

const StyledSection = styled.section<
  { background?: null; mode?: never } | { background: string; mode?: 'light' | 'dark' }
>`
  background-color: white;
  background-image: ${props => props.background && `url(${props.background})`};
  background-size: cover;
  background-position: center;
  padding: 64px 0;
  position: relative;

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
