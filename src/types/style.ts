export type BackgroundProps =
  | { backgroundColor?: never; backgroundImage?: never }
  | { backgroundColor: string; backgroundImage?: never }
  | { backgroundColor?: never; backgroundImage: string }

export type MarginProps = {
  mt: string | number
  mb: string | number
  mr: string | number
  ml: string | number
}

export type PaddingProps = {
  pt: string | number
  pb: string | number
  pr: string | number
  pl: string | number
}

export type ParagraphProps = {
  textAlign: 'left' | 'center' | 'right'
  fontSize: string | number
  fontWeight: 'lighter' | 'normal' | 'bold'
  lineHeight: string | number
  borderWidth: string | number
  color: string
}

export type TitleProps = Omit<ParagraphProps, 'lineHeight'>

export type ButtonProps = {
  size: 'sm' | 'md' | 'lg'
  block: boolean
  variant?: 'text' | 'solid' | 'outline'
  colorScheme?: string
}

export type ImageProps = {
  borderWidth?: string | number
} & MarginProps

export type CardProps = {
  bordered?: boolean
  shadow?: boolean
} & MarginProps &
  PaddingProps
