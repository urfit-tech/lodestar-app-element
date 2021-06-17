import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.span`
  display: inline-block;
  padding: 12px 42px;
  border-radius: 4px;
  border: solid 1px #ffffff;
  color: white;
  user-select: none;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    color: #eeee;
  }
`

const Button: React.FC = ({ children }) => {
  return <StyledButton>{children}</StyledButton>
}

export default Button
