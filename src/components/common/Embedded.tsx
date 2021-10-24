import styled from 'styled-components'
import { ElementComponent } from '../../types/element'

const StyledDiv = styled.div`
  iframe {
    width: 100%;
  }
`

const Embedded: ElementComponent<{
  iframe: string
}> = props => {
  if (props.loading || props.errors) {
    return null
  }
  // FIXME: escape special characters
  return (
    <StyledDiv>{props.iframe ? <div dangerouslySetInnerHTML={{ __html: props.iframe }} /> : '請填入 iframe'}</StyledDiv>
  )
}

export default Embedded