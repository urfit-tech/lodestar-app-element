import { useEditor, useNode, UserComponent } from '@craftjs/core'
import styled from 'styled-components'
import { CraftRefBlock } from '../common'

const StyledDiv = styled.div`
  iframe {
    width: 100%;
  }
`

const CraftEmbed: UserComponent<{
  iframe: string
  margin: `${number};${number};${number};${number}`
}> = () => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const {
    connectors: { connect },
    props: { iframe, margin },
    selected,
    hovered,
  } = useNode(node => ({
    props: node.data.props,
    selected: node.events.selected,
    hovered: node.events.hovered,
  }))

  return (
    <CraftRefBlock
      ref={ref => ref && connect(ref)}
      style={{ width: '100%', minHeight: '50px' }}
      events={{ hovered, selected }}
      options={{ enabled }}
    >
      <StyledDiv
        style={{
          marginTop: `${margin.split(';')[0] || 0}px`,
          marginRight: `${margin.split(';')[1] || 0}px`,
          marginBottom: `${margin.split(';')[2] || 0}px`,
          marginLeft: `${margin.split(';')[3] || 0}px`,
        }}
      >
        {iframe ? <div dangerouslySetInnerHTML={{ __html: iframe }} /> : '請填入 iframe'}
      </StyledDiv>
    </CraftRefBlock>
  )
}

export default CraftEmbed
