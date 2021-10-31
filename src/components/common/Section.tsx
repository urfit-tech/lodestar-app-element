import styled, { css } from 'styled-components'
import { ElementComponent } from '../../types/element'

export type SectionProps = {
  horizontal?: boolean
  darkMode?: boolean
}

const StyledSection = styled.section<SectionProps>`
  width: 100%;
  display: flex;
  position: relative;
  background-size: cover;
  background-position: center;
  flex-direction: ${props => (props.horizontal ? 'row' : 'column')};

  ${props =>
    props.darkMode
      ? css`
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
        `
      : css`
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
`

const Section: ElementComponent<SectionProps> = props => {
  if (props.loading || props.errors) {
    return null
  }
  return <StyledSection {...props}>{props.children}</StyledSection>
}

export default Section
