import { ResponsiveValue, SimpleGrid } from '@chakra-ui/react'
import { repeat } from 'ramda'
import { createElement } from 'react'

export type CollectionLayout = {
  gutter?: ResponsiveValue<number>
  gap?: ResponsiveValue<number>
  columns?: ResponsiveValue<number>
}

export type CollectionElementProps<P> = { loading: true } | (P & { loading?: never; editing?: boolean })

export type CollectionBaseProps<T extends { source: string }> = {
  layout?: CollectionLayout
  options: T
}

const Collection =
  <P extends object>(Component: React.ElementType<CollectionElementProps<P>>) =>
  (options: { loading?: boolean; layout: CollectionLayout; propsList: P[] }) => {
    return (
      <SimpleGrid spacingX={options.layout.gutter} spacingY={options.layout.gap} columns={options.layout.columns}>
        {options.loading
          ? repeat(createElement(Component, { loading: true } as CollectionElementProps<P>))(4)
          : options.propsList.map(props => createElement(Component, props))}
      </SimpleGrid>
    )
  }

export default Collection
