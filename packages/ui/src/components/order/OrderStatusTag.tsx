import { Tag } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import orderMessages from './translation'

const OrderStatusTag: React.FC<{
  status: string
}> = ({ status }) => {
  const { formatMessage } = useIntl()

  switch (status) {
    case 'UNPAID':
      return <Tag color="#ffbe1e">{formatMessage(orderMessages.status.orderUnpaid)}</Tag>
    case 'EXPIRED':
      return <Tag color="#ec9e8f">{formatMessage(orderMessages.status.orderExpired)}</Tag>
    case 'PARTIAL_PAID':
      return <Tag color="#8fd5b5">{formatMessage(orderMessages.status.orderPartialPaid)}</Tag>
    case 'SUCCESS':
      return <Tag color="#4ed1b3">{formatMessage(orderMessages.status.orderSuccess)}</Tag>
    case 'PARTIAL_REFUND':
      return <Tag color="#cdcdcd">{formatMessage(orderMessages.status.orderPartialRefund)}</Tag>
    case 'REFUND':
      return <Tag color="#9b9b9b">{formatMessage(orderMessages.status.orderRefund)}</Tag>
    case 'DELETED':
      return <Tag color="#72a7c1">{formatMessage(orderMessages.status.orderDeleted)}</Tag>
    case 'PAYING':
      return <Tag color="#ffbe1e">{formatMessage(orderMessages.status.orderPaying)}</Tag>
    case 'REFUNDING':
      return <Tag color="#cdcdcd">{formatMessage(orderMessages.status.orderRefunding)}</Tag>
    case 'PARTIAL_EXPIRED':
      return <Tag color="#cdcdcd">{formatMessage(orderMessages.status.orderPartialExpired)}</Tag>
    case 'UNKNOWN':
      return <Tag color="#cdcdcd">{formatMessage(orderMessages.status.unknown)}</Tag>
    default:
      return <Tag color="#ff7d62">{formatMessage(orderMessages.status.orderFailed)}</Tag>
  }
}

export default OrderStatusTag
