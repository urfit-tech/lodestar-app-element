export type SourceOptions<S, T> = { source: S } & T
export type CustomSourceOptions = SourceOptions<'custom', { idList: string[] }>
export type PublishedAtSourceOptions = SourceOptions<
  'publishedAt',
  {
    limit?: number
    asc?: boolean
    defaultTagNames?: string[]
    defaultCategoryIds?: string[]
  }
>
export type CurrentPriceSourceOptions = SourceOptions<
  'currentPrice',
  {
    limit?: number
    asc?: boolean
    min?: number
    max?: number
    defaultTagNames?: string[]
    defaultCategoryIds?: string[]
  }
>
export type RecentWatchedSourceOptions = SourceOptions<
  'recentWatched',
  {
    watchedAt?: Date
    limit?: number
  }
>
