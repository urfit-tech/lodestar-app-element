import { CraftProgramCollection } from '../components/craft'

const ProgramCollectionPage: React.VFC = () => {
  return (
    <div className="container">
      <CraftProgramCollection
        columns={[2, null, 4]}
        options={{
          source: 'currentPrice',
          min: 100,
          max: 1000,
          asc: true,
          limit: 3,
          defaultTagNames: ['教學', 'tag_1'],
        }}
      />
      <hr />
      <CraftProgramCollection
        columns={[1, 5]}
        options={{
          source: 'publishedAt',
          asc: true,
          limit: 5,
          defaultCategoryIds: ['286b4906-0550-4c56-a16b-ce88fe516690', 'd4778f83-6891-4e41-8c04-82db7195b85e'],
        }}
      />
      <hr />
      <CraftProgramCollection
        columns={2}
        gutter={12}
        options={{
          source: 'custom',
          idList: [
            'fa0c97e9-475e-43b6-b7ed-67f8e27ab4c6',
            'c08d6910-893a-419a-9df5-792727541dd1',
            '93c0098f-35db-4c26-ac09-283d48522790',
          ],
        }}
      />
    </div>
  )
}

export default ProgramCollectionPage
