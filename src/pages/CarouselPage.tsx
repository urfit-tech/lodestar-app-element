import { Element } from '@craftjs/core'
import { useEffect, useState } from 'react'
import { CraftCarousel, CraftSection } from '../components/common/CraftElement'

const CarouselPage = () => {
  const [autoplay, setAutoplay] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoplay(true)
    }, 3000) // 3-second delay
    return () => clearTimeout(timer)
  }, [])

  return (
    <Element id="RootSection" is={CraftSection} canvas customStyle={{ backgroundColor: 'lightgray', padding: 48 }}>
      <Element id="Carousel" is={CraftCarousel} canvas dots infinite autoplay={autoplay}>
        <Element
          key="1"
          id="Slide1"
          is={CraftSection}
          customStyle={{ padding: '40px 0', background: 'yellow' }}
          canvas
        />
        <Element
          key="2"
          id="Slide2"
          is={CraftSection}
          customStyle={{ padding: '40px 0', background: 'red' }}
          canvas
        />
        <Element
          key="3"
          id="Slide3"
          is={CraftSection}
          customStyle={{ padding: '40px 0', background: 'black' }}
          canvas
        />
      </Element>
    </Element>
  )
}

export default CarouselPage
