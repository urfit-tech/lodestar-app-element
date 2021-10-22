import CraftActivityCollection from '../components/craft/CraftActivityCollection'

const ActivityPage: React.VFC = () => {
  return (
    <div>
      <CraftActivityCollection variant="card" sourceOptions={{ source: 'publishedAt', limit: 3 }} withSelector />
    </div>
  )
}

export default ActivityPage
