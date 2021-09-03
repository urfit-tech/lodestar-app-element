import React from 'react'
import styled from 'styled-components'
import { TitleProps } from '../types/style'
import { generateCustomTitleStyle, StyledParagraph } from './common'
import Image from './Image'

const StyledDigit = styled.div<{ isDark?: boolean; customStyle: TitleProps }>`
  color: ${props => (props.isDark ? 'white' : props.theme['@primary-color'])};
  font-size: 40px;
  line-height: 0.75;
  letter-spacing: 1px;
  && {
    ${generateCustomTitleStyle}
  }
`

const Stat: React.FC & {
  Image: typeof Image
  Digit: typeof StyledDigit
  Content: typeof StyledParagraph
} = ({ children }) => <div className="d-flex flex-column align-items-center">{children}</div>

Stat.Image = Image
Stat.Digit = StyledDigit
Stat.Content = StyledParagraph

export default Stat
