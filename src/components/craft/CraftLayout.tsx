import { useEditor, useNode, UserComponent } from '@craftjs/core'
import React from 'react'
import { CraftLayoutProps } from '../../types/craft'
import { CraftRefBlock } from '../common'
import Layout from '../Layout'

const CraftLayout: UserComponent<{
  desktop: CraftLayoutProps
  mobile: CraftLayoutProps
}> = ({ desktop, mobile, children }) => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const {
    connectors: { connect, drag },
    selected,
    hovered,
  } = useNode(node => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
  }))

  return (
    <CraftRefBlock ref={ref => ref && connect(drag(ref))} events={{ hovered, selected }} options={{ enabled }}>
      <Layout
        customStyle={{
          type: 'grid',
          mobile,
          desktop,
        }}
      >
        {children}
      </Layout>
    </CraftRefBlock>
  )
}

export default CraftLayout
