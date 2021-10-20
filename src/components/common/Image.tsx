import styled, { css } from 'styled-components'
import { generateCustomMarginStyle, generateCustomPaddingStyle } from '.'
import DefaultAvatar from '../../images/default-avatar.svg'
import { ImageProps } from '../../types/style'

type AvatarImageProps = {
  src?: string | null
  size?: string | number
  shape?: 'circle' | 'square'
  background?: string
}
export const AvatarImage = styled.div<AvatarImageProps>`
  ${props => {
    if (typeof props.size === 'number') {
      return `width: ${props.size}px; height: ${props.size}px;`
    }

    return `width: ${props.size || '2rem'}; height: ${props.size || '2rem'};`
  }}
  background-color: ${props => props.background || '#ccc'};
  background-image: url(${props => props.src || DefaultAvatar});
  background-size: cover;
  background-position: center;
  border-radius: ${props => (props.shape === 'square' ? '4px' : '50%')};
`

type CustomRatioImageProps = {
  width: string
  ratio: number
  src: string
  shape?: 'rounded' | 'circle'
  disabled?: boolean
}
export const CustomRatioImage = styled.div<CustomRatioImageProps>`
  padding-top: calc(${props => props.width} * ${props => props.ratio});
  width: ${props => props.width};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  ${props =>
    props.shape === 'rounded' ? 'border-radius: 4px;' : props.shape === 'circle' ? 'border-radius: 50%;' : ''};
  opacity: ${props => props.disabled && 0.4};
`

export const StyledImage = styled.img<{ customStyle?: ImageProps }>`
  width: fit-content;
  ${props =>
    props.customStyle &&
    css`
      width: ${props.customStyle.width};
      height: ${props.customStyle.height};
      object-fit: ${props.customStyle.objectFit};
      align-self: ${props.customStyle.alignSelf};
    `}

  && {
    ${generateCustomMarginStyle}
    ${generateCustomPaddingStyle}
  }
`
