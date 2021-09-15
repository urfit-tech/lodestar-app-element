import { useNode } from '@craftjs/core'
import React from 'react'
import { usePublishedProgramCollection } from '../../hooks/data'
import ProgramCard from '../cards/ProgramCard'
import { CraftRefBlock } from '../common'
import Skeleton from '../Skeleton'

const ProgramBlock: React.VFC<{
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
  const { loadingPrograms, errorPrograms, programs } = usePublishedProgramCollection({
    limit: customContentIds === undefined ? 3 : undefined,
    ids: customContentIds,
  })

  if (loadingPrograms)
    return (
      <>
        <Skeleton height="20px" className="my-1" />
        <Skeleton height="20px" className="my-1" />
        <Skeleton height="20px" className="my-1" />
      </>
    )

  if (programs.length === 0 || errorPrograms) return null

  return (
    <>
      {programs.map(program => (
        <CraftRefBlock
          ref={ref => ref && connect(ref)}
          style={{
            width: '100%',
          }}
          hovered={hovered}
          enabled={craftEnabled}
          selected={selected}
        >
          <ProgramCard key={program.id} program={program} craftEnabled={craftEnabled} />
        </CraftRefBlock>
      ))}
    </>
  )
}

export default ProgramBlock
