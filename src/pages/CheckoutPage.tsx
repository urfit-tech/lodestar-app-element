import { Button } from '@chakra-ui/button'
import React from 'react'
import CheckoutProductModal from '../components/modals/CheckoutProductModal'

const CheckoutPage = () => {
  return (
    <div>
      <CheckoutProductModal
        renderTrigger={({ onOpen, disable, isLoginAlert }) => (
          <Button
            colorScheme="primary"
            disabled={disable}
            onClick={() => {
              if (isLoginAlert) return window.alert('請先登入')
              onOpen?.()
            }}
          >
            Free auto subscription
          </Button>
        )}
        defaultProductId={`ProgramPlan_e231abd7-25fa-4007-868b-6ff1901a0cee`}
      />

      <CheckoutProductModal
        renderTrigger={({ onOpen, disable, isLoginAlert }) => (
          <Button
            colorScheme="primary"
            disabled={disable}
            onClick={() => {
              if (isLoginAlert) return window.alert('請先登入')
              onOpen?.()
            }}
          >
            CheckoutProductModal
          </Button>
        )}
        defaultProductId={`ProjectPlan_ddc70edd-3140-4463-a2ae-7ecf77984b06`}
      />
      <CheckoutProductModal
        renderTrigger={({ onOpen, disable, isLoginAlert }) => (
          <Button
            colorScheme="primary"
            disabled={disable}
            onClick={() => {
              if (isLoginAlert) return window.alert('請先登入')
              onOpen?.()
            }}
          >
            CheckoutProductModal
          </Button>
        )}
        defaultProductId={`ProgramPlan_428d84bd-116f-4c8b-bc92-6d0560923cb9`}
      />
      <CheckoutProductModal
        renderTrigger={({ onOpen, disable, isLoginAlert }) => (
          <Button
            colorScheme="primary"
            disabled={disable}
            onClick={() => {
              if (isLoginAlert) return window.alert('請先登入')
              onOpen?.()
            }}
          >
            CheckoutProductModal
          </Button>
        )}
        defaultProductId={`ActivityTicket_f317da80-f4b8-4ae7-b7b8-06bd90547875`}
      />
    </div>
  )
}

export default CheckoutPage
