import styled from 'styled-components'
import { generateCustomTitleStyle } from '.'
import { ElementComponent } from '../../types/element'
import { TitleProps } from '../../types/style'

const StyledTitle = styled.h3<{ customStyle: TitleProps }>`
  line-height: 1;
  && {
    ${generateCustomTitleStyle}
  }
`
const Title: ElementComponent<TitleProps> = props => {
  const { loading, errors, children } = props
  return loading || errors ? <div>---</div> : <StyledTitle customStyle={props}>{children}</StyledTitle>
}

export default Title
