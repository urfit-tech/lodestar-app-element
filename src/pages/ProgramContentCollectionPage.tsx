import { CraftProgramContentCollection } from '../components/craft'
import { CraftRecentProgramContentCollection } from '../components/craft/CraftProgramContentCollection'

const ProgramContentCollectionPage: React.VFC = () => {
  return (
    <div className="container">
      <CraftProgramContentCollection
        columns={2}
        gutter={12}
        options={{
          source: 'custom',
          idList: ['f3cdb3a8-90ba-4c49-8c2b-cf20c1f93606'],
        }}
      />
      <hr />
      <CraftRecentProgramContentCollection columns={3} limit={3} />
    </div>
  )
}

export default ProgramContentCollectionPage
