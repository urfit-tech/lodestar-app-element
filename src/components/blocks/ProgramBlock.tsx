import React from 'react'
import { usePublishedProgramCollection } from '../../hooks/data'
import ProgramCard from '../cards/ProgramCard'
import Skeleton from '../Skeleton'

const ProgramBlock: React.VFC<{
  customContentIds?: string[]
}> = ({ customContentIds }) => {
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
        <div>
          <ProgramCard key={program.id} program={program} />
        </div>
      ))}
    </>
  )
}

export default ProgramBlock
