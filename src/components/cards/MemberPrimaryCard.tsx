import { Skeleton } from '@chakra-ui/react'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import DefaultAvatar from '../../images/default-avatar.svg'
import { ElementComponent, MemberElementProps } from '../../types/element'

const StyledInstructorBlock = styled.div`
  padding: 1rem;
  cursor: pointer;
`
const StyledAvatarWrapper = styled.div`
  position: relative;
  ::before {
    float: left;
    padding-top: 100%;
    content: '';
  }
  ::after {
    display: block;
    content: '';
    clear: both;
  }
`
const StyledAvatar = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
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
  const history = useHistory()
  const { loading, errors, editing } = props
  return (
    <StyledInstructorBlock
      key={props.id}
      onClick={() => {
        !loading && !editing && history.push(`/creators/${props.id}`)
      }}
    >
      <StyledAvatarWrapper className="mb-4">
        <StyledAvatar
          src={props.avatarUrl !== null ? props.avatarUrl : DefaultAvatar}
          alt={props.name}
          className="mx-auto"
        />
      </StyledAvatarWrapper>
      <StyledTitle>
        {loading ? (
          <Skeleton width={40} height={4} />
        ) : (
          <Link to={loading || editing ? '#!' : `/creators/${props.id}`}> {props.name}</Link>
        )}
      </StyledTitle>
      <StyledDescription>{props.abstract}</StyledDescription>
    </StyledInstructorBlock>
  )
}

export default MemberPrimaryCard
