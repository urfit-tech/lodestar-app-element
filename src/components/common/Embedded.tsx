import styled from 'styled-components'
import { ElementComponent } from '../../types/element'
import InnerHTML from 'dangerously-set-html-content'

const StyledDiv = styled.div<EmbeddedProps>`
  iframe {
    width: 100%;
  }
`

export type EmbeddedProps = { iframe: string }
const Embedded: ElementComponent<EmbeddedProps> = props => {
  if (props.loading || props.errors) {
    return null
  }
  // FIXME: escape special characters
  return (
    <StyledDiv {...props}>
      {props.iframe ? <InnerHTML html={props.iframe} />: '請填入 iframe'}
    </StyledDiv>
  )
}

export default Embedded
