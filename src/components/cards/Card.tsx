import styled, { css } from 'styled-components'
import { MultiLineTruncationMixin } from '../../helpers/style'
import DefaultAvatar from '../../images/icons/avatar.svg'
import { CardProps, ParagraphProps, TitleProps } from '../../types/style'
import {
  generateCustomBorderStyle,
  generateCustomMarginStyle,
  generateCustomPaddingStyle,
  generateCustomParagraphStyle,
  generateCustomTitleStyle,
} from '../common'
import { StyledImage } from '../common/Image'

const StyleCardTitle = styled.h3<{ customStyle?: TitleProps; isDark?: boolean }>`
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: ${props => (props.isDark ? 'white' : 'var(--gray-darker)')};

  && {
    ${generateCustomTitleStyle}
  }
`
const StyledContentBlock = styled.div`
  padding: 1.25rem;
`
const StyledCardContent = styled.p<{ customStyle?: ParagraphProps }>`
  font-weight: ${props =>
    props.customStyle &&
    (props.customStyle.fontWeight === 'bold'
      ? 800
      : props.customStyle.fontWeight === 'normal'
      ? 500
      : props.customStyle.fontWeight === 'lighter'
      ? 200
      : 500)};

  && {
    ${generateCustomParagraphStyle}
  }
`
const StyledDescription = styled.div`
  ${MultiLineTruncationMixin}
  margin-bottom: 12px;
  height: 3em;
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledMetaBlock = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  line-height: 1.5rem;
`
const StyledCard = styled.div<{ isDark?: boolean; customStyle: { direction: 'row' | 'column' } & CardProps }>`
  position: relative;
  display: flex;
  flex-direction: ${props => props.customStyle.direction};
  ${props =>
    props.customStyle.direction === 'row'
      ? css`
          align-items: center;
          justify-content: center;
        `
      : ''}
  border-radius: 4px;
  width: 100%;
  transition: 0.3s;
  user-select: none;
  ${props =>
    props.customStyle.backgroundColor &&
    css`
      background-color: ${props.customStyle.backgroundColor};
    `};
  ${props =>
    props.customStyle.backgroundImage &&
    css`
      background-image: url(${props.customStyle.backgroundImage});
      background-size: cover;
      background-position: center;
    `}

  ${props =>
    props.customStyle.bordered
      ? css`
          border: 1px solid ${props.customStyle.borderColor || 'white'};
        `
      : ''}
  ${props =>
    props.customStyle.shadow && props.customStyle.backgroundColor
      ? `filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.1));`
      : ``}
  ${props =>
    props.customStyle.dropShadow && props.customStyle.backgroundColor
      ? `filter: drop-shadow(${props.customStyle.dropShadow});`
      : ``}
  ${props => props.customStyle.overflow && `overflow: ${props.customStyle.overflow};`}
  
  && {
    ${generateCustomMarginStyle}
    ${generateCustomPaddingStyle}
    ${generateCustomBorderStyle}
  }
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

const Avatar: React.VFC<{
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

const Card: React.FC<{
  className?: string
  isDark?: boolean
  customStyle: { direction: 'row' | 'column' } & CardProps
  onClick?: () => void
}> & {
  Image: typeof StyledImage
  Title: typeof StyleCardTitle
  Content: typeof StyledCardContent
  ContentBlock: typeof StyledContentBlock
  Description: typeof StyledDescription
  MetaBlock: typeof StyledMetaBlock
  Avatar: typeof Avatar
} = ({ children, ...props }) => {
  return <StyledCard {...props}>{children}</StyledCard>
}

Card.Image = StyledImage
Card.Title = StyleCardTitle
Card.Content = StyledCardContent
Card.ContentBlock = StyledContentBlock
Card.Description = StyledDescription
Card.MetaBlock = StyledMetaBlock
Card.Avatar = Avatar

export default Card
