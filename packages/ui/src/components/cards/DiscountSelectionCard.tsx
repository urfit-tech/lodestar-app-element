import { Button, Radio, RadioGroup, Stack } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useAuth } from '@lodestar/contexts/AuthContext'
import { AuthModalContext } from '@lodestar/contexts/AuthModalContext'
import { rgba } from '@lodestar/helpers'
import { checkoutMessages } from '@lodestar/helpers/translation'
import { useEnrolledMembershipCardIds } from '@lodestar/data-hasura/hooks/card'
import { CheckProps } from '@lodestar/types/checkout'
import CouponSelectionModal from '../modals/CouponSelectionModal'
import MembershipCardSelectionModal from '../modals/MembershipCardSelectionModal'

// Chakra v1's polymorphic component prop unions exceed TypeScript's
// representation limit (TS2590) inside the larger element-demo compilation
// unit. Re-bind the components with narrower prop shapes so call sites
// don't trigger the union blow-up.
type RadioGroupElProps = {
  value?: string
  onChange?: (value: string) => void
  style?: React.CSSProperties
  children: React.ReactNode
}
const RadioGroupEl: React.ComponentType<RadioGroupElProps> = RadioGroup
const StackEl: React.ComponentType<{ children: React.ReactNode }> = Stack
type DiscountButtonProps = {
  variant?: string
  onClick?: () => void
  children?: React.ReactNode
}
const DiscountButton: React.ComponentType<DiscountButtonProps> = Button

const StyledRadio = styled(Radio as React.ComponentType<{
  height?: string
  colorScheme?: string
  value?: string
  children?: React.ReactNode
}>)`
  &&:focus {
    box-shadow: 0 0 0 3px ${props => rgba(props.theme['@primary-color'], 0.6)};
  }
`

const DiscountSelectionCard: React.FC<{
  value?: string | null
  check?: CheckProps
  onChange?: (discountId: string) => void
}> = ({ value: discountId, check, onChange }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { enrolledMembershipCardIds } = useEnrolledMembershipCardIds(currentMemberId || '')

  const [discountType, discountTarget] = discountId?.split('_') || [null, null]
  return (
    <RadioGroupEl
      value={discountType || 'None'}
      onChange={value => onChange?.(value === 'None' ? '' : `${value}`)}
      style={{ width: '100%' }}
    >
      <StackEl>
        <StyledRadio height="3rem" colorScheme="primary" value="None">
          {formatMessage(checkoutMessages.label.noDiscount)}
        </StyledRadio>
        <div className="d-flex align-items-center">
          <StyledRadio height="3rem" colorScheme="primary" value="Coupon">
            <span>{formatMessage(checkoutMessages.label.useCoupon)}</span>
          </StyledRadio>
          {discountType === 'Coupon' && (
            <span className="ml-2">
              {currentMemberId ? (
                <CouponSelectionModal
                  memberId={currentMemberId}
                  orderProducts={check?.orderProducts || []}
                  orderDiscounts={check?.orderDiscounts || []}
                  onSelect={coupon => {
                    onChange?.(`Coupon_${coupon.id}`)
                  }}
                  renderTrigger={({ onOpen, selectedCoupon }) => (
                    <>
                      <DiscountButton variant="outline" onClick={onOpen}>
                        {discountTarget
                          ? formatMessage(checkoutMessages.button.reselectCoupon)
                          : formatMessage(checkoutMessages.button.chooseCoupon)}
                      </DiscountButton>
                      {selectedCoupon && <span className="ml-3">{selectedCoupon.couponCode.couponPlan.title}</span>}
                    </>
                  )}
                />
              ) : (
                <DiscountButton onClick={() => setAuthModalVisible && setAuthModalVisible(true)}>
                  {formatMessage(checkoutMessages.button.chooseCoupon)}
                </DiscountButton>
              )}
            </span>
          )}
        </div>
        {enrolledMembershipCardIds.length > 0 && (
          <StyledRadio height="3rem" value="Card" colorScheme="primary">
            <span>{formatMessage(checkoutMessages.label.useMemberCard)}</span>
            {discountType === 'Card' && (
              <span className="ml-2">
                {currentMemberId ? (
                  <MembershipCardSelectionModal
                    memberId={currentMemberId}
                    onSelect={membershipCardId => onChange?.(`Card_${membershipCardId}`)}
                    render={({ setVisible, selectedMembershipCard }: any) => (
                      <>
                        <DiscountButton variant="outline" onClick={() => setVisible(true)}>
                          {discountTarget
                            ? formatMessage(checkoutMessages.button.reselectCoupon)
                            : formatMessage(checkoutMessages.title.chooseMemberCard)}
                        </DiscountButton>
                        {selectedMembershipCard && <span className="ml-3">{selectedMembershipCard.title}</span>}
                      </>
                    )}
                  />
                ) : null}
              </span>
            )}
          </StyledRadio>
        )}
      </StackEl>
    </RadioGroupEl>
  )
}

export default DiscountSelectionCard
