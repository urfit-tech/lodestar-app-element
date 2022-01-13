import { CraftActivityCollection } from '../components/common/CraftElement'

const ActivityPage: React.VFC = () => {
  return (
    <div>
      <CraftActivityCollection variant="card" source={{ from: 'publishedAt', limit: 3 }} withSelector />
    </div>
  )
}

export default ActivityPage
