import { CraftProgramCollection } from '../components/common/CraftElement'

const ProgramElementPage: React.FC = () => {
  return (
    <div className="container">
      <CraftProgramCollection
        withSelector
        variant="primary"
        source={{
          from: 'publishedAt',
          limit: 3,
        }}
        customStyle={{
          '.program .content': {
            backgroundColor: 'red',
          },
        }}
        collectionVariant="carousel"
        carousel={{
          slidesToShow: 3,
          arrows: true,
          dots: true,
          // centerPadding: '60px',
          infinite: true,
        }}
      />
      <hr />
      {/* <CraftProgramCollection
        variant="card"
        layout={{
          gap: 8,
          gutter: 10,
          columns: 3,
        }}
        withSelector
        source={{
          from: 'publishedAt',
          asc: true,
          defaultCategoryIds: ['286b4906-0550-4c56-a16b-ce88fe516690'],
        }}
      />
      <hr />
      <CraftProgramCollection
        variant="tile"
        layout={{
          gap: 12,
          columns: 2,
        }}
        source={{
          from: 'custom',
          idList: [
            'fa0c97e9-475e-43b6-b7ed-67f8e27ab4c6',
            'c08d6910-893a-419a-9df5-792727541dd1',
            '93c0098f-35db-4c26-ac09-283d48522790',
          ],
        }}
      /> */}
    </div>
  )
}

export default ProgramElementPage
