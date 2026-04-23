import { Button } from '@chakra-ui/react'

const AnyButton = Button as any
import React from 'react'
import { useIntl } from 'react-intl'
import ConnectedCheckoutProductModal from '@lodestar/ui/components/modals/ConnectedCheckoutProductModal'
import pagesMessages from './translation'

const CheckoutPage = () => {
  const { formatMessage } = useIntl()
  return (
    <div>
      <ConnectedCheckoutProductModal
        renderTrigger={({ onOpen, disable, isLoginAlert }) => (
          <AnyButton
            colorScheme="primary"
            disabled={disable}
            onClick={() => {
              if (isLoginAlert) return window.alert(formatMessage(pagesMessages.CheckoutPage.pleaseLogin))
              onOpen?.()
            }}
          >
            {formatMessage(pagesMessages.CheckoutPage.freeAutoSubscription)}
          </AnyButton>
        )}
        defaultProductId={`ProgramPlan_e231abd7-25fa-4007-868b-6ff1901a0cee`}
      />

      <ConnectedCheckoutProductModal
        renderTrigger={({ onOpen, disable, isLoginAlert }) => (
          <AnyButton
            colorScheme="primary"
            disabled={disable}
            onClick={() => {
              if (isLoginAlert) return window.alert(formatMessage(pagesMessages.CheckoutPage.pleaseLogin))
              onOpen?.()
            }}
          >
            {formatMessage(pagesMessages.CheckoutPage.checkoutProductModal)}
          </AnyButton>
        )}
        defaultProductId={`ProjectPlan_ddc70edd-3140-4463-a2ae-7ecf77984b06`}
      />
      <ConnectedCheckoutProductModal
        renderTrigger={({ onOpen, disable, isLoginAlert }) => (
          <AnyButton
            colorScheme="primary"
            disabled={disable}
            onClick={() => {
              if (isLoginAlert) return window.alert(formatMessage(pagesMessages.CheckoutPage.pleaseLogin))
              onOpen?.()
            }}
          >
            {formatMessage(pagesMessages.CheckoutPage.checkoutProductModal)}
          </AnyButton>
        )}
        defaultProductId={`ProgramPlan_428d84bd-116f-4c8b-bc92-6d0560923cb9`}
      />
      <ConnectedCheckoutProductModal
        renderTrigger={({ onOpen, disable, isLoginAlert }) => (
          <AnyButton
            colorScheme="primary"
            disabled={disable}
            onClick={() => {
              if (isLoginAlert) return window.alert(formatMessage(pagesMessages.CheckoutPage.pleaseLogin))
              onOpen?.()
            }}
          >
            {formatMessage(pagesMessages.CheckoutPage.checkoutProductModal)}
          </AnyButton>
        )}
        defaultProductId={`ActivityTicket_f317da80-f4b8-4ae7-b7b8-06bd90547875`}
      />
    </div>
  )
}

export default CheckoutPage
