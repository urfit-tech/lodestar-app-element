import styled from 'styled-components'
import { ElementComponent } from '../../types/element'

const StyledParagraph = styled.p`
  white-space: pre-line;
  margin-bottom: 0;
`
export type ParagraphProps = { content: string }
const Paragraph: ElementComponent<ParagraphProps> = props => {
  if (props.loading || props.errors) {
    return null
  }
  return <StyledParagraph className={props.className}>{props.content}</StyledParagraph>
}

export default Paragraph
