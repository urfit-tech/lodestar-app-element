import { useHistory } from 'react-router'
import styled from 'styled-components'
import { ElementComponent } from '../../types/element'

const StyledDiv = styled.div<EmbeddedProps>`
  iframe {
    width: 100%;
  }
`

export type EmbeddedProps = { iframe: string }
const Embedded: ElementComponent<EmbeddedProps> = props => {
  const history = useHistory()
  if (props.loading || props.errors) {
    return null
  }
  // FIXME: escape special characters

  const handleClick = (e: any) => {
    const targetLink = e.target.closest('a')
    if (!targetLink) return
    e.preventDefault()
    window.location.href = targetLink.href
  }

  return (
    <StyledDiv {...props}>
      {props.iframe ? (
        <div dangerouslySetInnerHTML={{ __html: props.iframe }} onClick={handleClick} />
      ) : (
        '請填入 iframe'
      )}
    </StyledDiv>
  )
}

export default Embedded
