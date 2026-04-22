import { Button, Input, Spinner } from '@chakra-ui/react'
import axios from 'axios'
import { sum } from 'ramda'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useAuth } from '@lodestar/contexts/AuthContext'
import { handleError } from '@lodestar/helpers'
import { checkoutMessages, commonMessages } from '@lodestar/helpers/translation'
import { useCouponCollection } from '@lodestar/data-hasura/hooks/coupon'
import { useToastMessage } from '@lodestar/hooks/util'
import { CouponProps, OrderDiscountProps, OrderProductProps } from '@lodestar/types/checkout'
import CouponCard from '../cards/CouponCard'
import Divider from '../common/Divider'
import CommonModal from './CommonModal'

const StyledInputWrapper = styled.div`
  && {
    input:focus {
      box-shadow: none;
    }
  }
`

// Chakra v1 components expose a polymorphic style-prop union that exceeds
// TypeScript's representation limit (TS2590) when combined with the other
// heavy types this file pulls in. Re-bind the components with narrower
// props so call sites don't trigger the union blow-up.
const LoadingSpinner: React.ComponentType = Spinner
type SubmitButtonProps = {
  colorScheme?: string
  isFullWidth?: boolean
  style?: React.CSSProperties
  isLoading?: boolean
  onClick?: () => void
  children?: React.ReactNode
}
const SubmitButton: React.ComponentType<SubmitButtonProps> = Button
type TextInputProps = {
  variant?: string
  style?: React.CSSProperties
  placeholder?: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}
const TextInput: React.ComponentType<TextInputProps> = Input

const CouponSelectionModal: React.FC<{
  memberId: string
  orderProducts: OrderProductProps[]
  orderDiscounts: OrderDiscountProps[]
  renderTrigger: (params: { onOpen: () => void; selectedCoupon?: CouponProps }) => React.ReactElement
  onSelect?: (coupon: CouponProps) => void
}> = ({ memberId, orderProducts, orderDiscounts, onSelect, renderTrigger }) => {
  const { formatMessage } = useIntl()
  const { authToken } = useAuth()
  const { loading: loadingCoupons, data: coupons, fetch: refetchCoupons } = useCouponCollection(memberId || '')

  const [code, setCode] = useState('')
  const [visible, setVisible] = useState(false)
  const [inserting, setInserting] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<CouponProps>()
  const toastMessage = useToastMessage()

  const handleCouponInsert = () => {
    setInserting(true)
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_ROOT}/payment/exchange`,
        {
          code: code.trim(),
          type: 'Coupon',
        },
        {
          headers: { authorization: `Bearer ${authToken}` },
        },
      )
      .then(({ data }) => {
        if (data.code === 'SUCCESS') {
          refetchCoupons()
          setCode('')
          toastMessage({ responseCode: data.code })
        } else {
          toastMessage({ responseCode: data.code, status: 'error' })
        }
      })
      .catch(handleError)
      .finally(() => setInserting(false))
  }

  const couponList: React.ReactNode = coupons
    .filter(coupon => !coupon.status.outdated && !coupon.status.used)
    .map(coupon => {
      const couponPlanScope = coupon.couponCode.couponPlan.scope
      const couponPlanProductIds = coupon.couponCode.couponPlan.productIds || []
      const isInCouponScope = (productId: string) => {
        const [productType] = productId.split('_')
        return (
          couponPlanScope === null ||
          couponPlanScope.includes(productType) ||
          couponPlanProductIds.includes(productId)
        )
      }

      const filteredOrderProducts = orderProducts.filter(orderProduct =>
        isInCouponScope(orderProduct.productId),
      )
      const filteredOrderDiscounts = orderDiscounts.filter(orderDiscount => orderDiscount.type === 'DownPrice')
      const price =
        sum(filteredOrderProducts.map(orderProduct => orderProduct.price)) -
        sum(filteredOrderDiscounts.map(orderDiscount => orderDiscount.price))

      const isDisabled = filteredOrderProducts.length === 0 || coupon.couponCode.couponPlan.constraint > price
      return (
        <CouponCard
          key={coupon.id}
          coupon={coupon}
          onClick={() => {
            if (isDisabled) {
              return
            }
            onSelect && onSelect(coupon)
            setSelectedCoupon(coupon)
            setVisible(false)
          }}
          isDisabled={isDisabled}
        />
      )
    })

  return (
    <>
      {renderTrigger({ onOpen: () => setVisible(true), selectedCoupon })}
      <CommonModal
        title={formatMessage(checkoutMessages.title.chooseCoupon)}
        onClose={() => setVisible(false)}
        isOpen={visible}
      >
        {loadingCoupons && <LoadingSpinner />}
        {!loadingCoupons && couponList}

        <Divider>{formatMessage(commonMessages.label.or)}</Divider>

        <div className="d-flex">
          <StyledInputWrapper className="flex-grow-1">
            <TextInput
              variant="outline"
              style={{ borderRadius: '4px 0px 0px 4px' }}
              placeholder={formatMessage(checkoutMessages.placeholder.enterCouponCode)}
              value={code}
              onChange={e => setCode(e.target.value)}
            />
          </StyledInputWrapper>
          <SubmitButton
            colorScheme="primary"
            isFullWidth
            style={{ width: '72px', borderRadius: '0px 4px 4px 0px' }}
            isLoading={inserting}
            onClick={handleCouponInsert}
          >
            {formatMessage(commonMessages.button.add)}
          </SubmitButton>
        </div>
      </CommonModal>
    </>
  )
}

export default CouponSelectionModal
