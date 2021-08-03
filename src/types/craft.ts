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

export type CraftLayoutProps = {
  padding: CraftPaddingProps
  columnAmount: number
  columnRatio: number[]
  displayAmount: number
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
  padding: CraftPaddingProps
  textAlign: 'left' | 'right' | 'center'
  fontWeight: 'lighter' | 'normal' | 'bold'
  color: string
}

export type CraftTitleProps = {
  titleContent: string
} & CraftTextStyleProps

export type CraftParagraphProps = {
  paragraphContent: string
} & CraftTextStyleProps

export type CraftButtonProps = {
  title: string
  link: string
  openNewTab: boolean
  size: 'sm' | 'md' | 'lg'
  block: boolean
  variant: 'text' | 'solid' | 'outline'
  color: string
}

export type CraftBoxModelProps = {
  padding?: CraftPaddingProps
  margin?: CraftMarginProps
}

export type CraftImageProps = {
  type?: 'empty' | 'image'
  coverUrl: string | null
}
