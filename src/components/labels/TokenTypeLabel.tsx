import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { TokenType } from '../../types/token'

const messages = defineMessages({
  giftPlan: { id: 'common.giftPlan', defaultMessage: '贈品' },
  unknownType: { id: 'common.unknownType', defaultMessage: '未知' },
})

const TokenTypeLabel: React.VFC<{
  tokenType: TokenType
}> = ({ tokenType }) => {
  const { formatMessage } = useIntl()

  switch (tokenType) {
    case 'GiftPlan':
      return <>{formatMessage(messages.giftPlan)}</>
    default:
      return <>{formatMessage(messages.unknownType)}</>
  }
}

export default TokenTypeLabel
