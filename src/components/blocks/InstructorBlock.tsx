import React from 'react'
import { useInstructorCollection } from '../../hooks/data'
import { ReactComponent as AngleThinLeftIcon } from '../../images/icons/angle-thin-left.svg'
import { ReactComponent as AngleThinRightIcon } from '../../images/icons/angle-thin-right.svg'
import Carousel from '../Carousel'
import Instructor from '../Instructor'
import { BREAK_POINT } from '../Responsive'
import Skeleton from '../Skeleton'

const InstructorBlock: React.FC<{
  appId: string
  displayAmount?: number
  isShowDescription?: boolean
}> = ({ appId, displayAmount, isShowDescription }) => {
  const { loadingInstructors, errorInstructors, instructors } = useInstructorCollection(appId)

  if (loadingInstructors)
    return (
      <>
        <Skeleton height="20px" className="my-1" />
        <Skeleton height="20px" className="my-1" />
        <Skeleton height="20px" className="my-1" />
      </>
    )

  if (instructors.length === 0 || errorInstructors) return null

  return (
    <Carousel
      dots={false}
      arrows={true}
      draggable
      swipeToSlide
      slidesToShow={instructors.length < 3 ? instructors.length : 3}
      slidesToScroll={instructors.length < 3 ? instructors.length : 3}
      prevArrow={<AngleThinLeftIcon />}
      nextArrow={<AngleThinRightIcon />}
      responsive={[
        {
          breakpoint: BREAK_POINT,
          settings: {
            slidesToShow: 1,
          },
        },
      ]}
    >
      {instructors.slice(0, displayAmount).map(v => (
        <Instructor
          key={v.id}
          id={v.id}
          name={v.name}
          abstract={v.abstract}
          description={v.description}
          avatarUrl={v.avatarUrl}
          isShowDescription={!!isShowDescription}
        />
      ))}
    </Carousel>
  )
}

export default InstructorBlock
