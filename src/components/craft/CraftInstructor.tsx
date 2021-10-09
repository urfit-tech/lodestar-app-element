import { useEditor, UserComponent } from '@craftjs/core'
import InstructorBlock from '../blocks/InstructorBlock'

const CraftInstructor: UserComponent<{
  appId: string
  customContentIds?: string[]
}> = ({ appId, customContentIds }) => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  return <InstructorBlock appId={appId} customContentIds={customContentIds} craftEnabled={enabled} />
}

export default CraftInstructor
