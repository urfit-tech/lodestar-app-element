import { repeat } from 'ramda'
import { useApp } from '../../contexts/AppContext'
import { ResourceType, useResourceCollection } from '../../hooks/resource'
import { useTracking } from '../../hooks/tracking'
import { ElementComponent, ElementProps } from '../../types/element'
import BaseCarousel, { BaseCarouselProps } from '../common/BaseCarousel'
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
const CollectionCarousel = <P extends object>(
  name: string,
  type: ResourceType,
  ElementComponent: ElementComponent<P>,
) => {
  const tracking = useTracking()
  const { id: appId } = useApp()
  const WrappedComponent = <D extends { id: string }>(
    props: ElementProps<{
      data?: Array<D>
      layout?: CollectionLayout
      carouselProps?: BaseCarouselProps
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
      <div>
        <Tracking.Impression collection={name} resources={resourceCollection} />
        <BaseCarousel {...props.carouselProps}>
          {props.loading ? (
            repeat(
              <div
                style={{
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
                  padding: `${props.layout?.gap || 16}px ${props.layout?.gutter || 16}px`,
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
          ) : null}
        </BaseCarousel>
      </div>
    )
  }
  return WrappedComponent
}

export default CollectionCarousel
