import { FC, HTMLAttributes, useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { ElementComponent } from '../../types/element'
import commonMessages from './translation'

const StyledDiv = styled.div<EmbeddedProps>`
  iframe {
    width: 100%;
  }
`

type HtmlContentProps = HTMLAttributes<HTMLDivElement> & {
  html: string
  allowRerender?: boolean
}

const HtmlContent: FC<HtmlContentProps> = ({ html, allowRerender, ...rest }) => {
  const divRef = useRef<HTMLDivElement>(null)
  const shouldRenderRef = useRef(true)

  useEffect(() => {
    if (!html || !divRef.current || !shouldRenderRef.current) return

    shouldRenderRef.current = Boolean(allowRerender)
    const slotHtml = document.createRange().createContextualFragment(html)
    divRef.current.innerHTML = ''
    divRef.current.appendChild(slotHtml)
  }, [allowRerender, html])

  return <div {...rest} ref={divRef} />
}

export type EmbeddedProps = { iframe: string }
const Embedded: ElementComponent<EmbeddedProps> = props => {
  const { formatMessage } = useIntl()
  if (props.loading || props.errors) {
    return null
  }
  // FIXME: escape special characters
  return (
    <StyledDiv {...props}>
      {props.iframe ? <HtmlContent html={props.iframe} /> : formatMessage(commonMessages.Embedded.iframe)}
    </StyledDiv>
  )
}

export default Embedded
