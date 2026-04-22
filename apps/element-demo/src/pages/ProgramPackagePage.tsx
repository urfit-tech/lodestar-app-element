import { useIntl } from 'react-intl'
import ProgramPackageCard from '@lodestar/ui/components/cards/ProgramPackageCard'
import { CraftProgramPackageCollection } from '../craft/CraftProgramPackageCollection'
import pagesMessages from './translation'

const ProgramPackagePage: React.FC = () => {
  const { formatMessage } = useIntl()
  return (
    <div>
      <ProgramPackageCard loading />
      <ProgramPackageCard
        title={formatMessage(pagesMessages.ProgramPackagePage.designerCore)}
        coverUrl="https://images.unsplash.com/photo-1593642633279-1796119d5482?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=988&q=80"
        totalDuration={74400}
        totalPrograms={3}
        salePrice={19800}
      />
      <CraftProgramPackageCollection variant="card" source={{ from: 'publishedAt' }} />
    </div>
  )
}

export default ProgramPackagePage
