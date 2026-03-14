import { Link } from 'react-router-dom'
import styled from 'styled-components'
import DefaultAvatar from '../../images/icons/avatar.svg'
import { ElementComponent } from '../../types/element'

const StyledInstructorBlock = styled.div`
  padding: 1rem;
`
const StyledAvatar = styled.img<{ size?: number }>`
  overflow: hidden;
  background: #ccc;
  display: block;
  margin: 0 auto 0.75rem;
  width: ${props => props.size || 56}px;
  height: ${props => props.size || 56}px;
  border-radius: 50%;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  object-fit: cover;
  object-position: center;
`
const StyledSubTitle = styled.h2`
  color: var(--gray-darker);
  text-align: center;
  font-size: 24px;
  margin-bottom: 8px;
  font-weight: bold;
  line-height: 1.3;
  letter-spacing: 0.77;
  font-weight: 500;
`
const StyledDescription = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
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
const StyledAbstract = styled(StyledDescription)`
  color: #a9a9a9;
  line-height: 1.5;
  font-weight: 500;
`

const Instructor: ElementComponent<{
  id: string | null
  name: string | null
  abstract: string | null
  description: string | null
  avatarUrl: string | null
  isShowDescription?: boolean
}> = props => {
  if (props.loading || props.errors) {
    return null
  }
  const { id, name, abstract, description, avatarUrl, isShowDescription } = props
  return (
    <StyledInstructorBlock key={id}>
      <Link to={`/creators/${id}`} onClick={props.editing ? e => e.preventDefault() : undefined}>
        <div className="mb-4">
          <StyledAvatar
            src={avatarUrl !== null ? avatarUrl : DefaultAvatar}
            alt={name || ''}
            className="mx-auto"
            size={128}
          />
        </div>
        <StyledSubTitle className="subtitle">{name}</StyledSubTitle>
        <StyledAbstract className="abstract">{abstract}</StyledAbstract>
        {isShowDescription && <StyledDescription className="mt-3 description">{description}</StyledDescription>}
      </Link>
    </StyledInstructorBlock>
  )
}

export default Instructor
