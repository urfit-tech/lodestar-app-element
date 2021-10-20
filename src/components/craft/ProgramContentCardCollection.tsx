import { UserComponent } from '@craftjs/core'
import { CollectionBaseProps } from '../common/Collection'
import ProgramContentCard from '../program/ProgramContentCard'
import ProgramContentCollection, { ProgramContentCollectionOptions } from '../program/ProgramContentCollection'

export type ProgramContentCardCollectionProps = CollectionBaseProps<ProgramContentCollectionOptions> & {}
const ProgramContentCardCollection: UserComponent<ProgramContentCardCollectionProps> = ({
  ...programCollectionProps
}) => {
  return <ProgramContentCollection element={ProgramContentCard} {...programCollectionProps} />
}

export default ProgramContentCardCollection
