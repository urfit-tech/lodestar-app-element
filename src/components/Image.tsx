import styled, { css } from 'styled-components'
import { ImageProps } from '../types/style'
import { generateCustomMarginStyle, generateCustomPaddingStyle } from './common'

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

const StyledImage = styled.img<{ customStyle?: ImageProps }>`
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

export default StyledImage
