import { ResponsiveValue, SimpleGrid } from '@chakra-ui/react'
import { repeat } from 'ramda'
import { createElement } from 'react'
import { ElementProps } from '../../types/element'

export type CollectionLayout = {
  gutter?: ResponsiveValue<number>
  gap?: ResponsiveValue<number>
  columns?: ResponsiveValue<number>
}

export type CollectionBaseProps<T extends { source: string }> = {
  layout?: CollectionLayout
  options: T
}

const Collection =
  <P extends object>(Component: React.ElementType<ElementProps<P>>) =>
  (options: { loading?: boolean; layout: CollectionLayout; propsList: P[] }) => {
    return (
      <SimpleGrid spacingX={options.layout.gutter} spacingY={options.layout.gap} columns={options.layout.columns}>
        {options.loading
          ? repeat(createElement<ElementProps<P>>(Component, { loading: true }))(4)
          : options.propsList.map(props => createElement<ElementProps<P>>(Component, props))}
      </SimpleGrid>
    )
  }

export default Collection
