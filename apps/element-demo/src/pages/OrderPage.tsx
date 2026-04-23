import React, { useState } from 'react'
import { useOrderDetail, useSharingCodes } from '@lodestar/data-hasura/hooks/orderDetail'
import OrderDetailDrawer from '@lodestar/ui/components/order/OrderDetailDrawer'

const OrderPage: React.FC = () => {
  const [draftOrderLogId, setDraftOrderLogId] = useState('')
  const [orderLogId, setOrderLogId] = useState<string | null>(null)

  const { data: orderDetail, loading: loadingOrderDetail } = useOrderDetail(orderLogId)
  const paths = orderDetail.orderProducts
    .map((p) => (p.options as { from?: string } | undefined)?.from)
    .filter((p): p is string => Boolean(p))
  const { data: sharingCodes, loading: loadingSharingCode } = useSharingCodes(paths)

  return (
    <div className="container p-4">
      <h3>Order Detail Drawer Preview</h3>
      <p>
        Paste a real <code>order_log.id</code> below and open the drawer. The drawer is closed when{' '}
        <code>orderLogId</code> is <code>null</code>.
      </p>
      <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
        <input
          type="text"
          value={draftOrderLogId}
          onChange={(e) => setDraftOrderLogId(e.target.value)}
          placeholder="order_log.id"
          style={{ flex: 1, padding: '0.4rem 0.6rem' }}
        />
        <button type="button" onClick={() => setOrderLogId(draftOrderLogId.trim() || null)}>
          Open
        </button>
      </div>

      <OrderDetailDrawer
        orderLogId={orderLogId}
        onClose={() => setOrderLogId(null)}
        orderDetail={orderDetail}
        sharingCodes={sharingCodes}
        loadingOrderDetail={loadingOrderDetail}
        loadingSharingCode={loadingSharingCode}
      />
    </div>
  )
}

export default OrderPage
