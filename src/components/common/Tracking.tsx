import { equals } from 'ramda'
import React, { useEffect } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'
import { Resource } from '../../hooks/resource'
import { useTracking } from '../../hooks/tracking'

const Impression: React.FC<{ resources: (Resource | null)[] }> = React.memo(({ resources }) => {
  const tracking = useTracking()
  useEffect(() => {
    tracking.impress(resources)
  }, [resources, tracking])
  return <></>
}, equals)

const Detail: React.FC<{ resource: Resource }> = React.memo(({ resource }) => {
  const tracking = useTracking()
  const [pageFrom] = useQueryParam('pageFrom', StringParam)
  useEffect(() => {
    tracking.detail(resource, { collection: pageFrom || undefined })
  }, [pageFrom, resource, tracking])
  return <></>
}, equals)

const Checkout: React.FC<{ resources: Resource[]; onCheckout?: () => void }> = React.memo(
  ({ resources, onCheckout }) => {
    const tracking = useTracking()
    useEffect(() => {
      tracking.checkout(resources)
      onCheckout?.()
    }, [onCheckout, resources, tracking])
    return <></>
  },
  equals,
)

const Purchase: React.FC<{ orderId: string; products: (Resource & { quantity: number })[]; discounts: Resource[] }> =
  React.memo(({ orderId, products, discounts }) => {
    const tracking = useTracking()
    useEffect(() => {
      tracking.purchase(orderId, { products, discounts })
    }, [discounts, orderId, products, tracking])
    return <></>
  }, equals)

const Tracking = {
  Detail,
  Impression,
  Checkout,
  Purchase,
}
export default Tracking
