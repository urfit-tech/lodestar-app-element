import { UserComponent } from '@craftjs/core'
import ProgramPackageCard from '../cards/ProgramPackageCard'
import { CollectionBaseProps } from '../collections/Collection'
import ProgramPackageCollection, { ProgramPackageCollectionOptions } from '../collections/ProgramPackageCollection'
import { Craftize } from '../common'

export type ProgramPackageCardCollectionProps = CollectionBaseProps<ProgramPackageCollectionOptions>
const ProgramPackageCardCollection: UserComponent<ProgramPackageCardCollectionProps> = ({
  ...programPackageCollectionProps
}) => {
  return <ProgramPackageCollection element={Craftize(ProgramPackageCard)} {...programPackageCollectionProps} />
}

export default ProgramPackageCardCollection
