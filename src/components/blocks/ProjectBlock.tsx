import { useNode } from '@craftjs/core'
import { useProjectCollection } from '../../hooks/data'
import { Project } from '../../types/data'
import ProjectCard from '../cards/ProjectCard'
import { CraftRefBlock } from '../common'
import Skeleton from '../common/Skeleton'

const ProjectBlock: React.VFC<{
  projectType?: Project['type']
  customContentIds?: string[]
  categoryId?: string
  craftEnabled?: boolean
}> = ({ projectType, customContentIds, categoryId, craftEnabled }) => {
  const {
    connectors: { connect },
    selected,
    hovered,
  } = useNode(node => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
  }))
  const { loadingProjects, errorProjects, projects } = useProjectCollection({
    projectType,
    ids: customContentIds,
    categoryId: categoryId,
    limit: customContentIds?.length ? undefined : 3,
  })

  if (loadingProjects)
    return (
      <>
        <Skeleton height="20px" className="my-1" />
        <Skeleton height="20px" className="my-1" />
        <Skeleton height="20px" className="my-1" />
      </>
    )

  if (projects.length === 0 || errorProjects) return null

  return (
    <>
      {projects.map(project => (
        <CraftRefBlock
          key={project.id}
          ref={ref => ref && connect(ref)}
          style={{
            width: '100%',
          }}
          events={{ hovered, selected }}
          options={{ enabled: craftEnabled }}
        >
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            abstract={project.abstract}
            coverUrl={project.coverUrl}
            previewUrl={project.previewUrl}
            type={project.type}
            targetAmount={project.target.amount}
            targetUnit={project.target.unit}
            expiredAt={project.expiredAt}
            isParticipantsVisible={project.isParticipantsVisible}
            isCountdownTimerVisible={project.isCountdownTimerVisible}
            totalSales={project.totalSales}
            enrollmentCount={project.enrollmentCount}
            editing={craftEnabled}
          />
        </CraftRefBlock>
      ))}
    </>
  )
}

export default ProjectBlock
