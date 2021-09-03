import { useNode } from '@craftjs/core'
import React from 'react'
import { useProjectCollection } from '../../hooks/data'
import { ProjectType } from '../../types/data'
import ProjectCard from '../cards/ProjectCard'
import Skeleton from '../Skeleton'

const ProjectBlock: React.VFC<{
  projectType?: ProjectType
  customContentIds?: string[]
  categoryId?: string
  craftEnabled?: boolean
}> = ({ projectType, customContentIds, categoryId, craftEnabled }) => {
  const {
    connectors: { connect },
  } = useNode()
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
        <div ref={ref => ref && connect(ref)} style={{ width: '100%' }}>
          <ProjectCard key={project.id} project={project} craftEnabled={craftEnabled} />
        </div>
      ))}
    </>
  )
}

export default ProjectBlock
