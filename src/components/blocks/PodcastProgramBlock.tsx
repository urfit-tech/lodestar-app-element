import { useNode } from '@craftjs/core'
import moment from 'moment'
import { usePublishedPodcastProgramCollection } from '../../hooks/data'
import PodcastProgramCard from '../cards/PodcastProgramCard'
import { CraftRefBlock } from '../common'
import Skeleton from '../common/Skeleton'

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
          key={podcastProgram.id}
          ref={ref => ref && connect(ref)}
          style={{
            width: '100%',
          }}
          events={{ hovered, selected }}
          options={{ enabled: craftEnabled }}
        >
          <PodcastProgramCard
            key={podcastProgram.id}
            id={podcastProgram.id}
            title={podcastProgram.title}
            coverUrl={podcastProgram.coverUrl}
            durationSecond={podcastProgram.totalDuration}
            instructor={{
              name: podcastProgram.roles[0].member.name,
              avatarUrl: podcastProgram.roles[0].member.pictureUrl,
            }}
            listPrice={
              podcastProgram.soldAt && moment() < moment(podcastProgram.soldAt) ? podcastProgram.listPrice : null
            }
            currentPrice={
              podcastProgram.soldAt && moment() < moment(podcastProgram.soldAt)
                ? podcastProgram.salePrice || 0
                : podcastProgram.listPrice
            }
            editing={craftEnabled}
          />
        </CraftRefBlock>
      ))}
    </>
  )
}

export default PodcastProgramBlock
