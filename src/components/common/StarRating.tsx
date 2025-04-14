import { Icon } from '@chakra-ui/react'
import React from 'react'
import styled from 'styled-components'
import { ReactComponent as StarGrayIcon } from '../../images/star-gray.svg'
import { ReactComponent as StarHalfIcon } from '../../images/star-half.svg'
import { ReactComponent as StarIcon } from '../../images/star.svg'

const StyledStarRating = styled.div<{ size?: string }>`
  && svg {
    margin-right: 2px;
  }
  svg:last-child {
    margin-right: 4px;
  }
  font-size: ${props => props.size || '16px'};
`

const StarRating: React.FC<{ score: number; max: number; size?: string }> = ({ score, max, size }) => {
  const starLists = []
  while (starLists.length < max) {
    if (starLists.length < Math.floor(score)) {
      starLists.push(<Icon key={starLists.length} as={StarIcon} />)
      continue
    }
    if (0 < score - Math.floor(score)) {
      starLists.push(<Icon key={starLists.length} as={StarHalfIcon} />)
      continue
    }
    starLists.push(<Icon key={starLists.length} as={StarGrayIcon} />)
  }

  return (
    <StyledStarRating className="d-flex" size={size}>
      {starLists}
    </StyledStarRating>
  )
}

export default StarRating
