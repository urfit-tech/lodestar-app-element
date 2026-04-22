import { CraftActivityCollection } from '../craft/CraftActivityCollection'

const ActivityPage: React.FC = () => {
  return (
    <div>
      <CraftActivityCollection variant="card" source={{ from: 'publishedAt', limit: 3 }} withSelector />
    </div>
  )
}

export default ActivityPage
