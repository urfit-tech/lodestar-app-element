import { useNode } from '@craftjs/core'
import React from 'react'
import { usePublishedActivityCollection } from '../../hooks/data'
import ActivityCard from '../cards/ActivityCard'
import { CraftRefBlock } from '../common'
import Skeleton from '../Skeleton'

const ActivityBlock: React.VFC<{
  activityIds: string[]
  craftEnabled?: boolean
}> = ({ activityIds, craftEnabled }) => {
  const {
    connectors: { connect },
    selected,
    hovered,
  } = useNode(node => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
  }))
  const { loadingActivities, errorActivities, activities } = usePublishedActivityCollection({
    ids: activityIds,
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
        <CraftRefBlock
          ref={ref => ref && connect(ref)}
          style={{
            width: '100%',
          }}
          events={{ hovered, selected }}
          options={{ enabled: craftEnabled }}
        >
          <ActivityCard key={activity.id} activity={activity} craftEnabled={craftEnabled} />
        </CraftRefBlock>
      ))}
    </>
  )
}

export default ActivityBlock
