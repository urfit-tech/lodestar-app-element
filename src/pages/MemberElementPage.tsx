import MemberPrimaryCard from '../components/cards/MemberPrimaryCard'
import MemberSecondaryCard from '../components/cards/MemberSecondaryCard'
import { CraftMemberCollection } from '../components/common/CraftElement'

const MemberElementPage: React.FC = () => {
  return (
    <div>
      <MemberPrimaryCard loading />
      <MemberSecondaryCard loading />
      <CraftMemberCollection source={{ from: 'role', limit: 10 }} />
      <CraftMemberCollection variant="secondary" source={{ from: 'role', role: 'app-owner' }} />
      <CraftMemberCollection source={{ from: 'role', role: 'content-creator' }} />
    </div>
  )
}

export default MemberElementPage
