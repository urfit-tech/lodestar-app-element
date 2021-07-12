import React from 'react'
import { usePublishedPodcastProgramCollection } from '../../hooks/data'
import PodcastProgramCard from '../cards/PodcastProgramCard'
import Skeleton from '../Skeleton'

const PodcastProgramBlock: React.VFC<{
  displayAmount?: number
}> = ({ displayAmount }) => {
  const { loadingPodcastPrograms, errorPodcastPrograms, podcastPrograms } = usePublishedPodcastProgramCollection({
    limit: displayAmount,
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
        <PodcastProgramCard key={podcastProgram.id} podcastProgram={podcastProgram} />
      ))}
    </>
  )
}

export default PodcastProgramBlock
