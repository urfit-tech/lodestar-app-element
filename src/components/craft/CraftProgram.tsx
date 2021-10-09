import { useEditor, UserComponent } from '@craftjs/core'
import ProgramBlock from '../blocks/ProgramBlock'

const CraftProgram: UserComponent<{
  customContentIds?: string[]
}> = ({ customContentIds }) => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  return <ProgramBlock customContentIds={customContentIds} craftEnabled={enabled} />
}

export default CraftProgram
