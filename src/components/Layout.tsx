import styled from 'styled-components'
import { generateCustomLayoutStyle } from '../components/common/index'
import { LayoutProps } from '../types/style'

const StyledLayout = styled.div<{ customStyle: LayoutProps }>`
  && {
    ${generateCustomLayoutStyle}
  }
`

const Layout: React.FC<{
  children: React.ReactNode | React.ReactNode[]
  className?: string
  customStyle: LayoutProps
}> = ({ children, className, customStyle, ...props }) => {
  return (
    <StyledLayout customStyle={customStyle} className={className} {...props}>
      {children}
    </StyledLayout>
  )
}

export default Layout
