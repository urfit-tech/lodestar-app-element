import { UserComponent } from '@craftjs/core'
import { Craftize } from '../common'
import { CollectionBaseProps } from '../common/Collection'
import ProgramCard from '../program/ProgramCard'
import ProgramCollection, { ProgramCollectionOptions } from '../program/ProgramCollection'
import ProgramSecondaryCard from '../program/ProgramSecondaryCard'

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
