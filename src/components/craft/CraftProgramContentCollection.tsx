import { useEditor, UserComponent } from '@craftjs/core'
import { useMemo } from 'react'
import { CustomSourceOptions, RecentWatchedSourceOptions } from '../../types/options'
import ProgramContentCard from '../cards/ProgramContentCard'
import { CollectionLayout } from '../collections/Collection'
import {
  CustomProgramContentCollection,
  ProgramContentElementCollection,
  RecentWatchedProgramContentCollection,
} from '../collections/ProgramContentCollection'

export type CraftProgramContentCollectionProps = {
  variant: 'card' | 'tile'
  sourceOptions: CustomSourceOptions | RecentWatchedSourceOptions
  layout?: CollectionLayout
  withSelector?: boolean
}

const CraftProgramContentCollection: UserComponent<CraftProgramContentCollectionProps> = ({
  variant,
  layout,
  sourceOptions,
}) => {
  const { editing } = useEditor(state => ({
    editing: state.options.enabled,
  }))

  // variant -> card / tile
  const element = variant === 'card' ? ProgramContentCard : ProgramContentCard

  // options.source -> xxx collection
  const CraftCollection = useMemo(() => {
    let ElementCollection: ProgramContentElementCollection
    switch (sourceOptions.source) {
      case 'recentWatched':
        ElementCollection = RecentWatchedProgramContentCollection(element)(sourceOptions)
        break
      case 'custom':
        ElementCollection = CustomProgramContentCollection(element)(sourceOptions)
        break
      default:
        ElementCollection = RecentWatchedProgramContentCollection(element)(sourceOptions)
    }
    return <ElementCollection editing={editing} layout={layout} />
  }, [editing, element, layout, sourceOptions])

  return CraftCollection
}

export default CraftProgramContentCollection
