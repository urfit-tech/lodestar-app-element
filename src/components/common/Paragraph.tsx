import styled from 'styled-components'
import { ElementComponent } from '../../types/element'

const StyledParagraph = styled.p`
  white-space: pre-line;
  margin-bottom: 0;
`
const Paragraph: ElementComponent = props => {
  if (props.loading || props.errors) {
    return null
  }
  return <StyledParagraph className={props.className}>{props.children}</StyledParagraph>
}

export default Paragraph
