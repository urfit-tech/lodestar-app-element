import styled, { CSSObject } from 'styled-components'
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
  title: string
  paragraph?: string
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
    ...(props.type === 'referrer' && props.variant === 'backgroundColor' && props.backgroundType === 'solidColor'
      ? { borderBottomLeftRadius: '0', dropShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }
      : {}),
  }
  const StyledCard = styled(Card)(cardStyle)
  return (
    <>
      <StyledCard>
        {props.backgroundType === 'backgroundImage' && props.backgroundImageUrl ? (
          <img
            src={`${props.backgroundImageUrl}`}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'inherit',
              zIndex: 0,
            }}
          />
        ) : null}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {props.type === 'referrerReverse' && (
            <Card.Avatar
              direction="column"
              src={props.avatarImageUrl}
              name={props.avatarName}
              withAvatarImage={props.avatarType === 'image'}
              withName={!!props.avatarName}
            />
          )}
          {/* <Card.Image src={props.imageType === 'image' ? props.imageUrl : undefined} /> */}
          <Card.Title>{props.title}</Card.Title>
          <Card.Content>{props.paragraph}</Card.Content>
          {props.type === 'referrer' &&
            props.variant === 'backgroundColor' &&
            props.backgroundType === 'solidColor' && <StyledTriangle />}
        </div>
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
