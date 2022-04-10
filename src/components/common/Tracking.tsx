import { equals } from 'ramda'
import React, { useEffect } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'
import { Resource } from '../../hooks/resource'
import { useTracking } from '../../hooks/tracking'

const Impression: React.FC<{ resources: (Resource | null)[]; collection?: string; ignore?: 'EEC' | 'CUSTOM' }> =
  React.memo(({ resources, collection, ignore }) => {
    const tracking = useTracking()
    useEffect(() => {
      tracking.impress(resources, { collection, ignore })
    }, [collection, resources, tracking])
    return <></>
  }, equals)

const Detail: React.FC<{ resource: Resource; ignore?: 'EEC' | 'CUSTOM' }> = React.memo(({ resource, ignore }) => {
  const tracking = useTracking()
  const [pageFrom] = useQueryParam('pageFrom', StringParam)
  useEffect(() => {
    tracking.detail(resource, { collection: pageFrom || undefined, ignore })
  }, [pageFrom, resource, tracking, ignore])
  return <></>
}, equals)

const Checkout: React.FC<{ resources: Resource[]; onCheckout?: () => void; ignore?: 'EEC' | 'CUSTOM' }> = React.memo(
  ({ resources, onCheckout, ignore }) => {
    const tracking = useTracking()
    useEffect(() => {
      tracking.checkout(resources, { ignore })
      onCheckout?.()
    }, [onCheckout, resources, tracking, ignore])
    return <></>
  },
  equals,
)

const Purchase: React.FC<{
  orderId: string
  products: (Resource & { quantity: number })[]
  discounts: { name: string; price: number }[]
  ignore?: 'EEC' | 'CUSTOM'
}> = React.memo(({ orderId, products, discounts, ignore }) => {
  const tracking = useTracking()
  useEffect(() => {
    tracking.purchase(orderId, products, discounts, { ignore })
  }, [discounts, orderId, products, tracking, ignore])
  return <></>
}, equals)

const Tracking = {
  Detail,
  Impression,
  Checkout,
  Purchase,
}
export default Tracking
