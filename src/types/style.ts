export type MarginProps = {
  m?: string | number
  mt?: string | number
  mb?: string | number
  mr?: string | number
  ml?: string | number
}

export type PaddingProps = {
  p?: string | number
  pt?: string | number
  pb?: string | number
  pr?: string | number
  pl?: string | number
}

export type BorderProps = {
  border?: string
  borderRadius?: string
  borderStyle?: string
  borderWidth?: string
  borderColor?: string
  borderTopStyle?: string
  borderTopColor?: string
  borderTopWidth?: string | number
  borderBottomStyle?: string
  borderBottomColor?: string
  borderBottomWidth?: string | number
  borderLeftStyle?: string
  borderLeftColor?: string
  borderLeftWidth?: string | number
  borderRightStyle?: string
  borderRightColor?: string
  borderRightWidth?: string | number
  borderTopLeftRadius?: string
  borderTopRightRadius?: string
  borderBottomRightRadius?: string
  borderBottomLeftRadius?: string
}

export type BackgroundProps = {
  backgroundColor?: string
  backgroundImage?: string
  mode?: 'light' | 'dark'
} & MarginProps &
  PaddingProps

export type LayoutProps = {
  type?: 'flex' | 'grid'
  mobile?: {
    margin?: MarginProps
    columnAmount?: number
    columnRatio?: number[]
    displayAmount?: number
    alignItems?: 'start' | 'center' | 'end'
    justifyContent?: 'start' | 'center' | 'end'
  }
  desktop?: {
    margin?: MarginProps
    columnAmount?: number
    columnRatio?: number[]
    displayAmount?: number
    alignItems?: 'start' | 'center' | 'end'
    justifyContent?: 'start' | 'center' | 'end'
  }
}

export type CarouselProps = {
  mobile?: { margin?: MarginProps }
  desktop?: { margin?: MarginProps }
}

export type ParagraphProps = {
  textAlign: 'left' | 'center' | 'right'
  fontSize: string | number
  fontWeight: 'lighter' | 'normal' | 'bold'
  lineHeight: string | number
  color: string
  letterSpacing?: string | number
} & MarginProps &
  PaddingProps &
  BorderProps

export type TitleProps = Omit<ParagraphProps, 'lineHeight'>

export type ButtonProps = {
  size: 'sm' | 'md' | 'lg'
  variant?: 'text' | 'solid' | 'outline'
  block?: boolean
  colorScheme?: string
  backgroundColor?: string
  color?: string
  outlineColor?: string
  link?: string
  openNewTab?: boolean
}

export type ImageProps = {
  width?: string
  height?: string
  objectFit?: 'cover' | 'contain' | 'fill'
  alignSelf?: 'flex-start' | 'flex-end' | 'center'
} & MarginProps &
  PaddingProps

export type CardProps = {
  bordered?: boolean
  backgroundColor?: string
  backgroundImage?: string
  shadow?: boolean
  dropShadow?: string
  overflow?: string
} & MarginProps &
  PaddingProps &
  BorderProps
