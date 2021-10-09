import { useEditor, UserComponent } from '@craftjs/core'
import PodcastProgramBlock from '../blocks/PodcastProgramBlock'

const CraftPodcastProgram: UserComponent<{
  customContentIds?: string[]
}> = ({ customContentIds }) => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  return <PodcastProgramBlock customContentIds={customContentIds} craftEnabled={enabled} />
}

export default CraftPodcastProgram
