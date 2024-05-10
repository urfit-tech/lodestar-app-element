export type ProductSource<T, P> = { from: T } & P
export type ProductCustomSource = ProductSource<
  'custom',
  {
    idList?: string[]
    programStatus?: 'public' | 'private' | 'membership_card'
    membershipCardId?: string
  }
>
export type ProductPublishedAtSource<T = 'publishedAt'> = ProductSource<
  T,
  {
    limit?: number
    asc?: boolean
    defaultTagNames?: string[]
    defaultCategoryIds?: string[]
    programStatus?: 'public' | 'private' | 'membership_card'
    membershipCardId?: string
  }
>
export type ProductCurrentPriceSource = ProductSource<
  'currentPrice',
  {
    limit?: number
    asc?: boolean
    min?: number
    max?: number
    defaultTagNames?: string[]
    defaultCategoryIds?: string[]
    programStatus?: 'public' | 'private' | 'membership_card'
    membershipCardId?: string
  }
>
export type ProductRecentWatchedSource = ProductSource<
  'recentWatched',
  {
    watchedAt?: Date
    limit?: number
    asc?: boolean
    defaultTagNames?: string[]
    defaultCategoryIds?: string[]
    enrolledProgramIds?: string[]
    currentMemberId?: string
    programStatus?: 'public' | 'private' | 'membership_card'
    membershipCardId?: string
  }
>

export type ProductRoleSource = ProductSource<
  'role',
  {
    role?: 'app-owner' | 'content-creator' | 'general-member'
    limit?: number
    defaultTagNames?: string[]
    defaultCategoryIds?: string[]
  }
>

export type ProductOpenLinkSource = ProductSource<
  'openLink',
  {
    link?: string
    openNewTab?: boolean
  }
>
export type ProductPurchaseProductSource = ProductSource<
  'purchaseProduct',
  {
    productId?: string
  }
>
