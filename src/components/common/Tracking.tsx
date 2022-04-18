import { equals } from 'ramda'
import React, { useEffect } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'
import { Resource } from '../../hooks/resource'
import { useTracking } from '../../hooks/tracking'

const Impression: React.FC<{
  resources: (Resource | null)[]
  collection?: string
  ignore?: 'EEC' | 'CUSTOM'
  utmSource?: string
}> = React.memo(({ resources, collection, ignore, utmSource }) => {
  const tracking = useTracking()
  useEffect(() => {
    tracking.impress(resources, { collection, ignore, utmSource: utmSource || '' })
  }, [collection, resources, tracking])
  return <></>
}, equals)

const Detail: React.FC<{ resource: Resource; ignore?: 'EEC' | 'CUSTOM'; utmSource?: string }> = React.memo(
  ({ resource, ignore, utmSource }) => {
    const [pageFrom] = useQueryParam('pageFrom', StringParam)
    const tracking = useTracking()
    useEffect(() => {
      tracking.detail(resource, { collection: pageFrom || undefined, ignore, utmSource: utmSource || '' })
    }, [pageFrom, utmSource, resource, tracking, ignore])
    return <></>
  },
  equals,
)

const Checkout: React.FC<{
  resources: Resource[]
  onCheckout?: () => void
  ignore?: 'EEC' | 'CUSTOM'
  utmSource?: string
}> = React.memo(({ resources, onCheckout, ignore, utmSource }) => {
  const tracking = useTracking()
  useEffect(() => {
    tracking.checkout(resources, { ignore, utmSource: utmSource || '' })
    onCheckout?.()
  }, [onCheckout, utmSource, resources, tracking, ignore])
  return <></>
}, equals)

const Purchase: React.FC<{
  orderId: string
  products: (Resource & { quantity: number })[]
  discounts: { name: string; price: number }[]
  ignore?: 'EEC' | 'CUSTOM'
  onTracked?: () => void
  utmSource?: string
}> = React.memo(({ orderId, products, discounts, ignore, onTracked, utmSource }) => {
  const tracking = useTracking()
  useEffect(() => {
    tracking.purchase(orderId, products, discounts, { ignore, utmSource: utmSource || '' })
    onTracked?.()
  }, [discounts, utmSource, orderId, products, tracking, ignore])
  return <></>
}, equals)

const Tracking = {
  Detail,
  Impression,
  Checkout,
  Purchase,
}
export default Tracking
