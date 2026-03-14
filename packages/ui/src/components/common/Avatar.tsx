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
    member?: {
      id: string
      name: string
      pictureUrl: string | null
    }
  }
> & {
  Image: typeof AvatarImage
} = ({ memberId, member, shape, size, withName, renderAvatar, renderText, onClick }) => {
  const finalMemberId = member?.id || memberId
  const { loadingMember, member: memberData } = usePublicMember(memberId, {
    member: {
      id: member?.id || '',
      name: member?.name || '',
      pictureUrl: member?.pictureUrl || null,
    },
    skip: Boolean(member),
  })

  const name = member?.name || memberData?.name || ''
  const pictureUrl = member?.pictureUrl || memberData?.pictureUrl || null

  return (
    <>
      {loadingMember ? (
        <div className="d-flex align-items-center">
          <SkeletonCircle className="mr-3" />
          <Skeleton width={Math.random() * 100 + 50} height={4} />
        </div>
      ) : (
        <div className="d-flex align-items-center" onClick={() => onClick?.(finalMemberId)}>
          {renderAvatar ? (
            renderAvatar({ id: memberId, name, pictureUrl })
          ) : (
            <AvatarImage src={memberData?.pictureUrl} shape={shape} size={size} />
          )}
          {renderText && renderText(memberData)}
          {withName && <MemberName className="ml-3">{member?.name}</MemberName>}
        </div>
      )}
    </>
  )
}

Avatar.Image = AvatarImage

export const MultiAvatar: React.FC<
  {
    memberIdList: string[]
    members?: {
      id: string
      name: string
      pictureUrl: string | null
    }[]
  } & (
    | {
        loading: true
      }
    | ({
        loading?: never
      } & AvatarProps)
  )
> = props => {
  const { loading, memberIdList, members } = props
  const memberId = members?.[0].id || memberIdList[0]
  const { loadingMember, member: memberData } = usePublicMember(memberId, {
    member: {
      id: members?.[0]?.id || '',
      name: members?.[0]?.name || '',
      pictureUrl: members?.[0]?.pictureUrl || null,
    },
    skip: Boolean(members?.length !== 0),
  })

  const name = members?.[0]?.name || memberData?.name || ''
  const pictureUrl = members?.[0]?.pictureUrl || memberData?.pictureUrl || null

  return (
    <div className="d-flex align-items-center avatar">
      {loading || loadingMember ? (
        <>
          <SkeletonCircle className="mr-3" />
          <Skeleton width={Math.random() * 100 + 50} height={4} />
        </>
      ) : (
        <>
          {props.renderAvatar?.(memberData, props.onClick) || (
            <AvatarImage
              className={classNames('avatar__image', { 'cursor-pointer': Boolean(props.onClick) })}
              src={pictureUrl}
              shape={props.shape}
              size={props.size}
              onClick={() => props.onClick?.(memberId)}
            />
          )}
          {props.renderText?.(memberData, props.onClick) ||
            (props.withName && (
              <MemberName
                className={classNames('avatar__name', 'ml-3', { 'cursor-pointer': Boolean(props.onClick) })}
                onClick={() => props.onClick?.(memberId)}
              >
                {name}
              </MemberName>
            ))}
        </>
      )}
    </div>
  )
}

export default Avatar
