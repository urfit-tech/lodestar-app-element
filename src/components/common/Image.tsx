import styled, { CSSObject } from 'styled-components'
import { PropsWithCraft } from '../../components/common/Craftize'
import { ElementComponent } from '../../types/element'
import { DESKTOP_BREAK_POINT, TABLET_BREAK_POINT } from './Responsive'

export type ImageProps = {
  width?: string | number
  height?: string | number
  ratio?: number
  shape?: 'circle' | 'rounded' | 'square'
  isAutoHeight?: boolean
  widthAspect?: number
  heightAspect?: number
  ariaLabel?: string
} & Partial<PropsWithCraft<any>>

export const extractNumber = (string?: string) => (string?.match(/\d+/g)?.[0] ? Number(string.match(/\d+/g)?.[0]) : 0)

export const StyledImage = styled.div<ImageProps>`
  background-size: cover;
  background-position: center;
  ${props =>
    props.shape === 'rounded' ? 'border-radius: 4px;' : props.shape === 'circle' ? 'border-radius: 50%;' : undefined};
  @media (max-width: ${TABLET_BREAK_POINT - 1}px) {
    width: ${props => props?.responsive?.desktop?.customStyle?.width || props?.width || '100%'};
    padding-top: ${props => props?.responsive?.desktop?.customStyle?.height || props?.height || '100%'};
  }
  @media (min-width: ${TABLET_BREAK_POINT}px) {
    width: ${props => props?.responsive?.tablet?.customStyle?.width || props?.width || '100%'};
    padding-top: ${props => props?.responsive?.tablet?.customStyle?.height || props?.height || '100%'};
  }
  @media (min-width: ${DESKTOP_BREAK_POINT}px) {
    width: ${props => props?.responsive?.mobile?.customStyle?.width || props?.width || '100%'};
    padding-top: ${props => props?.responsive?.mobile?.customStyle?.height || props?.height || '100%'};
  }
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
