import { useEditor, useNode, UserComponent } from '@craftjs/core'
import React from 'react'
import styled from 'styled-components'
import { CraftMarginProps, CraftPaddingProps, CraftTextStyleProps } from '../../types/craft'
import Card from '../Card'
import { CraftRefBlock } from '../common'

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

export type CraftCardProps = {
  type: 'feature' | 'featureWithParagraph' | 'referrer' | 'referrerReverse'
  imageType: 'none' | 'image'
  imageUrl: string
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

const CraftCard: UserComponent<CraftCardProps> = ({
  type,
  imageType,
  imageUrl,
  imageMargin,
  imagePadding,
  cardMargin,
  cardPadding,
  variant,
  outlineColor,
  backgroundType,
  solidColor,
  backgroundImageUrl,
  avatarType,
  avatarImageUrl,
  avatarName,
  title,
  titleStyle,
  paragraph,
  paragraphStyle,
  flexDirection,
}) => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const {
    connectors: { connect, drag },
    selected,
    hovered,
  } = useNode(node => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
  }))

  return (
    <CraftRefBlock
      ref={ref => ref && connect(drag(ref))}
      style={{ width: '100%', padding: type === 'referrer' ? '10px' : undefined }}
      events={{ hovered, selected }}
      options={{ enabled }}
    >
      <Card
        customStyle={{
          direction: flexDirection || 'column',
          bordered: variant !== 'none',
          borderColor: outlineColor,
          shadow: variant !== 'none',
          backgroundColor: backgroundType === 'solidColor' ? solidColor : undefined,
          backgroundImage: backgroundType === 'backgroundImage' ? backgroundImageUrl : undefined,
          ...cardMargin,
          ...cardPadding,
          ...(type === 'referrer' && variant === 'backgroundColor' && backgroundType === 'solidColor'
            ? { borderBottomLeftRadius: '0' }
            : {}),
          ...(type === 'referrer' ? { dropShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' } : {}),
        }}
      >
        {type === 'referrerReverse' && (
          <Card.Avatar
            direction="column"
            src={avatarImageUrl}
            name={avatarName}
            withAvatarImage={avatarType === 'image'}
            withName={!!avatarName}
          />
        )}
        <Card.Image
          src={imageType === 'image' ? imageUrl : undefined}
          customStyle={{
            ...imageMargin,
            ...imagePadding,
          }}
        />
        <Card.Title
          customStyle={{
            fontSize: titleStyle.fontSize || 14,
            textAlign: titleStyle.textAlign || 'center',
            fontWeight: titleStyle.fontWeight || 'normal',
            color: titleStyle.color || '#585858',
            ...(titleStyle?.margin || {}),
          }}
        >
          {title}
        </Card.Title>
        <Card.Content
          customStyle={{
            fontSize: paragraphStyle?.fontSize || 14,
            textAlign: paragraphStyle?.textAlign || 'center',
            fontWeight: paragraphStyle?.fontWeight || 'normal',
            color: paragraphStyle?.color || '#585858',
            lineHeight: paragraphStyle?.lineHeight || 1.5,
            ...(paragraphStyle?.margin || {}),
          }}
        >
          {paragraph}
        </Card.Content>
        {type === 'referrer' && variant === 'backgroundColor' && backgroundType === 'solidColor' && <StyledTriangle />}
      </Card>
      {type === 'referrer' && (
        <Card.Avatar
          src={avatarImageUrl}
          name={avatarName}
          withAvatarImage={avatarType === 'image'}
          withName={!!avatarName}
        />
      )}
    </CraftRefBlock>
  )
}

export default CraftCard
