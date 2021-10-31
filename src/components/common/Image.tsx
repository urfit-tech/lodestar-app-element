import styled, { css } from 'styled-components'
import { ElementComponent } from '../../types/element'

export type ImageProps = {
  width?: number
  height?: number
  ratio?: number
  shape?: 'circle' | 'rounded' | 'square'
}

export const StyledImage = styled.div<ImageProps>`
  background-size: cover;
  background-position: center;
  ${props => {
    const width = props.width ? props.width + 'px' : '100%'
    const ratio = props.ratio || 3 / 4
    return css`
      width: ${width};
      padding-top: ${props.height ? props.height + 'px' : `calc(${width} * ${ratio})`};
    `
  }}
  background-size: cover;
  background-position: center;
  ${props =>
    props.shape === 'rounded' ? 'border-radius: 4px;' : props.shape === 'circle' ? 'border-radius: 50%;' : undefined};
`

const Image: ElementComponent<ImageProps> = props => {
  if (props.loading || props.errors) {
    return null
  }
  return <StyledImage {...props} />
}

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

export default Image
