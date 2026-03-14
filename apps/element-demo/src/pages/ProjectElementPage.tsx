import ProjectCard from '@lodestar/ui/components/cards/ProjectCard'
import { CraftProjectCollection } from '@lodestar/ui/components/common/CraftElement'
// import CraftProgramPackageCollection from '@lodestar/ui/components/craft/CraftProgramPackageCollection'

const ProjectElementPage: React.FC = () => {
  return (
    <div>
      <ProjectCard loading />
      <CraftProjectCollection />
      {/* <CraftProgramPackageCollection variant="card" source={{ source: 'publishedAt' }} /> */}
    </div>
  )
}

export default ProjectElementPage
