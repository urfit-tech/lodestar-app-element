import { repeat } from 'ramda'
import { useApp } from '../../contexts/AppContext'
import { ResourceType, useResourceCollection } from '../../hooks/resource'
import { useTracking } from '../../hooks/tracking'
import { ElementComponent, ElementProps } from '../../types/element'
import Tracking from '../common/Tracking'

export type CollectionLayout = {
  gutter?: number
  gap?: number
  columns?: number
}

export type ContextCollection<D> = React.FC<{
  children: (context: { loading?: boolean; errors?: Error[]; data?: Array<D> }) => React.ReactElement
}>

// FIXME: type naming is bad
const Collection = <P extends object>(name: string, type: ResourceType, ElementComponent: ElementComponent<P>) => {
  const tracking = useTracking()
  const { id: appId } = useApp()
  const WrappedComponent = <D extends { id: string }>(
    props: ElementProps<{
      data?: Array<D>
      layout?: CollectionLayout
      renderElement?: (options: {
        data: D
        ElementComponent: ElementComponent<P>
        onClick?: () => void
      }) => React.ReactElement<P>
    }>,
  ) => {
    const { resourceCollection } = useResourceCollection(props.data?.map(d => `${appId}:${type}:${d.id}`) || [])
    const loadingProps = { loading: true } as P
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', margin: `0 ${-(props.layout?.gutter || 16)}px` }}>
        <Tracking.Impression collection={name} resources={resourceCollection} />
        {props.loading ? (
          repeat(
            <div
              style={{
                width: 100 / (props.layout?.columns || 2) + '%',
                padding: `${props.layout?.gap || 16}px ${props.layout?.gutter || 16}px`,
              }}
            >
              <ElementComponent {...loadingProps} />
            </div>,
          )(4)
        ) : props.errors ? (
          <div>Error</div>
        ) : props.data ? (
          props.data.map((d, idx) => (
            <div
              key={idx}
              style={{
                width: 100 / (props.layout?.columns || 2) + '%',
                padding: `${props.layout?.gap || 16}px ${props.layout?.gutter || 16}px`,
              }}
            >
              {props.renderElement?.({
                data: d,
                ElementComponent,
                onClick: () => {
                  const resource = resourceCollection[idx]
                  resource && tracking.click(resource, { position: idx + 1 })
                },
              })}
            </div>
          ))
        ) : null}
      </div>
    )
  }
  return WrappedComponent
}

export default Collection
