import { Element, Node, useNodeReturnType } from '@craftjs/core'
import styled from 'styled-components'
import { CraftButton, CraftLayout, CraftSection } from '../components/common/CraftElement'

const StyledButton = styled.button`
  background: lightgray;
  padding: 8px 16px;
  border-radius: 4px;
`
const LayoutPage = () => {
  return (
    <Element id="Section" is={CraftSection} canvas>
      <Element is={CraftLayout} ratios={[1, 3, 1]} canvas>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
      </Element>
      <Element
        id="Button"
        is={CraftButton}
        title="test"
        size="lg"
        renderExtra={(node: useNodeReturnType<Node>) => (
          <>
            <StyledButton ref={(ref: any) => ref && node.connectors.connect(node.connectors.drag(ref))}>
              Edit2
            </StyledButton>
            <StyledButton ref={(ref: any) => ref && node.connectors.connect(ref)}>Edit3</StyledButton>
          </>
        )}
        customStyle={{
          margin: 12,
          background: 'red',
        }}
      />
    </Element>
  )
}

export default LayoutPage
