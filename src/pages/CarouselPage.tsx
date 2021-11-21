import { Element, useEditor } from '@craftjs/core'
import { useState } from 'react'
import { CraftButton, CraftCarousel, CraftSection } from '../components/common/CraftElement'

const CarouselPage = () => {
  const { currentNode, actions } = useEditor(state => ({
    currentNode: state.events.selected ? state.nodes[state.events.selected] : null,
  }))
  const [slide, setSlide] = useState(0)
  return (
    <>
      <input
        type="number"
        value={Number(slide).toString()}
        onChange={e => {
          currentNode &&
            actions.setProp(currentNode.id, props => {
              props.currentSlide = Number(e.target.value)
            })
          setSlide(Number(e.target.value))
        }}
      />

      <Element id="RootSection" is={CraftSection} canvas customStyle={{ backgroundColor: 'lightgray' }}>
        <Element id="Section" is={CraftSection} canvas>
          <Element id="Button" is={CraftButton} title="A" />
          <Element id="Button1" is={CraftButton} title="B" />
          <Element id="Button2" is={CraftButton} title="C" />
          <Element id="Button3" is={CraftButton} title="D" />
        </Element>
        <Element id="Section" is={CraftSection} canvas customStyle={{ padding: 48 }}>
          <Element id="Carousel" is={CraftCarousel} canvas infinite autoplay>
            <Element
              key="1"
              id="Section"
              is={CraftSection}
              customStyle={{ padding: '40px 0', background: 'yellow' }}
              canvas
            />
            <Element
              key="2"
              id="Section1"
              is={CraftSection}
              customStyle={{ padding: '40px 0', background: 'red' }}
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
        </Element>
        <Element id="Section" is={CraftSection} canvas customStyle={{ padding: 48 }}>
          <Element id="Carousel" is={CraftCarousel} canvas infinite autoplay>
            <Element
              key="1"
              id="Section"
              is={CraftSection}
              customStyle={{ padding: '40px 0', background: 'yellow' }}
              canvas
            />
            <Element
              key="2"
              id="Section1"
              is={CraftSection}
              customStyle={{ padding: '40px 0', background: 'red' }}
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
        </Element>
        {currentNode && (
          <div>
            Current node: {currentNode.id} / {JSON.stringify(currentNode.data.custom)}
          </div>
        )}
      </Element>
    </>
  )
}

export default CarouselPage
