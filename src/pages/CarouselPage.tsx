import { CraftCarousel, CraftSection, CraftTitle } from '../components/common/CraftElement'

const CarouselPage = () => {
  return (
    <>
      <CraftCarousel dots>
        <CraftSection customStyle={{ padding: '40px 0', background: 'yellow' }}>
          <CraftTitle title="sample1" />
        </CraftSection>
        <CraftSection customStyle={{ padding: '40px 0', background: 'red' }}>
          <CraftTitle title="sample2" />
        </CraftSection>
        <CraftSection customStyle={{ padding: '40px 0', background: 'blue' }}>
          <CraftTitle title="sample3" />
        </CraftSection>
      </CraftCarousel>
    </>
  )
}

export default CarouselPage
