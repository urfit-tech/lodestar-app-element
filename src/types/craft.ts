export type CraftMarginProps = {
  m?: string
  mt?: string
  mr?: string
  mb?: string
  ml?: string
}

export type CraftPaddingProps = {
  p?: string
  pt?: string
  pr?: string
  pb?: string
  pl?: string
}

export type CraftBorderProps = {
  border?: string
  borderRadius?: string
  borderStyle?: string
  borderWidth?: string
  borderColor?: string
  borderTopStyle?: string
  borderTopColor?: string
  borderTopWidth?: string
  borderBottomStyle?: string
  borderBottomColor?: string
  borderBottomWidth?: string
  borderLeftStyle?: string
  borderLeftColor?: string
  borderLeftWidth?: string
  borderRightStyle?: string
  borderRightColor?: string
  borderRightWidth?: string
}

export type CraftLayoutProps = {
  margin?: CraftMarginProps
  padding?: CraftPaddingProps
  columnAmount: number
  columnRatio: number[]
  displayAmount: number
  alignItems?: 'start' | 'center' | 'end'
  justifyContent?: 'start' | 'center' | 'end'
}

export type CraftPageAdminProps = {
  id: string
  pageName: string
  path: string
  publishedAt: Date | null
}

export type CraftPageColumnProps = {
  id: string
  pageName: string
  url: string
  updateAt: Date
}

export type CraftTextStyleProps = {
  fontSize: number
  lineHeight?: number
  margin: CraftMarginProps
  textAlign: 'left' | 'right' | 'center'
  fontWeight: 'lighter' | 'normal' | 'bold'
  color: string
  border?: CraftBorderProps
  padding?: CraftPaddingProps
}

export type CraftTitleProps = {
  titleContent: string
} & CraftTextStyleProps

export type CraftParagraphProps = {
  paragraphContent: string
  letterSpacing?: string | number
} & CraftTextStyleProps

export type CraftButtonProps = {
  title: string
  link?: string
  openNewTab: boolean
  size: 'sm' | 'md' | 'lg'
  block: boolean
  variant: 'text' | 'solid' | 'outline'
  color: string
  align?: 'start' | 'end' | 'center'
  outlineColor?: string
  backgroundColor?: string
  backgroundType?: 'none' | 'solidColor'
}

export type CraftBoxModelProps = {
  padding?: CraftPaddingProps
  margin?: CraftMarginProps
}

export type CraftImageProps = {
  type?: 'empty' | 'image'
  width?: string
  height?: string
  coverUrl?: string
}
