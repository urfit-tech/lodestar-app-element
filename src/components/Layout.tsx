import React from 'react'
import styled from 'styled-components'
import { generateCustomLayoutStyle, generateCustomMarginStyle } from '../components/common/index'
import { LayoutProps, MarginProps } from '../types/style'

const StyledLayout = styled.div<{ customStyle: MarginProps & LayoutProps }>`
  ${generateCustomMarginStyle}
  ${generateCustomLayoutStyle}
`

const Layout: React.FC<{
  children: React.ReactNode | React.ReactNode[]
  className?: string
  customStyle: {
    margin?: MarginProps
  } & LayoutProps
}> = ({ children, className, customStyle, ...props }) => {
  const { margin, ...restStyle } = customStyle
  return (
    <StyledLayout customStyle={{ ...restStyle, ...margin }} className={className} {...props}>
      {children}
    </StyledLayout>
  )
}

export default Layout
