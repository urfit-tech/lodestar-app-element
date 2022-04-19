import { equals } from 'ramda'
import React, { useEffect } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'
import { Resource } from '../../hooks/resource'
import { useTracking } from '../../hooks/tracking'

const Impression: React.FC<{
  resources: (Resource | null)[]
  collection?: string
  ignore?: 'EEC' | 'CUSTOM'
}> = React.memo(({ resources, collection, ignore }) => {
  const tracking = useTracking()
  const [utmSource] = useQueryParam('utm_source', StringParam)
  useEffect(() => {
    tracking.impress(resources, { collection, ignore, utmSource: utmSource || '' })
  }, [collection, resources, tracking])
  return <></>
}, equals)

const Detail: React.FC<{ resource: Resource; ignore?: 'EEC' | 'CUSTOM' }> = React.memo(({ resource, ignore }) => {
  const [pageFrom] = useQueryParam('pageFrom', StringParam)
  const [utmSource] = useQueryParam('utm_source', StringParam)
  const tracking = useTracking()
  useEffect(() => {
    tracking.detail(resource, { collection: pageFrom || undefined, ignore, utmSource: utmSource || '' })
  }, [pageFrom, utmSource, resource, tracking, ignore])
  return <></>
}, equals)

const Checkout: React.FC<{
  resources: Resource[]
  onCheckout?: () => void
  ignore?: 'EEC' | 'CUSTOM'
}> = React.memo(({ resources, onCheckout, ignore }) => {
  const tracking = useTracking()
  const [utmSource] = useQueryParam('utm_source', StringParam)
  useEffect(() => {
    tracking.checkout(resources, { ignore, utmSource: utmSource || '' })
    onCheckout?.()
  }, [onCheckout, resources, tracking, ignore])
  return <></>
}, equals)

const Purchase: React.FC<{
  orderId: string
  products: (Resource & { quantity: number })[]
  discounts: { name: string; price: number }[]
  ignore?: 'EEC' | 'CUSTOM'
  onTracked?: () => void
}> = React.memo(({ orderId, products, discounts, ignore, onTracked }) => {
  const tracking = useTracking()
  const [utmSource] = useQueryParam('utm_source', StringParam)
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
