import { ResponsiveValue, SimpleGrid } from '@chakra-ui/react'
import { repeat } from 'ramda'
import { createElement, useEffect, useMemo } from 'react'
import { PropsWithUiState } from '../../types/element'

export type CollectionLayout = {
  gutter?: ResponsiveValue<number>
  gap?: ResponsiveValue<number>
  columns?: ResponsiveValue<number>
}

type CollectionProps<D> = {
  editing?: boolean
  layout?: CollectionLayout
  transform?: (data: Array<D>) => Array<D>
  onLoad?: (data: Array<D>) => void
}
export type ElementCollection<D = unknown> = React.ElementType<CollectionProps<D>>

type CollectionOptions<P extends PropsWithUiState<unknown>, D> = {
  Element: React.ElementType<P>
} & (
  | { loading: true }
  | {
      loading?: never
      // TODO: use conditional type is better, ex. D extends P ? {} : {}
      data: Array<D>
      mapDataToProps: (data: D) => P
    }
)
const Collection = <P extends PropsWithUiState<unknown>, D>(options: CollectionOptions<P, D>) => {
  const Component: React.FC<CollectionProps<D>> = ({
    editing,
    layout = { columns: [1, 2, 4], gutter: 8, gap: 8 },
    transform,
    onLoad,
  }) => {
    const data = useMemo(() => (options.loading ? [] : transform?.(options.data) || options.data), [transform])
    useEffect(() => {
      onLoad?.(data)
    }, [data, onLoad])
    console.log({ editing })
    return (
      <SimpleGrid spacingX={layout.gutter} spacingY={layout.gap} columns={layout.columns}>
        {options.loading
          ? repeat(createElement(options.Element, { loading: true } as P))(4)
          : data.map(d => {
              return createElement(options.Element, { ...options.mapDataToProps(d), editing } as P)
            })}
      </SimpleGrid>
    )
  }
  return Component
}

export default Collection
