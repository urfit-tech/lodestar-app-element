import { Button, Radio, RadioGroup, Stack } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useAuth } from '../../contexts/AuthContext'
import { AuthModalContext } from '../../contexts/AuthModalContext'
import { rgba } from '../../helpers'
import { checkoutMessages } from '../../helpers/translation'
import { useEnrolledMembershipCardIds } from '../../hooks/card'
import { CheckProps } from '../../types/checkout'
import CouponSelectionModal from '../modals/CouponSelectionModal'
import MembershipCardSelectionModal from '../modals/MembershipCardSelectionModal'

const StyledRadio = styled(Radio)`
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
    <RadioGroup
      value={discountType || 'None'}
      onChange={value => onChange?.(value === 'None' ? '' : `${value}`)}
      style={{ width: '100%' }}
    >
      <Stack>
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
                      <Button variant="outline" onClick={onOpen}>
                        {discountTarget
                          ? formatMessage(checkoutMessages.button.reselectCoupon)
                          : formatMessage(checkoutMessages.button.chooseCoupon)}
                      </Button>
                      {selectedCoupon && <span className="ml-3">{selectedCoupon.couponCode.couponPlan.title}</span>}
                    </>
                  )}
                />
              ) : (
                <Button onClick={() => setAuthModalVisible && setAuthModalVisible(true)}>
                  {formatMessage(checkoutMessages.button.chooseCoupon)}
                </Button>
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
                        <Button variant="outline" onClick={() => setVisible(true)}>
                          {discountTarget
                            ? formatMessage(checkoutMessages.button.reselectCoupon)
                            : formatMessage(checkoutMessages.title.chooseMemberCard)}
                        </Button>
                        {selectedMembershipCard && <span className="ml-3">{selectedMembershipCard.title}</span>}
                      </>
                    )}
                  />
                ) : null}
              </span>
            )}
          </StyledRadio>
        )}
      </Stack>
    </RadioGroup>
  )
}

export default DiscountSelectionCard
