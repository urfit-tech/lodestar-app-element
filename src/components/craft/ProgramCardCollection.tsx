import { UserComponent } from '@craftjs/core'
import ProgramCard from '../cards/ProgramCard'
import ProgramSecondaryCard from '../cards/ProgramSecondaryCard'
import { CollectionBaseProps } from '../collections/Collection'
import ProgramCollection, { ProgramCollectionOptions } from '../collections/ProgramCollection'
import { Craftize } from '../common'

export type ProgramCardCollectionProps = CollectionBaseProps<ProgramCollectionOptions> & {
  variant?: 'primary' | 'secondary'
}
const ProgramCardCollection: UserComponent<ProgramCardCollectionProps> = ({ variant, ...programCollectionProps }) => {
  return variant === 'secondary' ? (
    <ProgramCollection element={Craftize(ProgramSecondaryCard)} {...programCollectionProps} />
  ) : (
    <ProgramCollection element={Craftize(ProgramCard)} {...programCollectionProps} />
  )
}

export default ProgramCardCollection
