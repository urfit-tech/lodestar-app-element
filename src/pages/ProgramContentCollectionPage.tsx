import ProgramContentCard from '../components/cards/ProgramContentCard'
import ProgramContentCollection from '../components/collections/ProgramContentCollection'

const ProgramContentCollectionPage: React.VFC = () => {
  return (
    <div className="container">
      <ProgramContentCollection
        element={ProgramContentCard}
        options={{
          source: 'recentWatched',
          limit: 3,
        }}
      />
      <hr />
      {/* <ProgramContentCollection
        element={ProgramContentCard}
        layout={{
          columns: 2,
          gutter: 12,
        }}
        options={{
          source: 'custom',
          idList: ['f3cdb3a8-90ba-4c49-8c2b-cf20c1f93606'],
        }}
      /> */}
      <hr />
    </div>
  )
}

export default ProgramContentCollectionPage
