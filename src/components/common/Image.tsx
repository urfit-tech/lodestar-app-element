import styled, { CSSObject } from 'styled-components'
import { ElementComponent } from '../../types/element'

export type ImageProps = {
  width?: string | number
  height?: string | number
  ratio?: number
  shape?: 'circle' | 'rounded' | 'square'
  isAutoHeight?: boolean
  widthAspect?: number
  heightAspect?: number
  ariaLabel?: string
}

export const extractNumber = (string?: string) => (string?.match(/\d+/g)?.[0] ? Number(string.match(/\d+/g)?.[0]) : 0)

export const StyledImage = styled.div<ImageProps>`
  background-size: cover;
  background-position: center;
  width: ${props => (typeof props.width === 'number' ? props.width + 'px' : props.width) || '100%'};
  height: ${props => (typeof props.height === 'number' ? props.height + 'px' : props.height) || '100%'};
  ${props =>
    props.shape === 'rounded' ? 'border-radius: 4px;' : props.shape === 'circle' ? 'border-radius: 50%;' : undefined};
`

const Image: ElementComponent<ImageProps & { customStyle?: CSSObject }> = props => {
  if (props.loading || props.errors) {
    return null
  }
  return (
    <StyledImage
      {...props}
      aria-label={props.ariaLabel}
      role={'img'}
      width={props.customStyle?.width || props.width}
      height={props.customStyle?.height || props.height}
    />
  )
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
