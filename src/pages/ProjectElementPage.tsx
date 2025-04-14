import ProjectCard from '../components/cards/ProjectCard'
import { CraftProjectCollection } from '../components/common/CraftElement'
// import CraftProgramPackageCollection from '../components/craft/CraftProgramPackageCollection'

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
