import { useEditor, UserComponent } from '@craftjs/core'
import { Project } from '../../types/data'
import ProjectBlock from '../blocks/ProjectBlock'

const CraftProject: UserComponent<{
  customContentIds?: string[]
  projectType?: Project['type']
}> = ({ projectType, customContentIds }) => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  return <ProjectBlock projectType={projectType} customContentIds={customContentIds} craftEnabled={enabled} />
}

export default CraftProject
