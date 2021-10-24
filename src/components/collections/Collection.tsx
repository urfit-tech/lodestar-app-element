import { ResponsiveValue, SimpleGrid } from '@chakra-ui/react'
import { repeat } from 'ramda'
import { ElementComponent, ElementProps } from '../../types/element'

export type CollectionLayout = {
  gutter?: ResponsiveValue<number>
  gap?: ResponsiveValue<number>
  columns?: ResponsiveValue<number>
}

export type ContextCollection<D> = React.FC<{
  children: (context: { loading?: boolean; errors?: Error[]; data?: Array<D> }) => React.ReactElement
}>

const Collection =
  <P extends object>(ElementComponent: ElementComponent<P>) =>
  <D extends object>(
    props: ElementProps<{
      data?: Array<D>
      layout?: CollectionLayout
      renderElement?: (data: D, ElementComponent: ElementComponent<P>) => React.ReactElement<P>
    }>,
  ) => {
    const loadingProps = { loading: true } as P
    return (
      <SimpleGrid
        spacingX={props.layout?.gutter || 8}
        spacingY={props.layout?.gap || 8}
        columns={props.layout?.columns || [1, 2, 4]}
      >
        {props.loading ? (
          repeat(<ElementComponent {...loadingProps} />)(4)
        ) : props.errors ? (
          <div>Error</div>
        ) : props.data ? (
          props.data.map(d => props.renderElement?.(d, ElementComponent))
        ) : null}
      </SimpleGrid>
    )
  }

export default Collection
