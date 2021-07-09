import React from 'react'
import { useProjectCollection } from '../../hooks/data'
import { ProjectType } from '../../types/data'
import ProjectCard from '../cards/ProjectCard'
import Skeleton from '../Skeleton'

const ProjectBlock: React.VFC<{
  projectType?: ProjectType
  displayAmount?: number
  categoryId?: string
}> = ({ projectType, displayAmount, categoryId }) => {
  const { loadingProjects, errorProjects, projects } = useProjectCollection({
    projectType,
    categoryId: categoryId,
    limit: displayAmount,
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
        <div className="mb-5">
          <ProjectCard key={project.id} project={project} />
        </div>
      ))}
    </>
  )
}

export default ProjectBlock
