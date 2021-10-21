import { UserComponent } from '@craftjs/core'
import ProgramContentCard from '../cards/ProgramContentCard'
import { CollectionBaseProps } from '../collections/Collection'
import ProgramContentCollection, { ProgramContentCollectionOptions } from '../collections/ProgramContentCollection'

export type ProgramContentCardCollectionProps = CollectionBaseProps<ProgramContentCollectionOptions> & {}
const ProgramContentCardCollection: UserComponent<ProgramContentCardCollectionProps> = ({
  ...programCollectionProps
}) => {
  return <ProgramContentCollection element={ProgramContentCard} {...programCollectionProps} />
}

export default ProgramContentCardCollection
