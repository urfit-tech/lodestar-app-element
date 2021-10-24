import { UserComponent } from '@craftjs/core'
import { useMemo } from 'react'
import { CustomSourceOptions, RecentWatchedSourceOptions } from '../../types/options'
import ProgramContentCard from '../cards/ProgramContentCard'
import { CollectionLayout } from '../collections/Collection'
import {
  CustomProgramContentCollection,
  ProgramContentElementCollection,
  RecentWatchedProgramContentCollection,
} from '../collections/ProgramContentCollection'
import { Craftize } from '../common'

export type CraftProgramContentCollectionProps = {
  sourceOptions: CustomSourceOptions | RecentWatchedSourceOptions
  variant?: 'card' | 'tile'
  layout?: CollectionLayout
  withSelector?: boolean
}

const CraftProgramContentCollection: UserComponent<CraftProgramContentCollectionProps> = ({
  variant = 'card',
  layout,
  sourceOptions,
}) => {
  // options.source -> xxx collection
  const CraftCollection = useMemo(() => {
    // variant -> card / tile
    const craftElement = Craftize(variant === 'card' ? ProgramContentCard : ProgramContentCard)
    let ElementCollection: ProgramContentElementCollection
    switch (sourceOptions.source) {
      case 'recentWatched':
        ElementCollection = RecentWatchedProgramContentCollection(craftElement)(sourceOptions)
        break
      case 'custom':
        ElementCollection = CustomProgramContentCollection(craftElement)(sourceOptions)
        break
      default:
        ElementCollection = RecentWatchedProgramContentCollection(craftElement)(sourceOptions)
    }
    return <ElementCollection layout={layout} />
  }, [variant, layout, sourceOptions])

  return CraftCollection
}

export default CraftProgramContentCollection
