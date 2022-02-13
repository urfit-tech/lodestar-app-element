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
        defaultProductId={`ProgramPlan_551ec07a-03ec-4c5e-9541-cf141dab1f97`}
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
