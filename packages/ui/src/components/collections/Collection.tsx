import { repeat } from 'ramda'
import { useIntl } from 'react-intl'
import { useApp } from '../../contexts/AppContext'
import { ResourceType, useResourceCollection } from '../../hooks/resource'
import { useTracking } from '../../hooks/tracking'
import { ElementComponent, ElementProps } from '../../types/element'
import Tracking from '../common/Tracking'
import collectionsMessages from './translation'

export type CollectionLayout = {
  gutter?: number
  gap?: number
  columns?: number
}

export type ContextCollection<D> = React.FC<{
  children: (context: { loading?: boolean; errors?: Error[]; data?: Array<D> }) => React.ReactElement
}>

// FIXME: type naming is bad
const Collection = <P extends object>(
  name: string,
  type: ResourceType,
  ElementComponent: ElementComponent<P>,
  emptyText?: string,
) => {
  const tracking = useTracking()
  const { formatMessage } = useIntl()
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
    const { resourceCollection } = useResourceCollection(props.data?.map(d => `${appId}:${type}:${d.id}`) || [], true)
    const loadingProps = { loading: true } as P
    const width = 100 / (props.layout?.columns || 2) + '%'
    const padding = `${props.layout?.gap || 16}px ${props.layout?.gutter || 16}px`
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', margin: `0 ${-(props.layout?.gutter || 16)}px` }}>
        <Tracking.Impression collection={name} resources={resourceCollection} ignore={'CUSTOM'} />
        {props.loading ? (
          repeat(
            <div
              style={{
                width,
                padding,
              }}
            >
              <ElementComponent {...loadingProps} />
            </div>,
          )(4)
        ) : props.errors ? (
          <div
            style={{
              padding,
            }}
          >
            {formatMessage(collectionsMessages.Collection.error)}
          </div>
        ) : props.data && props.data.length ? (
          props.data.map((d, idx) => (
            <div
              key={idx}
              style={{
                width,
                padding,
              }}
            >
              {props.renderElement?.({
                data: d,
                ElementComponent,
                onClick: () => {
                  const resource = resourceCollection[idx]
                  resource && tracking.click(resource, { collection: name, position: idx + 1 })
                },
              })}
            </div>
          ))
        ) : props.data?.length === 0 ? (
          <div
            style={{
              padding,
              fontSize: '14px',
              color: 'var(--gray-dark)',
            }}
          >
            {emptyText || formatMessage(collectionsMessages.Collection.empty)}
          </div>
        ) : null}
      </div>
    )
  }
  return WrappedComponent
}

export default Collection
