import { repeat } from 'ramda'
import { useEffect } from 'react'
import styled from 'styled-components'
import { TrackingInstance, useTracking } from '../../hooks/tracking'
import { ElementComponent, ElementProps } from '../../types/element'

export type CollectionLayout = {
  gutter?: number
  gap?: number
  columns?: number
}

export type ContextCollection<D> = React.FC<{
  children: (context: { loading?: boolean; errors?: Error[]; data?: Array<D> }) => React.ReactElement
}>

const StyledGrid = styled.div<CollectionLayout>`
  display: grid;
  grid-template-columns: ${props =>
    new Array(props.columns || 2)
      .fill(1)
      .map(() => `minmax(0, 1fr)`)
      .join(' ')};
  grid-gap: ${props => `${props.gap || 16}px ${props.gutter || 16}px`};
  place-items: center;
`

// FIXME: type naming is bad
const Collection = <P extends object>(type: TrackingInstance['type'], ElementComponent: ElementComponent<P>) => {
  const tracking = useTracking()
  const WrappedComponent = <D extends { id: string }>(
    props: ElementProps<{
      data?: Array<D>
      layout?: CollectionLayout
      renderElement?: (data: D, ElementComponent: ElementComponent<P>) => React.ReactElement<P>
    }>,
  ) => {
    const loadingProps = { loading: true } as P
    useEffect(() => {
      props.data && props.data?.length > 0 && tracking.impress(props.data.map(d => ({ type, id: d.id })))
    }, [props.data])
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', margin: `0 ${-(props.layout?.gutter || 16)}px` }}>
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
              onClick={() => tracking.click({ type, id: d.id }, { position: idx + 1 })}
              style={{
                width: 100 / (props.layout?.columns || 2) + '%',
                padding: `${props.layout?.gap || 16}px ${props.layout?.gutter || 16}px`,
              }}
            >
              {props.renderElement?.(d, ElementComponent)}
            </div>
          ))
        ) : null}
      </div>
    )
  }
  return WrappedComponent
}

export default Collection
