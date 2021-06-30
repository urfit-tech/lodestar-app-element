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

export type BackgroundProps = (
  | { backgroundColor?: never; backgroundImage?: never; mode?: never }
  | { backgroundColor: string; backgroundImage?: never; mode?: never }
  | { backgroundColor?: never; backgroundImage: string; mode?: 'light' | 'dark' }
) &
  MarginProps &
  PaddingProps

export type ParagraphProps = {
  textAlign: 'left' | 'center' | 'right'
  fontSize: string | number
  fontWeight: 'lighter' | 'normal' | 'bold'
  lineHeight: string | number
  color: string
} & PaddingProps

export type TitleProps = Omit<ParagraphProps, 'lineHeight'>

export type ButtonProps = {
  size: 'sm' | 'md' | 'lg'
  variant?: 'text' | 'solid' | 'outline'
  block?: boolean
  colorScheme?: string
}

export type ImageProps = MarginProps & PaddingProps

export type CardProps = {
  bordered?: boolean
  shadow?: boolean
} & MarginProps &
  PaddingProps
