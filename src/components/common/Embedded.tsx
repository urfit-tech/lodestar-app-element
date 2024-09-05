import InnerHTML from 'dangerously-set-html-content'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { ElementComponent } from '../../types/element'
import commonMessages from './translation'

const StyledDiv = styled.div<EmbeddedProps>`
  iframe {
    width: 100%;
  }
`

export type EmbeddedProps = { iframe: string }
const Embedded: ElementComponent<EmbeddedProps> = props => {
  const { formatMessage } = useIntl()
  if (props.loading || props.errors) {
    return null
  }
  // FIXME: escape special characters
  return (
    <StyledDiv {...props}>
      {props.iframe ? <InnerHTML html={props.iframe} /> : formatMessage(commonMessages.Embedded.iframe)}
    </StyledDiv>
  )
}

export default Embedded
