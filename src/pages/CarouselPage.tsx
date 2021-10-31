import { Element, useEditor } from '@craftjs/core'
import { CraftButton, CraftCarousel, CraftSection } from '../components/common/CraftElement'

const CarouselPage = () => {
  const { currentNode } = useEditor(state => ({
    currentNode: state.events.selected ? state.nodes[state.events.selected] : null,
  }))
  return (
    <>
      <Element id="Section" is={CraftSection} canvas>
        <Element id="Button" is={CraftButton} title="A" />
        <Element id="Button1" is={CraftButton} title="B" />
        <Element id="Button2" is={CraftButton} title="C" />
        <Element id="Button3" is={CraftButton} title="D" />
      </Element>
      <Element id="Carousel" is={CraftCarousel} canvas>
        <Element
          key="1"
          id="Section"
          is={CraftSection}
          customStyle={{ padding: '40px 0', background: 'black' }}
          canvas
        />
        <Element
          key="2"
          id="Section1"
          is={CraftSection}
          customStyle={{ padding: '40px 0', background: 'black' }}
          canvas
        />
        <Element
          key="3"
          id="Section2"
          is={CraftSection}
          customStyle={{ padding: '40px 0', background: 'black' }}
          canvas
        />
      </Element>
      {currentNode && (
        <div>
          Current node: {currentNode.id} / {JSON.stringify(currentNode.data.custom)}
        </div>
      )}
    </>
  )
}

export default CarouselPage
