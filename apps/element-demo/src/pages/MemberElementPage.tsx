import MemberPrimaryCard from '@lodestar/ui/components/cards/MemberPrimaryCard'
import MemberSecondaryCard from '@lodestar/ui/components/cards/MemberSecondaryCard'
import { CraftMemberCollection } from '../craft/CraftMemberCollection'

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
