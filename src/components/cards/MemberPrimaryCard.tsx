import { Skeleton } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import DefaultAvatar from '../../images/default-avatar.svg'
import { ElementComponent, MemberElementProps } from '../../types/element'

const StyledInstructorBlock = styled.div`
  padding: 1rem;
`
const StyledAvatar = styled.img`
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 100%;
  min-width: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  background: #ccc;
`
const StyledTitle = styled.div`
  margin-bottom: 0.5rem;
  font-size: 18px;
  color: var(--gray-darker);
  font-weight: bold;
  text-align: center;
  letter-spacing: 0.8px;
`
const StyledDescription = styled.div`
  color: #a9a9a9;
  line-height: 1.5;
  letter-spacing: 0.2px;
  max-width: 190px;
  text-align: center;
  margin: 0 auto;
  max-height: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 8;
`

const MemberPrimaryCard: ElementComponent<MemberElementProps> = props => {
  const { loading, errors, editing } = props
  return (
    <StyledInstructorBlock key={props.id}>
      <Link to={loading || editing ? '#!' : `/creators/${props.id}`}>
        <div className="mb-4">
          <StyledAvatar
            src={props.avatarUrl !== null ? props.avatarUrl : DefaultAvatar}
            alt={props.name}
            className="mx-auto"
          />
        </div>
        <StyledTitle>{loading ? <Skeleton width={40} height={4} /> : props.name}</StyledTitle>
        <StyledDescription>{props.abstract}</StyledDescription>
      </Link>
    </StyledInstructorBlock>
  )
}

export default MemberPrimaryCard
