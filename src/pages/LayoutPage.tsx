import { CraftButton, CraftLayout, CraftSection } from '../components/common/CraftElement'

const LayoutPage = () => {
  return (
    <>
      <CraftSection />
      <CraftLayout ratios={[1, 3, 1]}>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
      </CraftLayout>
      <CraftButton
        title="test"
        size="lg"
        customStyle={{
          margin: 12,
        }}
        responsive={{
          tablet: {
            title: 'test',
            size: 'lg',
            customStyle: {
              margin: 16,
            },
          },
          desktop: {
            title: 'test',
            size: 'lg',
            customStyle: {
              margin: 18,
            },
          },
        }}
      />
    </>
  )
}

export default LayoutPage
