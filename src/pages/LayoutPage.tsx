import { Element } from '@craftjs/core'
import styled from 'styled-components'
import { CraftButton, CraftLayout, CraftSection } from '../components/common/CraftElement'

const StyledButton = styled.button`
  background: lightgray;
  padding: 8px 16px;
  border-radius: 4px;
`
const LayoutPage = () => {
  return (
    <Element id="Section" is={CraftSection} canvas customStyle={{ padding: 0 }}>
      <Element is={CraftLayout} ratios={[1, 3, 1]} canvas customStyle={{ padding: 0 }}>
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
        customStyle={{
          margin: 12,
          background: 'red',
          textAlign: 'right',
        }}
      />
    </Element>
  )
}

export default LayoutPage
