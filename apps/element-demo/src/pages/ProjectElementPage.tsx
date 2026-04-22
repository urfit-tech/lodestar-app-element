import ProjectCard from '@lodestar/ui/components/cards/ProjectCard'
import { CraftProjectCollection } from '../craft/CraftProjectCollection'

const ProjectElementPage: React.FC = () => {
  return (
    <div>
      <ProjectCard loading />
      <CraftProjectCollection />
    </div>
  )
}

export default ProjectElementPage
