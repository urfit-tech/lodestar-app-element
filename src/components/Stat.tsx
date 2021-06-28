import React from 'react'
import styled, { css } from 'styled-components'
import { ImageProps } from '../types/style'
import { StyledParagraph } from './common'

const StyledImage = styled.img<ImageProps>`
  width: 40px;

  ${props => css`
    margin: ${props.mt}px ${props.mr}px ${props.mb}px ${props.ml}px;
    padding: ${props.pt}px ${props.pr}px ${props.pb}px ${props.pl}px;
  `}
`

const StyledDigit = styled.div<{ isDark: boolean }>`
  color: ${props => (props.isDark ? 'white' : props.theme['@primary-color'])};
  font-size: 40px;
  line-height: 0.75;
  letter-spacing: 1px;

  &::after {
    content: '+';
  }
`

const Stat: React.FC & {
  Image: typeof StyledImage
  Digit: typeof StyledDigit
  Content: typeof StyledParagraph
} = ({ children }) => <div>{children}</div>

Stat.Image = StyledImage
Stat.Digit = StyledDigit
Stat.Content = StyledParagraph

export default Stat
