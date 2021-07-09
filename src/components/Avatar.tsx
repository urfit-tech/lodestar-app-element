import React from 'react'
import styled from 'styled-components'
import { usePublicMember } from '../hooks/data'
import DefaultAvatar from '../images/icons/avatar.svg'
import { MemberPublicProps } from '../types/data'

type AvatarImageProps = {
  src?: string | null
  shape?: AvatarProps['shape']
  size?: AvatarProps['size']
  background?: string
}

const AvatarImage = styled.div<AvatarImageProps>`
  ${props => {
    if (typeof props.size === 'number') {
      return `width: ${props.size}px; height: ${props.size}px;`
    }
    if (props.size === 'small') {
      return 'width: 1.5rem; height: 1.5rem;'
    }
    if (props.size === 'large') {
      return 'width: 2.5rem; height: 2.5rem;'
    }
    return 'width: 2rem; height: 2rem;'
  }}
  background-color: ${props => props.background || '#ccc'};
  background-image: url(${props => props.src || DefaultAvatar});
  background-size: cover;
  background-position: center;
  border-radius: ${props => (props.shape === 'square' ? '4px' : '50%')};
`

const MemberName = styled.span`
  font-size: 14px;
  color: #9b9b9b;
`

type AvatarProps = {
  memberId: string
  shape?: 'circle' | 'square'
  size?: number | 'default' | 'small' | 'large'
  withName?: boolean
  renderAvatar?: (member: MemberPublicProps | null) => React.ReactNode
  renderText?: (member: MemberPublicProps | null) => React.ReactNode
}

const Avatar: React.FC<AvatarProps> & {
  Image: typeof AvatarImage
} = ({ memberId, shape, size, withName, renderAvatar, renderText }) => {
  const { member } = usePublicMember(memberId)

  return (
    <div className="d-flex align-items-center">
      {renderAvatar ? renderAvatar(member) : <AvatarImage src={member?.pictureUrl} shape={shape} size={size} />}
      {renderText && renderText(member)}
      {withName && <MemberName className="ml-3">{member?.name}</MemberName>}
    </div>
  )
}

Avatar.Image = AvatarImage

export default Avatar
