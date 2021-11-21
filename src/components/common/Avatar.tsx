import { Skeleton, SkeletonCircle } from '@chakra-ui/skeleton'
import classNames from 'classnames'
import styled from 'styled-components'
import { DeepPick } from 'ts-deep-pick/lib'
import { usePublicMember } from '../../hooks/data'
import DefaultAvatar from '../../images/icons/avatar.svg'
import { Member } from '../../types/data'

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
  shape?: 'circle' | 'square'
  size?: number | 'default' | 'small' | 'large'
  withName?: boolean
  renderAvatar?: (
    member: DeepPick<Member, 'id' | 'name' | 'pictureUrl'> | null,
    onClick?: (memberId: string) => void,
  ) => React.ReactNode
  renderText?: (
    member: DeepPick<Member, 'id' | 'name' | 'pictureUrl'> | null,
    onClick?: (memberId: string) => void,
  ) => React.ReactNode
  onClick?: (memberId: string) => void
}

const Avatar: React.FC<
  AvatarProps & {
    memberId: string
  }
> & {
  Image: typeof AvatarImage
} = ({ memberId, shape, size, withName, renderAvatar, renderText, onClick }) => {
  const { member } = usePublicMember(memberId)

  return (
    <div className="d-flex align-items-center" onClick={() => onClick?.(memberId)}>
      {renderAvatar ? renderAvatar(member) : <AvatarImage src={member?.pictureUrl} shape={shape} size={size} />}
      {renderText && renderText(member)}
      {withName && <MemberName className="ml-3">{member?.name}</MemberName>}
    </div>
  )
}

Avatar.Image = AvatarImage

export const MultiAvatar: React.FC<
  {
    memberIdList: string[]
  } & (
    | {
        loading: true
      }
    | ({
        loading?: never
      } & AvatarProps)
  )
> = props => {
  const { loading, memberIdList } = props
  const memberId = memberIdList[0]
  const { member } = usePublicMember(memberId)

  return (
    <div className="d-flex align-items-center">
      {loading ? (
        <>
          <SkeletonCircle className="mr-3" />
          <Skeleton width={Math.random() * 100 + 50} height={4} />
        </>
      ) : (
        <>
          {props.renderAvatar?.(member, props.onClick) || (
            <AvatarImage
              className={classNames({ 'cursor-pointer': Boolean(props.onClick) })}
              src={member?.pictureUrl}
              shape={props.shape}
              size={props.size}
              onClick={() => props.onClick?.(memberId)}
            />
          )}
          {props.renderText?.(member, props.onClick) ||
            (props.withName && (
              <MemberName
                className={classNames('ml-3', { 'cursor-pointer': Boolean(props.onClick) })}
                onClick={() => props.onClick?.(memberId)}
              >
                {member?.name}
              </MemberName>
            ))}
        </>
      )}
    </div>
  )
}

export default Avatar
