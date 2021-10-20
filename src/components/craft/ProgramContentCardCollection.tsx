import { UserComponent } from '@craftjs/core'
import ProgramContentCard from '../cards/ProgramContentCard'
import ProgramContentCollection, { ProgramContentCollectionOptions } from '../collections/ProgramContentCollection'
import { CollectionBaseProps } from '../common/Collection'

export type ProgramContentCardCollectionProps = CollectionBaseProps<ProgramContentCollectionOptions> & {}
const ProgramContentCardCollection: UserComponent<ProgramContentCardCollectionProps> = ({
  ...programCollectionProps
}) => {
  return <ProgramContentCollection element={ProgramContentCard} {...programCollectionProps} />
}

export default ProgramContentCardCollection
