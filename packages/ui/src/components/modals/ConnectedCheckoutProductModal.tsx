import React from 'react'
import { useAuth } from '@lodestar/contexts/AuthContext'
import {
  useMemberCoinsRemaining,
  useMemberCreditCards,
  usePaymentGatewayMethod,
} from '@lodestar/data-hasura/hooks/checkoutFlow'
import CheckoutProductModal, { CheckoutProductModalProps } from './CheckoutProductModal'

export type ConnectedCheckoutProductModalProps = Omit<
  CheckoutProductModalProps,
  'memberCreditCards' | 'remainingCoins' | 'paymentOptions'
>

const ConnectedCheckoutProductModal: React.FC<ConnectedCheckoutProductModalProps> = (props) => {
  const { currentMemberId } = useAuth()
  const { memberCreditCards } = useMemberCreditCards(currentMemberId || '')
  const { remainingCoins } = useMemberCoinsRemaining(currentMemberId || '')
  const { paymentOptions } = usePaymentGatewayMethod()

  return (
    <CheckoutProductModal
      {...props}
      memberCreditCards={memberCreditCards}
      remainingCoins={remainingCoins}
      paymentOptions={paymentOptions}
    />
  )
}

export default ConnectedCheckoutProductModal
