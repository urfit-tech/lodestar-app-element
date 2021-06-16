import React from 'react'
import styled from 'styled-components'

const StyledDigit = styled.div<{ isDark: boolean }>`
  color: ${props => (props.isDark ? 'white' : props.theme['@primary-color'])};
  font-size: 40px;
  line-height: 0.75;
  letter-spacing: 1px;

  &::after {
    content: '+';
  }
`

const Stat: React.FC & { Digit: typeof StyledDigit } = ({ children }) => <div>{children}</div>

Stat.Digit = StyledDigit

export default Stat
