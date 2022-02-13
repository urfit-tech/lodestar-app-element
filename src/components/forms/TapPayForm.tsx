import { Form } from 'antd'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { checkoutMessages } from '../../helpers/translation'
import { useTappay } from '../../hooks/util'

export type TPCreditCard = {
  cardType: 'mastercard' | 'visa' | 'jcb' | 'amex' | 'unionpay' | 'unknown'
  canGetPrime: boolean
  hasError: boolean
  status: {
    number: 0 | 1 | 2 | 3
    expiry: number
    ccv: number
  }
}

export const StyledInputTarget = styled.div<{ loading?: boolean }>`
  padding: 0 12px;
  height: 44px;
  width: 100%;
  border-radius: 4px;
  border: solid 1px #cdcdcd;
`

const TapPayForm: React.VFC<{
  onUpdate?: (tpCreditCard: TPCreditCard) => void
}> = ({ onUpdate }) => {
  const { formatMessage } = useIntl()
  const cardNoRef = useRef<HTMLDivElement | null>(null)
  const cardExpRef = useRef<HTMLDivElement | null>(null)

  const tpCreditCard = useTPCreditCard({ cardNoElement: cardNoRef, cardExpElement: cardExpRef })

  useEffect(() => {
    if (tpCreditCard) {
      onUpdate?.(tpCreditCard)
    }
  }, [tpCreditCard, onUpdate])

  return (
    <Form className="d-block mb-5">
      <Form.Item className="mb-1" label={formatMessage(checkoutMessages.form.label.cardNo)} required>
        <StyledInputTarget ref={cardNoRef} />
      </Form.Item>
      <Form.Item className="mb-1" label={formatMessage(checkoutMessages.form.label.cardExp)} required>
        <StyledInputTarget ref={cardExpRef} />
      </Form.Item>
    </Form>
  )
}

const useTPCreditCard = (options: {
  cardNoElement: MutableRefObject<HTMLDivElement | null>
  cardExpElement: MutableRefObject<HTMLDivElement | null>
}) => {
  const { TPDirect } = useTappay()
  const { cardNoElement, cardExpElement } = options
  const [tpCreditCard, setCreditCard] = useState<TPCreditCard>()
  const readySetup = Boolean(TPDirect && cardNoElement && cardExpElement)
  useEffect(() => {
    if (readySetup) {
      TPDirect.card.setup({
        fields: {
          number: {
            element: cardNoElement.current,
            placeholder: '**** **** **** ****',
          },
          expirationDate: {
            element: cardExpElement.current,
            placeholder: 'MM / YY',
          },
        },
      })
      TPDirect.card.onUpdate(setCreditCard)
    }
  }, [readySetup, TPDirect, cardNoElement, cardExpElement])

  useEffect(() => {
    if (!tpCreditCard) {
      return
    }
    // tpCreditCard.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (tpCreditCard.canGetPrime) {
      // Enable submit Button to get prime.
      // submitButton.removeAttribute('disabled')
    } else {
      // Disable submit Button to get prime.
      // submitButton.setAttribute('disabled', true)
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
    if (tpCreditCard.cardType === 'visa') {
      // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (tpCreditCard.status.number === 2) {
      // setNumberFormGroupToError()
    } else if (tpCreditCard.status.number === 0) {
      // setNumberFormGroupToSuccess()
    } else {
      // setNumberFormGroupToNormal()
    }

    if (tpCreditCard.status.expiry === 2) {
      // setNumberFormGroupToError()
    } else if (tpCreditCard.status.expiry === 0) {
      // setNumberFormGroupToSuccess()
    } else {
      // setNumberFormGroupToNormal()
    }

    if (tpCreditCard.status.ccv === 2) {
      // setNumberFormGroupToError()
    } else if (tpCreditCard.status.ccv === 0) {
      // setNumberFormGroupToSuccess()
    } else {
      // setNumberFormGroupToNormal()
    }
  }, [tpCreditCard])
  return tpCreditCard
}

export default React.memo(TapPayForm)
