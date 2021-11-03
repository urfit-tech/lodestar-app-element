import { Skeleton, SkeletonText } from '@chakra-ui/skeleton'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import DefaultAvatar from '../../images/default-avatar.svg'
import { ElementComponent, MemberElementProps } from '../../types/element'

const StyledCreatorAvatar = styled.div<{ url: string }>`
  width: 100%;
  padding-top: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  background-image: ${props => props?.url && `url(${props.url})`};
`
const StyledCreatorName = styled.div`
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.77px;
`
const StyledCreatorTitle = styled.div`
  font-size: 14px;
  letter-spacing: 0.18px;
  font-weight: 500;
`
const StyledCreatorAbstract = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
  font-weight: 500;
`
const MemberSecondaryCard: ElementComponent<MemberElementProps> = props => {
  const history = useHistory()
  const { loading, errors, editing } = props
  return (
    <div
      className="m-2"
      style={{ cursor: 'pointer' }}
      onClick={e =>
        loading || editing ? e.preventDefault() : history.push(`/creators/${props.id}?tabkey=introduction`)
      }
    >
      <StyledCreatorAvatar className="mb-2" url={props.avatarUrl || DefaultAvatar} />
      <StyledCreatorName className="mb-2 text-left">
        {loading ? <Skeleton width={40} height={6} /> : props.name}
      </StyledCreatorName>
      <StyledCreatorTitle className="mb-3 text-left">
        {loading ? <Skeleton width={20} height={4} /> : props.title}
      </StyledCreatorTitle>
      <StyledCreatorAbstract className="text-left">
        {loading ? <SkeletonText noOfLines={3} /> : props.abstract}
      </StyledCreatorAbstract>
    </div>
  )
}

export default MemberSecondaryCard
