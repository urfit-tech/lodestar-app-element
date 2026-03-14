import classNames from 'classnames'
import styled from 'styled-components'
import DefaultAvatar from '../../images/icons/avatar.svg'
import { ElementComponent } from '../../types/element'
import { MultiLineTruncationMixin } from '../common'
import { StyledImage } from '../common/Image'

export type CardProps = {
  variant?: 'outline' | 'background'
  darkMode?: boolean
  shadowed?: boolean
  horizontal?: boolean
  onClick?: () => void
}

const CardTitle = styled.h3<CardProps>`
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: ${props => (props.darkMode ? 'white' : 'var(--gray-darker)')};
`
const CardContent = styled.div`
  width: 100%;
  padding: 1.25rem;
`
const CardDescription = styled.p`
  ${MultiLineTruncationMixin}
  margin-bottom: 12px;
  height: 3em;
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const CardMetaBlock = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  line-height: 1.5rem;
`

const StyledCard = styled.div<CardProps>`
  -webkit-transform: translate3d(0, 0, 0);
  position: relative;
  display: flex;
  border-radius: 4px;
  width: 100%;
  transition: 0.3s;
  user-select: none;
  align-items: center;
  justify-content: center;
  flex-direction: ${props => (props.horizontal ? 'row' : 'column')};
  border: ${props => props.variant === 'outline' && '1px solid white'};
  filter: ${props => props.shadowed && 'drop-shadow(0 2px 12px rgba(0, 0, 0, 0.1))'};
`

const StyledAvatarBlock = styled.div<{ direction?: 'row' | 'column' }>`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  color: #585858;
  font-size: 14px;
  ${props => props.direction === 'column' && 'flex-direction: column;'}
`
const AvatarImage = styled.div<{ src?: string }>`
  width: 2.5rem;
  height: 2.5rem;
  background-color: #ccc;
  background-image: url(${props => props.src || DefaultAvatar});
  background-size: cover;
  background-position: center;
  border-radius: 50%;
`
const MemberName = styled.span`
  font-size: 14px;
  color: #9b9b9b;
`

const CardAvatar: React.FC<{
  src?: string
  name?: string
  withName?: boolean
  withAvatarImage?: boolean
  direction?: 'row' | 'column'
}> = ({ src, name, withName, withAvatarImage, direction = 'row' }) => (
  <StyledAvatarBlock direction={direction}>
    {withAvatarImage && <AvatarImage src={src} />}
    {withName && (
      <MemberName className={withAvatarImage ? (direction === 'row' ? 'ml-3' : 'mt-3') : ''}>{name}</MemberName>
    )}
  </StyledAvatarBlock>
)

const Card: ElementComponent<CardProps> & {
  Image: typeof StyledImage
  Title: typeof CardTitle
  Content: typeof CardContent
  Description: typeof CardDescription
  MetaBlock: typeof CardMetaBlock
  Avatar: typeof CardAvatar
} = props => {
  return (
    <StyledCard className={classNames('card', props.className)} {...props}>
      {props.children}
    </StyledCard>
  )
}
Card.Image = StyledImage
Card.Title = CardTitle
Card.Content = CardContent
Card.Description = CardDescription
Card.MetaBlock = CardMetaBlock
Card.Avatar = CardAvatar

export default Card
