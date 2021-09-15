import { useNode } from '@craftjs/core'
import React from 'react'
import { usePublishedPodcastProgramCollection } from '../../hooks/data'
import PodcastProgramCard from '../cards/PodcastProgramCard'
import { CraftRefBlock } from '../common'
import Skeleton from '../Skeleton'

const PodcastProgramBlock: React.VFC<{
  customContentIds?: string[]
  craftEnabled?: boolean
}> = ({ customContentIds, craftEnabled }) => {
  const {
    connectors: { connect },
    selected,
    hovered,
  } = useNode(node => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
  }))
  const { loadingPodcastPrograms, errorPodcastPrograms, podcastPrograms } = usePublishedPodcastProgramCollection({
    ids: customContentIds,
    limit: customContentIds?.length ? undefined : 3,
  })

  if (loadingPodcastPrograms)
    return (
      <>
        <Skeleton height="20px" className="my-1" />
        <Skeleton height="20px" className="my-1" />
        <Skeleton height="20px" className="my-1" />
      </>
    )

  if (podcastPrograms.length === 0 || errorPodcastPrograms) return null

  return (
    <>
      {podcastPrograms.map(podcastProgram => (
        <CraftRefBlock
          ref={ref => ref && connect(ref)}
          style={{
            width: '100%',
          }}
          hovered={hovered}
          enabled={craftEnabled}
          selected={selected}
        >
          <PodcastProgramCard key={podcastProgram.id} podcastProgram={podcastProgram} craftEnabled={craftEnabled} />
        </CraftRefBlock>
      ))}
    </>
  )
}

export default PodcastProgramBlock
