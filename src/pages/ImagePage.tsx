import { Element } from '@craftjs/core'
import { CraftImage, CraftSection } from '../components/common/CraftElement'

const ImagePage = () => {
  return (
    <Element id="Section" is={CraftSection} canvas customStyle={{ padding: 0 }}>
      <Element
        is={CraftImage}
        src="https://images.unsplash.com/photo-1504297050568-910d24c426d3?ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
      />
      <Element
        is={CraftImage}
        src="https://images.unsplash.com/photo-1504297050568-910d24c426d3?ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        width={400}
        ratio={9 / 16}
      />
      <Element
        is={CraftImage}
        src="https://images.unsplash.com/photo-1504297050568-910d24c426d3?ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        width={48}
        height={48}
        shape="circle"
      />
      <Element
        is={CraftImage}
        src="https://images.unsplash.com/photo-1504297050568-910d24c426d3?ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        shape="rounded"
      />
    </Element>
  )
}

export default ImagePage
