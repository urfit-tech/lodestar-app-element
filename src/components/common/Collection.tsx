import { ResponsiveValue, SimpleGrid } from '@chakra-ui/react'
import { repeat } from 'ramda'
import { createElement } from 'react'

export type CollectionLayout = {
  gutter?: ResponsiveValue<number>
  gap?: ResponsiveValue<number>
  columns?: ResponsiveValue<number>
}

type CollectionElementType<P> = React.ElementType<{ loading: true } | (P & { loading?: never; editing?: boolean })>

export type CollectionBaseProps<T extends { source: string }, P> = {
  element: CollectionElementType<P>
  layout?: CollectionLayout
  options: T
}

const Collection =
  <P extends object>(Component: CollectionElementType<P>) =>
  (options: { loading?: boolean; layout: CollectionLayout; propsList: P[] }) => {
    return (
      <SimpleGrid spacingX={options.layout.gutter} spacingY={options.layout.gap} columns={options.layout.columns}>
        {options.loading
          ? repeat(createElement(Component, { loading: true }))(3)
          : options.propsList.map(props => createElement(Component, props))}
      </SimpleGrid>
    )
  }

export default Collection
