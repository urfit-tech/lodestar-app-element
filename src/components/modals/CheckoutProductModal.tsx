import { Button, Divider, OrderedList, SkeletonText, useDisclosure } from '@chakra-ui/react'
import { camelCase } from 'lodash'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import DiscountSelectionCard from '../../components/cards/DiscountSelectionCard'
import { CommonTitleMixin } from '../../components/common'
import ProductItem from '../../components/common/ProductItem'
import PriceLabel from '../../components/labels/PriceLabel'
import CommonModal from '../../components/modals/CommonModal'
import GroupBuyingRuleModal from '../../components/modals/GroupBuyingRuleModal'
import PaymentSelector from '../../components/selectors/PaymentSelector'
import { useApp } from '../../contexts/AppContext'
import { useAuth } from '../../contexts/AuthContext'
import { checkoutMessages, commonMessages } from '../../helpers/translation'
import { useCheck } from '../../hooks/checkout'
import { useMemberValidation, useSimpleProduct } from '../../hooks/common'
import { useMember, useUpdateMemberMetadata } from '../../hooks/member'
import { InvoiceProps, PaymentProps, ShippingOptionIdType, ShippingProps } from '../../types/checkout'
import { ShippingMethodProps } from '../../types/merchandise'
import { BREAK_POINT } from '../common/Responsive'
import CheckoutGroupBuyingForm, { StyledBlockTitle, StyledListItem } from '../forms/CheckoutGroupBuyingForm'
import CheckoutProductReferrerInput from '../inputs/CheckoutProductReferrerInput'
import InvoiceInput, { validateInvoice } from '../inputs/InvoiceInput'
import ShippingInput, { validateShipping } from '../inputs/ShippingInput'

export const StyledTitle = styled.h1`
  ${CommonTitleMixin}
`
export const StyledSubTitle = styled.div`
  margin-bottom: 0.75rem;
  ${CommonTitleMixin}
`
export const StyledWarningText = styled.p`
  margin-top: 1.25rem;
  color: var(--gray-dark);
  font-size: 12px;
`
export const StyledCheckoutBlock = styled.div`
  color: var(--gray-darker);
  font-size: 14px;
  line-height: 1.71;
  letter-spacing: 0.4px;

  > div {
    margin-bottom: 0.75rem;

    > span:first-child {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`
export const StyledCheckoutPrice = styled.div`
  color: ${props => props.theme['@primary-color']};
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.2px;
  text-align: right;
`

const StyledSubmitBlock = styled.div`
  @media (max-width: ${BREAK_POINT}px) {
    padding-bottom: 7rem;
  }
`

const CheckoutProductItem: React.VFC<{ name: string; price: number; currencyId?: string }> = ({
  name,
  price,
  currencyId,
}) => {
  return (
    <div className="d-flex align-items-center justify-content-between">
      <span className="flex-grow-1 mr-4">{name}</span>
      <span className="flex-shrink-0">
        <PriceLabel listPrice={price} currencyId={currencyId} />
      </span>
    </div>
  )
}

export type CheckoutProductModalProps = {
  defaultProductId: string
  renderTrigger: (options: {
    isLoading?: boolean
    isSubscription?: boolean
    onOpen?: () => void
    onProductChange?: (productId: string) => void
  }) => React.ReactElement
  warningText?: string
  startedAt?: Date
  shippingMethods?: ShippingMethodProps[]
  isFieldsValidate?: (fieldsValue: { invoice: InvoiceProps; shipping: ShippingProps }) => {
    isValidInvoice: boolean
    isValidShipping: boolean
  }
  renderInvoice?: (props: {
    invoice: InvoiceProps
    setInvoice: React.Dispatch<React.SetStateAction<InvoiceProps>>
    isValidating: boolean
  }) => React.ReactNode
  renderProductSelector?: (options: {
    productId: string
    onProductChange: (productId: string) => void
  }) => React.ReactElement
  renderTerms?: () => React.ReactElement
}

const CheckoutProductModal: React.VFC<CheckoutProductModalProps> = ({
  defaultProductId,
  warningText,
  startedAt,
  shippingMethods,
  isFieldsValidate,
  renderInvoice,
  renderTrigger,
  renderProductSelector,
  renderTerms,
}) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { enabledModules, settings } = useApp()
  const { currentMemberId } = useAuth()
  const { member: currentMember } = useMember(currentMemberId || '')

  const sessionStorageKey = `lodestar.sharing_code.${defaultProductId}`
  const [sharingCode = window.sessionStorage.getItem(sessionStorageKey)] = useQueryParam('sharing', StringParam)
  sharingCode && window.sessionStorage.setItem(sessionStorageKey, sharingCode)

  const cachedCartInfo = useMemo<{
    shipping: ShippingProps | null
    invoice: InvoiceProps | null
    payment: PaymentProps | null
  }>(() => {
    const defaultCartInfo = {
      shipping: null,
      invoice: {
        name: currentMember?.name || '',
        phone: '',
        email: currentMember?.email || '',
      },
      payment: null,
    }
    try {
      const cachedShipping = localStorage.getItem('kolable.cart.shipping')
      const cachedInvoice = localStorage.getItem('kolable.cart.invoice')
      const cachedPayment = localStorage.getItem('kolable.cart.payment.perpetual')
      cachedCartInfo.shipping = cachedShipping && JSON.parse(cachedShipping)
      cachedCartInfo.invoice = cachedInvoice && JSON.parse(cachedInvoice).value
      cachedCartInfo.payment = cachedPayment && JSON.parse(cachedPayment)
    } catch {}
    return defaultCartInfo
  }, [currentMember?.name, currentMember?.email])

  // checkout
  const [productId, setProductId] = useState(defaultProductId)
  const { target } = useSimpleProduct({ id: productId, startedAt })

  // cart information
  const memberCartInfo: {
    shipping?: ShippingProps | null
    invoice?: InvoiceProps | null
    payment?: PaymentProps | null
  } = {
    shipping: currentMember?.shipping,
    invoice: currentMember?.invoice,
    payment: currentMember?.payment,
  }

  const [shipping, setShipping] = useState<ShippingProps>({
    name: '',
    phone: '',
    address: '',
    shippingMethod: 'home-delivery',
    specification: '',
    storeId: '',
    storeName: '',
    ...memberCartInfo.shipping,
    ...cachedCartInfo.shipping,
  })
  const [invoice, setInvoice] = useState<InvoiceProps>({
    name: '',
    phone: '',
    email: currentMember?.email || '',
    ...memberCartInfo.invoice,
    ...cachedCartInfo.invoice,
  })

  const [payment, setPayment] = useState<PaymentProps | null | undefined>()

  const initialPayment = useMemo(
    () =>
      (target?.isSubscription
        ? {
            gateway: settings['payment.subscription.default_gateway'] || 'tappay',
            method: 'credit',
          }
        : {
            gateway: settings['payment.perpetual.default_gateway'] || 'spgateway',
            method: settings['payment.perpetual.default_gateway_method'] || 'credit',
            ...memberCartInfo.payment,
            ...cachedCartInfo.payment,
          }) as PaymentProps,
    [target?.isSubscription, settings, memberCartInfo.payment, cachedCartInfo.payment],
  )

  useEffect(() => {
    if (typeof target?.isSubscription === 'boolean') {
      setPayment(initialPayment)
    }
  }, [target?.isSubscription, initialPayment])

  const shippingRef = useRef<HTMLDivElement | null>(null)
  const invoiceRef = useRef<HTMLDivElement | null>(null)
  const referrerRef = useRef<HTMLDivElement | null>(null)
  const groupBuyingRef = useRef<HTMLDivElement | null>(null)
  const paymentMethodRef = useRef<HTMLDivElement | null>(null)

  const [discountId, setDiscountId] = useState('')
  const [groupBuying, setGroupBuying] = useState<{
    memberIds: string[]
    withError: boolean
  }>({ memberIds: [], withError: false })

  const { totalPrice, placeOrder, check, orderChecking, orderPlacing } = useCheck({
    productIds: [productId],
    discountId,
    shipping: target?.isPhysical
      ? shipping
      : productId.startsWith('MerchandiseSpec_')
      ? { address: currentMember?.email }
      : null,
    options: {
      [productId]: {
        startedAt,
        from: window.location.pathname,
        sharingCode,
        groupBuyingPartnerIds: groupBuying.memberIds,
      },
    },
  })
  const [isValidating, setIsValidating] = useState(false)
  const [referrerEmail, setReferrerEmail] = useState('')
  const { memberId: referrerId, validateStatus: referrerStatus } = useMemberValidation(referrerEmail)
  const updateMemberMetadata = useUpdateMemberMetadata()

  if (currentMember === null || target === null || payment === undefined) {
    return renderTrigger?.({ isLoading: true })
  }

  const handleSubmit = () => {
    !isValidating && setIsValidating(true)
    let isValidShipping = false
    let isValidInvoice = false
    if (isFieldsValidate) {
      ;({ isValidInvoice, isValidShipping } = isFieldsValidate({ invoice, shipping }))
    } else {
      isValidShipping = !target.isPhysical || validateShipping(shipping)
      isValidInvoice = settings['feature.invoice.disable'] ? true : validateInvoice(invoice).length === 0
    }

    if (totalPrice > 0 && payment === null) {
      paymentMethodRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (!isValidShipping) {
      shippingRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    } else if ((totalPrice > 0 || target.discountDownPrice) && !isValidInvoice) {
      invoiceRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (referrerStatus === 'error') {
      referrerRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    if (referrerEmail && referrerStatus !== 'success') {
      if (referrerStatus === 'error') {
        referrerRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }
    if (groupBuying.withError) {
      groupBuyingRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    if (settings['tracking.fb_pixel_id']) {
      ReactPixel.track('AddToCart', {
        content_name: target.title || productId,
        value: totalPrice,
        currency: 'TWD',
      })
    }
    if (settings['tracking.ga_id']) {
      ReactGA.plugin.execute('ec', 'addProduct', {
        id: productId,
        name: target.title || productId,
        category: productId.split('_')[0] || 'Unknown',
        price: `${totalPrice}`,
        quantity: '1',
        currency: 'TWD',
      })
      ReactGA.plugin.execute('ec', 'setAction', 'add')
      ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart')
    }

    placeOrder(
      target.isSubscription ? 'subscription' : 'perpetual',
      {
        ...invoice,
        referrerEmail: referrerEmail || undefined,
      },
      payment,
    )
      .then(taskId =>
        // sync cart info
        updateMemberMetadata({
          variables: {
            memberId: currentMember.id,
            metadata: {
              invoice,
              shipping,
              payment,
            },
            memberPhones: invoice.phone ? [{ member_id: currentMember.id, phone: invoice.phone }] : [],
          },
        }).then(() => taskId),
      )
      .then(taskId => history.push(`/tasks/order/${taskId}`))
      .catch(() => {})
  }

  return (
    <>
      {renderTrigger({
        onOpen,
        onProductChange: productId => setProductId(productId),
        isSubscription: target.isSubscription,
      })}
      <CommonModal
        title={<StyledTitle className="mb-4">{formatMessage(checkoutMessages.title.cart)}</StyledTitle>}
        isOpen={isOpen}
        isFullWidth
        onClose={onClose}
      >
        <div className="mb-4">
          <ProductItem
            id={productId}
            startedAt={startedAt}
            variant={
              settings['custom.project.plan_price_style'] === 'hidden' && productId.startsWith('ProjectPlan_')
                ? undefined
                : 'checkout'
            }
          />
        </div>

        {renderProductSelector && (
          <div className="mb-5">
            {renderProductSelector({ productId, onProductChange: productId => setProductId(productId) })}
          </div>
        )}

        {!!warningText && <StyledWarningText>{warningText}</StyledWarningText>}

        {target.isPhysical && (
          <div ref={shippingRef}>
            <ShippingInput
              value={shipping}
              onChange={value => setShipping(value)}
              shippingMethods={shippingMethods}
              isValidating={isValidating}
            />
          </div>
        )}

        {enabledModules.group_buying && !!target.groupBuyingPeople && target.groupBuyingPeople > 1 && (
          <div ref={groupBuyingRef}>
            <StyledBlockTitle className="mb-3">{formatMessage(checkoutMessages.label.groupBuying)}</StyledBlockTitle>
            <OrderedList className="mb-4">
              <StyledListItem>{formatMessage(checkoutMessages.text.groupBuyingDescription1)}</StyledListItem>
              <StyledListItem>{formatMessage(checkoutMessages.text.groupBuyingDescription2)}</StyledListItem>
              <StyledListItem>
                {formatMessage(checkoutMessages.text.groupBuyingDescription3, { modal: <GroupBuyingRuleModal /> })}
              </StyledListItem>
            </OrderedList>
            <CheckoutGroupBuyingForm
              title={target.title || ''}
              partnerCount={target.groupBuyingPeople - 1}
              onChange={value => setGroupBuying(value)}
            />
          </div>
        )}

        {totalPrice > 0 && target.isSubscription === false && (
          <div className="mb-5" ref={paymentMethodRef}>
            <PaymentSelector value={payment} onChange={v => setPayment(v)} isValidating={isValidating} />
          </div>
        )}

        {(totalPrice > 0 || target.discountDownPrice) && (
          <>
            <div ref={invoiceRef} className="mb-5">
              {renderInvoice?.({ invoice, setInvoice, isValidating }) ||
                (!settings['feature.invoice.disable'] && (
                  <InvoiceInput
                    value={invoice}
                    onChange={value => setInvoice(value)}
                    isValidating={isValidating}
                    shouldSameToShippingCheckboxDisplay={target.isPhysical}
                  />
                ))}
            </div>
            <div className="mb-3">
              <DiscountSelectionCard check={check} value={discountId} onChange={setDiscountId} />
            </div>
          </>
        )}

        {enabledModules.referrer && (
          <div className="row mb-3" ref={referrerRef}>
            <div className="col-12">
              <StyledTitle className="mb-2">{formatMessage(commonMessages.label.referrer)}</StyledTitle>
            </div>
            <div className="col-12 col-lg-6">
              <CheckoutProductReferrerInput
                referrerId={referrerId}
                referrerStatus={referrerStatus}
                onEmailSet={email => setReferrerEmail(email)}
              />
            </div>
          </div>
        )}

        <Divider className="mb-3" />
        {renderTerms && (
          <StyledCheckoutBlock className="mb-5">
            <div className="mb-2">{renderTerms()}</div>
          </StyledCheckoutBlock>
        )}
        {settings['custom.project.plan_price_style'] === 'hidden' &&
        productId.startsWith('ProjectPlan_') ? null : orderChecking ? (
          <SkeletonText noOfLines={4} spacing="5" />
        ) : (
          <>
            <StyledCheckoutBlock className="mb-5">
              {check.orderProducts.map(orderProduct => (
                <CheckoutProductItem key={orderProduct.name} name={orderProduct.name} price={orderProduct.price} />
              ))}

              {check.orderDiscounts.map(orderDiscount => (
                <CheckoutProductItem key={orderDiscount.name} name={orderDiscount.name} price={orderDiscount.price} />
              ))}

              {check.shippingOption && (
                <CheckoutProductItem
                  name={formatMessage(
                    checkoutMessages.shipping[camelCase(check.shippingOption.id) as ShippingOptionIdType],
                  )}
                  price={check.shippingOption.fee}
                />
              )}
            </StyledCheckoutBlock>
            <StyledCheckoutPrice className="mb-3">
              <PriceLabel listPrice={totalPrice} />
            </StyledCheckoutPrice>
          </>
        )}

        <StyledSubmitBlock className="text-right">
          <Button variant="outline" onClick={onClose} className="mr-3">
            {formatMessage(commonMessages.ui.cancel)}
          </Button>
          <Button colorScheme="primary" isLoading={orderPlacing} onClick={handleSubmit}>
            {target.isSubscription
              ? formatMessage(commonMessages.button.subscribeNow)
              : formatMessage(checkoutMessages.button.cartSubmit)}
          </Button>
        </StyledSubmitBlock>
      </CommonModal>
    </>
  )
}

export default CheckoutProductModal
