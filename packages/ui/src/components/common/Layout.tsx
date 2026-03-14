import styled from 'styled-components'
import { ElementComponent } from '../../types/element'

export type LayoutProps = {
  ratios: number[]
}

const StyledLayout = styled.div<LayoutProps>`
  display: grid;
  grid-template-columns: ${props => props.ratios?.map(ratio => `minmax(0, ${ratio}fr)`).join(' ')};
  grid-gap: 1.5rem;
`

const Layout: ElementComponent<LayoutProps> = props => {
  const { children, loading, errors } = props
  return (
    (!loading && !errors && (
      <StyledLayout {...props} className={props.className}>
        {children}
      </StyledLayout>
    )) ||
    null
  )
}

export default Layout
