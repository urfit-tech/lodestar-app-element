import React from 'react'
import styled from 'styled-components'
import { useInstructorCollection } from '../../hooks/data'
import AngleThinLeft from '../../images/icons/angle-thin-left.svg'
import AngleThinRight from '../../images/icons/angle-thin-right.svg'
import Carousel from '../Carousel'
import Instructor from '../Instructor'
import { BREAK_POINT } from '../Responsive'
import Skeleton from '../Skeleton'

const StyledCarousel = styled(Carousel)`
  && {
    .slick-next::before,
    .slick-prev::before {
      content: none;
    }
    .slick-prev,
    .slick-next {
      margin-top: -32px;
      width: 64px;
      height: 64px;
      font-size: 64px;
    }
    .slick-prev {
      left: -64px;
      &,
      &:hover,
      &:focus {
        background-image: url(${AngleThinLeft});
      }
    }
    .slick-next {
      right: -64px;
      &,
      &:hover,
      &:focus {
        background-image: url(${AngleThinRight});
      }
    }
  }
`

const InstructorBlock: React.FC<{
  appId: string
  displayAmount?: number
  isShowDescription?: boolean
}> = ({ appId, displayAmount = 4, isShowDescription }) => {
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
    <StyledCarousel
      arrows
      dots={false}
      draggable
      swipeToSlide
      slidesToShow={instructors.length < displayAmount ? instructors.length : displayAmount}
      slidesToScroll={1}
      responsive={[
        {
          breakpoint: BREAK_POINT,
          settings: {
            slidesToShow: 1,
          },
        },
      ]}
    >
      {instructors.map(v => (
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
    </StyledCarousel>
  )
}

export default InstructorBlock
