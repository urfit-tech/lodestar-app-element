import styled, { css } from 'styled-components'
import { ElementComponent } from '../../types/element'
import { BREAK_POINT } from './Responsive'

export type LayoutProps = {
  type?: 'flex' | 'grid'
  mobile?: {
    columnAmount?: number
    columnRatio?: number[]
  }
  desktop?: {
    columnAmount?: number
    columnRatio?: number[]
  }
}

const StyledLayout = styled.div<LayoutProps>`
  ${props => props.type && `display: ${props.type};`}

  ${props =>
    props.type === 'grid' &&
    css`
      grid-template-columns: ${props.mobile?.columnRatio?.reduce((a, v) => (a += v + 'fr '), '') ||
      (props.mobile?.columnAmount && `repeat(${props.mobile.columnAmount},${12 / props.mobile.columnAmount})fr`) ||
      '12fr'};
      grid-gap: 1.5rem;
      place-items: center;
      @media (min-width: ${BREAK_POINT}px) {
        grid-gap: 30px;
        grid-template-columns: ${props.desktop?.columnRatio?.reduce((a, v) => (a += v + 'fr '), '') ||
        (props.desktop?.columnAmount && `repeat(${props.desktop.columnAmount},${12 / props.desktop.columnAmount})fr`) ||
        'repeat(3,4fr)'};
      }
    `}
`

const Layout: ElementComponent<LayoutProps> = props => {
  const { children, loading, errors } = props
  return (
    (!loading && !errors && (
      <StyledLayout className={props.className} {...props}>
        {children}
      </StyledLayout>
    )) ||
    null
  )
}

export default Layout
