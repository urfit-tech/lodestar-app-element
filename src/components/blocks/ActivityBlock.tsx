import { useNode } from '@craftjs/core'
import React from 'react'
import { usePublishedActivityCollection } from '../../hooks/data'
import ActivityCard from '../cards/ActivityCard'
import Skeleton from '../Skeleton'

const ActivityBlock: React.VFC<{
  customContentIds?: string[]
  craftEnabled?: boolean
}> = ({ customContentIds, craftEnabled }) => {
  const {
    connectors: { connect },
  } = useNode()
  const { loadingActivities, errorActivities, activities } = usePublishedActivityCollection({
    ids: customContentIds,
    limit: customContentIds?.length ? undefined : 3,
  })

  if (loadingActivities)
    return (
      <>
        <Skeleton height="20px" className="my-1" />
        <Skeleton height="20px" className="my-1" />
        <Skeleton height="20px" className="my-1" />
      </>
    )

  if (activities.length === 0 || errorActivities) return null

  return (
    <>
      {activities.map(activity => (
        <div ref={ref => ref && connect(ref)} style={{ width: '100%' }}>
          <ActivityCard key={activity.id} activity={activity} craftEnabled={craftEnabled} />
        </div>
      ))}
    </>
  )
}

export default ActivityBlock
