import React from 'react'
import { usePublishedProgramCollection } from '../../hooks/data'
import ProgramCard from '../cards/ProgramCard'
import Skeleton from '../Skeleton'

const ProgramBlock: React.VFC<{
  displayAmount?: number
  categoryId?: string
}> = ({ displayAmount, categoryId }) => {
  const { loadingPrograms, errorPrograms, programs } = usePublishedProgramCollection({
    isPrivate: false,
    categoryId,
    limit: displayAmount,
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
        <div className="col-12 col-lg-4">
          <ProgramCard key={program.id} program={program} />
        </div>
      ))}
    </>
  )
}

export default ProgramBlock
