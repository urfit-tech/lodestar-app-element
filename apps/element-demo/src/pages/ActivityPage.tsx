import { CraftActivityCollection } from '@lodestar/ui/components/common/CraftElement'

const ActivityPage: React.FC = () => {
  return (
    <div>
      <CraftActivityCollection variant="card" source={{ from: 'publishedAt', limit: 3 }} withSelector />
    </div>
  )
}

export default ActivityPage
