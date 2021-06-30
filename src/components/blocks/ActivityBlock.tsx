import React from 'react'
import { usePublishedActivityCollection } from '../../hooks/data'
import ActivityCard from '../cards/ActivityCard'
import Skeleton from '../Skeleton'

const ActivityBlock: React.VFC<{
  displayAmount?: number
}> = ({ displayAmount }) => {
  const { loadingActivities, errorActivities, activities } = usePublishedActivityCollection({ limit: displayAmount })

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
        <div className="col-12 col-lg-4 mb-5">
          <ActivityCard key={activity.id} activity={activity} />
        </div>
      ))}
    </>
  )
}

export default ActivityBlock
