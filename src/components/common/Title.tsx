import styled from 'styled-components'
import { ElementComponent } from '../../types/element'

const StyledTitle = styled.h3`
  line-height: 1;
`
export type TitleProps = {
  title: string
  iconUrl?: string | null
  subtitle?: string | null
}
const Title: ElementComponent<TitleProps> = props => {
  const { loading, errors, children } = props
  return loading || errors ? (
    <div>---</div>
  ) : (
    <StyledTitle className={props.className}>
      {props.iconUrl && <div>{props.iconUrl}</div>}
      {props.title}
      {props.subtitle && <div>{props.subtitle}</div>}
    </StyledTitle>
  )
}

export default Title
