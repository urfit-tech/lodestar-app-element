import styled from 'styled-components'
import { generateCustomLayoutStyle } from '.'
import { ElementComponent } from '../../types/element'
import { LayoutProps } from '../../types/style'

const StyledLayout = styled.div<{ customStyle?: LayoutProps }>`
  && {
    ${generateCustomLayoutStyle}
  }
`

const Layout: ElementComponent<{
  className?: string
  customStyle?: LayoutProps
}> = props => {
  const { children, loading, errors } = props
  return (
    (!loading && !errors && (
      <StyledLayout customStyle={props.customStyle} className={props.className}>
        {children}
      </StyledLayout>
    )) ||
    null
  )
}

export default Layout
