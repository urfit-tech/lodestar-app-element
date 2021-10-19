import { ResponsiveValue, SimpleGrid } from '@chakra-ui/react'
import { repeat } from 'ramda'
import { createElement } from 'react'

export type CollectionLayout = {
  gutter?: ResponsiveValue<number>
  gap?: ResponsiveValue<number>
  columns?: ResponsiveValue<number>
}

type CollectionElementBaseProps = { loading: true } | { loading?: never; editing?: boolean }

export type CollectionBaseProps<T extends { source: string }, P extends CollectionElementBaseProps> = {
  element: React.ElementType<P>
  layout?: CollectionLayout
  options: T
}

const Collection =
  <P extends CollectionElementBaseProps>(Component: React.ElementType<P>) =>
  (options: { loading?: boolean; layout: CollectionLayout; propsList: P[] }) => {
    return (
      <SimpleGrid spacingX={options.layout.gutter} spacingY={options.layout.gap} columns={options.layout.columns}>
        {options.loading
          ? repeat(createElement(Component, { loading: true } as P))(4)
          : options.propsList.map(props => createElement(Component, props))}
      </SimpleGrid>
    )
  }

export default Collection
