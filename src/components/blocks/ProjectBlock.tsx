import { useNode } from '@craftjs/core'
import React from 'react'
import { useProjectCollection } from '../../hooks/data'
import { ProjectType } from '../../types/data'
import ProjectCard from '../cards/ProjectCard'
import { CraftRefBlock } from '../common'
import Skeleton from '../Skeleton'

const ProjectBlock: React.VFC<{
  projectType?: ProjectType
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
          ref={ref => ref && connect(ref)}
          style={{
            width: '100%',
          }}
          hovered={hovered}
          enabled={craftEnabled}
          selected={selected}
        >
          <ProjectCard key={project.id} project={project} craftEnabled={craftEnabled} />
        </CraftRefBlock>
      ))}
    </>
  )
}

export default ProjectBlock
