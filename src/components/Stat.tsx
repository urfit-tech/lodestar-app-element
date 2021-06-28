import React from 'react'
import styled, { css } from 'styled-components'
import { ImageProps } from '../types/style'
import { StyledParagraph } from './common'

const StyledImage = styled.img<{ customStyle: ImageProps }>`
  width: 40px;

  ${props => css`
    margin: ${props.customStyle.mt}px ${props.customStyle.mr}px ${props.customStyle.mb}px ${props.customStyle.ml}px;
    padding: ${props.customStyle.pt}px ${props.customStyle.pr}px ${props.customStyle.pb}px ${props.customStyle.pl}px;
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
