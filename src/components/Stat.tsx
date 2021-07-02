import React from 'react'
import styled from 'styled-components'
import { StyledParagraph } from './common'
import Image from './Image'

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
  Image: typeof Image
  Digit: typeof StyledDigit
  Content: typeof StyledParagraph
} = ({ children }) => <div className="d-flex flex-column align-items-center">{children}</div>

Stat.Image = Image
Stat.Digit = StyledDigit
Stat.Content = StyledParagraph

export default Stat
