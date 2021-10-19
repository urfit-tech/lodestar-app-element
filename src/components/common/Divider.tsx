import React from 'react'
import styled from 'styled-components'

const StyledDivider = styled.div`
  display: table;
  margin: 16px 0;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 16px;
  white-space: nowrap;
  text-align: center;
  background: transparent;
  clear: both;
  width: 100%;
  min-width: 100%;
  height: 1px;
  position: relative;
  top: -0.06em;
  vertical-align: middle;

  :before,
  :after {
    position: relative;
    top: 50%;
    display: table-cell;
    width: 50%;
    border-top: 1px solid #e8e8e8;
    transform: translateY(50%);
    content: '';
  }
  > span {
    display: inline-block;
    padding: 0 24px;
  }
`

const Divider: React.FC = props => {
  const { children } = props
  return <StyledDivider>{children && <span>{children}</span>}</StyledDivider>
}
export default Divider
