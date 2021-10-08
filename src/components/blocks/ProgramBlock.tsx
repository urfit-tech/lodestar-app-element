import { SkeletonText } from '@chakra-ui/react'
import { useNode } from '@craftjs/core'
import React from 'react'
import { usePublishedProgramCollection } from '../../hooks/data'
import { PlanPeriod } from '../../types/shared'
import ProgramCard from '../cards/ProgramCard'
import { CraftRefBlock } from '../common'

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

  if (loadingPrograms) return <SkeletonText noOfLines={3} />

  if (programs.length === 0 || errorPrograms) return null

  return (
    <>
      {programs.map(program => (
        <CraftRefBlock
          key={program.id}
          ref={ref => ref && connect(ref)}
          style={{
            width: '100%',
          }}
          events={{ hovered, selected }}
          options={{ enabled: craftEnabled }}
        >
          <ProgramCard
            key={program.id}
            craftEnabled={craftEnabled}
            id={program.id}
            title={program.title}
            abstract={program.abstract || ''}
            totalDuration={program.totalDuration || 0}
            coverUrl={program.coverUrl}
            instructorIds={program.roles.map(programRole => programRole.id)}
            listPrice={program.listPrice || 0}
            salePrice={program.salePrice}
            soldAt={program.soldAt}
            period={program.plans
              .filter(programPlan => programPlan.periodAmount && programPlan.periodType)
              .reduce((accum, v) => {
                if (!accum) {
                  accum = { amount: v.periodAmount, type: v.periodType }
                }
                return accum
              }, null as PlanPeriod | null)}
          />
        </CraftRefBlock>
      ))}
    </>
  )
}

export default ProgramBlock
