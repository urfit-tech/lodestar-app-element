import styled, { CSSObject } from 'styled-components'
import { CraftMarginProps, CraftPaddingProps, CraftTextStyleProps } from '../../types/craft'
import { ElementComponent } from '../../types/element'
import Card from './Card'

const StyledTriangle = styled.div`
  position: absolute;
  bottom: -49px;
  left: 0;
  width: 20%;
  height: 50px;
  clip-path: polygon(31% 0, 0 0, 0 38%);
  background-color: inherit;
  border-color: inherit;
  border: inherit;
`

export type RichCardProps = {
  type: 'feature' | 'featureWithParagraph' | 'referrer' | 'referrerReverse'
  imageType: 'none' | 'image'
  imageUrl: string
  imageAlign?: 'flex-start' | 'flex-end' | 'center'
  imageMargin?: CraftMarginProps
  imagePadding?: CraftPaddingProps
  title: string
  titleStyle: CraftTextStyleProps
  paragraph?: string
  paragraphStyle?: CraftTextStyleProps
  cardMargin: CraftMarginProps
  cardPadding: CraftPaddingProps
  variant: 'backgroundColor' | 'outline' | 'none'
  outlineColor?: string
  backgroundType?: 'none' | 'solidColor' | 'backgroundImage'
  solidColor?: string
  backgroundImageUrl?: string
  avatarType?: 'none' | 'image'
  avatarImageUrl?: string
  avatarName?: string
  flexDirection?: 'row' | 'column'
}

const RichCard: ElementComponent<RichCardProps> = props => {
  if (props.loading || props.errors) {
    return null
  }
  const cardStyle: CSSObject = {
    flexDirection: props.flexDirection || 'column',
    border: (props.variant === 'none' && 'none') || undefined,
    borderColor: props.outlineColor,
    boxShadow: (props.variant === 'none' && 'none') || undefined,
    backgroundColor: props.backgroundType === 'solidColor' ? props.solidColor : undefined,
    backgroundImage: props.backgroundType === 'backgroundImage' ? props.backgroundImageUrl : undefined,
    ...props.cardMargin,
    ...props.cardPadding,
    ...(props.type === 'referrer' && props.variant === 'backgroundColor' && props.backgroundType === 'solidColor'
      ? { borderBottomLeftRadius: '0', dropShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }
      : {}),
  }
  const StyledCard = styled(Card)(cardStyle)
  return (
    <>
      <StyledCard>
        {props.type === 'referrerReverse' && (
          <Card.Avatar
            direction="column"
            src={props.avatarImageUrl}
            name={props.avatarName}
            withAvatarImage={props.avatarType === 'image'}
            withName={!!props.avatarName}
          />
        )}
        <Card.Image src={props.imageType === 'image' ? props.imageUrl : undefined} />
        <Card.Title>{props.title}</Card.Title>
        <Card.Content>{props.paragraph}</Card.Content>
        {props.type === 'referrer' && props.variant === 'backgroundColor' && props.backgroundType === 'solidColor' && (
          <StyledTriangle />
        )}
      </StyledCard>
      {props.type === 'referrer' && (
        <Card.Avatar
          src={props.avatarImageUrl}
          name={props.avatarName}
          withAvatarImage={props.avatarType === 'image'}
          withName={!!props.avatarName}
        />
      )}
    </>
  )
}

export default RichCard
