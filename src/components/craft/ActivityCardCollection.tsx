import { UserComponent } from '@craftjs/core'
import ActivityCard from '../cards/ActivityCard'
import ActivityCollection, { ActivityCollectionOptions } from '../collections/ActivityCollection'
import { CollectionBaseProps } from '../collections/Collection'
import { Craftize } from '../common'

export type ActivityCardCollectionProps = CollectionBaseProps<ActivityCollectionOptions>
const ActivityCardCollection: UserComponent<ActivityCardCollectionProps> = ({ ...activityCollectionProps }) => {
  return <ActivityCollection element={Craftize(ActivityCard)} {...activityCollectionProps} />
}

export default ActivityCardCollection
