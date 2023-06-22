import { gql, useQuery } from '@apollo/client'
import { Box, Button, Checkbox, Divider, OrderedList, SkeletonText, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { camelCase } from 'lodash'
import { now } from 'moment'
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
import hasura from '../../hasura'
import { notEmpty, validateContactInfo } from '../../helpers'
import { checkoutMessages, commonMessages } from '../../helpers/translation'
import { useCheck } from '../../hooks/checkout'
import { useMemberValidation, useSimpleProduct } from '../../hooks/common'
import { useMember, useUpdateMemberMetadata } from '../../hooks/member'
import { useResourceCollection } from '../../hooks/resource'
import { useTracking } from '../../hooks/tracking'
import { getResourceByProductId, useTappay } from '../../hooks/util'
import { ContactInfo, InvoiceProps, PaymentProps, ShippingOptionIdType, ShippingProps } from '../../types/checkout'
import { ShippingMethodProps } from '../../types/merchandise'
import { BREAK_POINT } from '../common/Responsive'
import CheckoutGroupBuyingForm, { StyledBlockTitle, StyledListItem } from '../forms/CheckoutGroupBuyingForm'
import TapPayForm, { TPCreditCard } from '../forms/TapPayForm'
import CheckoutProductReferrerInput from '../inputs/CheckoutProductReferrerInput'
import ContactInfoInput from '../inputs/ContactInfoInput'
import InvoiceInput, { validateInvoice } from '../inputs/InvoiceInput'
import ShippingInput, { validateShipping } from '../inputs/ShippingInput'
import { useMemberCreditCards } from '../selectors/CreditCardSelector'

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

const StyledLabel = styled.span`
  font-weight: bold;
`

const StyledCheckbox = styled(Checkbox)`
  .chakra-checkbox__control {
    border: 1px solid #cdcece;
  }
`

const CheckoutProductItem: React.VFC<{
  name: string
  price: number
  currencyId?: string
  quantity?: number
  saleAmount?: number
  defaultProductId?: string
}> = ({ name, price, currencyId, quantity, saleAmount, defaultProductId }) => {
  return (
    <div className="d-flex align-items-center justify-content-between">
      <span className="flex-grow-1 mr-4">
        {name}
        {quantity && saleAmount && (
          <span>{` X${quantity} ${
            defaultProductId?.includes('MerchandiseSpec_') ? '' : `(${quantity * saleAmount} 張)`
          }`}</span>
        )}
      </span>

      <span className="flex-shrink-0">
        <PriceLabel listPrice={price} currencyId={currencyId} />
      </span>
    </div>
  )
}

const StyledApprovementBox = styled.div`
  padding-left: 46px;
`

export type CheckoutProductModalProps = {
  defaultProductId: string
  renderTrigger: (options: {
    isLoading?: boolean
    isSubscription?: boolean
    disable?: boolean
    isLoginAlert?: boolean
    onOpen?: () => void
    onProductChange?: (productId: string) => void
  }) => React.ReactElement
  warningText?: string
  startedAt?: Date
  shippingMethods?: ShippingMethodProps[]
  productQuantity?: number
  isModalDisable?: boolean
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
  setIsModalDisable?: (disable: boolean) => void
  setIsOrderCheckLoading?: (isOrderCheckLoading: boolean) => void
}

const CheckoutProductModal: React.VFC<CheckoutProductModalProps> = ({
  defaultProductId,
  warningText,
  startedAt,
  shippingMethods,
  productQuantity,
  isFieldsValidate,
  renderInvoice,
  renderTrigger,
  renderProductSelector,
  renderTerms,
  setIsModalDisable,
  setIsOrderCheckLoading,
}) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const checkoutOpened = useRef(false)
  const [checkoutProductId] = useQueryParam('checkoutProductId', StringParam)
  const { enabledModules, settings, id: appId, currencyId: appCurrencyId } = useApp()
  const { currentMemberId, isAuthenticating, authToken } = useAuth()
  const { member: currentMember } = useMember(currentMemberId || '')
  const { memberCreditCards } = useMemberCreditCards(currentMemberId || '')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!checkoutOpened.current && checkoutProductId === defaultProductId) {
      checkoutOpened.current = true
      onOpen()
    }
  }, [checkoutProductId])

  useEffect(() => {
    if (productQuantity !== undefined) {
      setQuantity(productQuantity)
    }
  }, [productQuantity])

  const sessionStorageKey = `lodestar.sharing_code.${defaultProductId}`
  const [sharingCode = window.sessionStorage.getItem(sessionStorageKey)] = useQueryParam('sharing', StringParam)
  sharingCode && window.sessionStorage.setItem(sessionStorageKey, sharingCode)

  const cachedCartInfo = useMemo<{
    shipping: ShippingProps | null
    invoice: InvoiceProps | null
    payment: PaymentProps | null
    contactInfo: ContactInfo | null
  }>(() => {
    const defaultCartInfo = {
      shipping: null,
      invoice: {
        name: currentMember?.name || '',
        phone: currentMember?.phone || '',
        email: currentMember?.email || '',
      },
      payment: null,
      contactInfo: {
        name: currentMember?.name || '',
        phone: currentMember?.phone || '',
        email: currentMember?.email || '',
      },
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
  }, [currentMember?.name, currentMember?.email, currentMember?.phone])

  // checkout
  const [productId, setProductId] = useState(defaultProductId)
  const { target: productTarget } = useSimpleProduct({ id: productId, startedAt })
  const { type, target } = getResourceByProductId(productId)
  const { resourceCollection } = useResourceCollection([`${appId}:${type}:${target}`])

  // tracking
  const tracking = useTracking()

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
  const [isApproved, setIsApproved] = useState(settings['checkout.approvement'] !== 'true')
  useEffect(() => {
    setIsApproved(settings['checkout.approvement'] !== 'true')
  }, [settings])

  useEffect(() => {
    if (currentMember) {
      setInvoice(prev => ({ ...prev, ...cachedCartInfo.invoice }))
    }
  }, [cachedCartInfo.invoice])

  const initialPayment = useMemo(
    () =>
      (productTarget?.isSubscription
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
    [productTarget?.isSubscription, settings, memberCartInfo.payment, cachedCartInfo.payment],
  )

  useEffect(() => {
    if (typeof productTarget?.isSubscription === 'boolean') {
      setPayment(initialPayment)
    }
  }, [productTarget?.isSubscription, initialPayment])

  const shippingRef = useRef<HTMLDivElement | null>(null)
  const invoiceRef = useRef<HTMLDivElement | null>(null)
  const referrerRef = useRef<HTMLDivElement | null>(null)
  const groupBuyingRef = useRef<HTMLDivElement | null>(null)
  const paymentMethodRef = useRef<HTMLDivElement | null>(null)
  const contactInfoRef = useRef<HTMLDivElement | null>(null)
  const [discountId, setDiscountId] = useState('')
  useEffect(() => {
    if (
      productTarget?.currencyId === 'LSC' &&
      defaultProductId !== undefined &&
      defaultProductId.includes('MerchandiseSpec_')
    ) {
      setDiscountId('Coin')
    }
  }, [productTarget, defaultProductId])

  const [groupBuying, setGroupBuying] = useState<{
    memberIds: string[]
    withError: boolean
  }>({ memberIds: [], withError: false })

  const { totalPrice, placeOrder, check, orderChecking, orderPlacing } = useCheck({
    productIds: [productId],
    discountId,
    shipping: productTarget?.isPhysical
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
        quantity: quantity,
      },
    },
  })
  const { TPDirect } = useTappay()
  const toast = useToast()
  const [isValidating, setIsValidating] = useState(false)
  const [referrerEmail, setReferrerEmail] = useState('')
  const [tpCreditCard, setTpCreditCard] = useState<TPCreditCard | null>(null)
  const [errorContactFields, setErrorContactFields] = useState<string[]>([])
  const { memberId: referrerId, validateStatus: referrerStatus } = useMemberValidation(referrerEmail)
  const updateMemberMetadata = useUpdateMemberMetadata()
  const isCreditCardReady = Boolean(memberCreditCards.length > 0 || tpCreditCard?.canGetPrime)
  const [isCoinMerchandise, setIsCoinMerchandise] = useState(false)
  const [isCoinsEnough, setIsCoinsEnough] = useState(true)
  const { remainingCoins } = useMemberCoinsRemaining(currentMemberId || '')
  useEffect(() => {
    if (check.orderProducts.length === 0) {
      setIsOrderCheckLoading?.(true)
      setIsModalDisable?.(true)
    } else if (
      check.orderProducts.length === 1 &&
      check.orderProducts[0].options?.currencyId === 'LSC' &&
      check.orderProducts[0].productId.includes('MerchandiseSpec_')
    ) {
      setIsOrderCheckLoading?.(false)
      setIsCoinMerchandise(true)
      if (
        check.orderProducts[0].options?.currencyPrice !== undefined &&
        remainingCoins !== undefined &&
        productQuantity !== undefined &&
        check.orderProducts[0].options.currencyPrice * productQuantity > remainingCoins
      ) {
        setIsCoinsEnough(false)
        setIsModalDisable?.(true)
      } else {
        setIsCoinsEnough(true)
        setIsModalDisable?.(false)
      }
    }
  }, [check, productQuantity, remainingCoins, setIsModalDisable, setIsOrderCheckLoading])

  useEffect(() => {
    if (isOpen) {
      const resource = resourceCollection.find(notEmpty)
      // resource && tracking.addToCart(resource, { direct: true })
    }
  }, [isOpen])

  if (isAuthenticating) {
    return renderTrigger?.({ isLoading: true })
  }

  if (currentMember === null) {
    return renderTrigger?.({ isLoginAlert: true })
  }

  if (productTarget === null || payment === undefined) {
    return renderTrigger?.({ isLoading: isAuthenticating, disable: true })
  }

  const handleSubmit = async () => {
    !isValidating && setIsValidating(true)
    let isValidShipping = false
    let isValidInvoice = false
    if (isFieldsValidate) {
      ;({ isValidInvoice, isValidShipping } = isFieldsValidate({ invoice, shipping }))
    } else {
      isValidShipping = !productTarget.isPhysical || validateShipping(shipping)
      isValidInvoice = Number(settings['feature.invoice.disable'])
        ? true
        : Number(settings['feature.invoice_member_info_input.disable'])
        ? validateInvoice(invoice).filter(v => !['name', 'phone', 'email'].includes(v)).length === 0
        : validateInvoice(invoice).length === 0
    }

    if (totalPrice > 0 && payment === null) {
      paymentMethodRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (!isValidShipping) {
      shippingRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    } else if ((totalPrice > 0 || productTarget.discountDownPrice) && !isValidInvoice) {
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

    if (totalPrice <= 0 && settings['feature.contact_info.enabled'] === '1') {
      const errorFields = validateContactInfo(invoice)
      if (errorFields.length !== 0) {
        setErrorContactFields(errorFields)
        contactInfoRef.current?.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }

    if (!isCoinsEnough) {
      toast({
        title: formatMessage(checkoutMessages.message.notEnoughCoins),
        status: 'error',
        duration: 3000,
        position: 'top',
      })
      return
    }

    if (settings['tracking.fb_pixel_id']) {
      ReactPixel.track('AddToCart', {
        content_name: productTarget.title || productId,
        value: totalPrice,
        currency: 'TWD',
      })
    }
    if (settings['tracking.ga_id']) {
      ReactGA.plugin.execute('ec', 'addProduct', {
        id: productId,
        name: productTarget.title || productId,
        category: productId.split('_')[0] || 'Unknown',
        price: `${totalPrice}`,
        quantity: '1',
        currency: 'TWD',
      })
      ReactGA.plugin.execute('ec', 'setAction', 'add')
      ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart')
    }

    // free subscription should bind card first
    if (productTarget.isSubscription && totalPrice <= 0 && memberCreditCards.length === 0) {
      await new Promise((resolve, reject) => {
        const clientBackUrl = new URL(window.location.href)
        clientBackUrl.searchParams.append('checkoutProductId', productId)

        TPDirect.card.getPrime(({ status, card: { prime } }: { status: number; card: { prime: string } }) => {
          axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API_BASE_ROOT}/payment/credit-cards`,
            withCredentials: true,
            data: {
              prime,
              cardHolder: {
                name: currentMember.name,
                email: currentMember.email,
                phoneNumber: currentMember.phone || '0987654321',
              },
              clientBackUrl,
            },
            headers: { authorization: `Bearer ${authToken}` },
          })
            .then(({ data: { code, result } }) => {
              if (code === 'SUCCESS') {
                resolve(result.memberCreditCardId)
              } else if (code === 'REDIRECT') {
                window.location.assign(result)
              }
              reject(code)
            })
            .catch(reject)
        })
      })
    }

    const { orderId, paymentNo, payToken } = await placeOrder(
      productTarget.isSubscription ? 'subscription' : 'perpetual',
      {
        ...invoice,
        referrerEmail: referrerEmail || undefined,
      },
      payment,
    )

    await updateMemberMetadata({
      variables: {
        memberId: currentMember.id,
        metadata: {
          invoice,
          shipping,
          payment,
        },
        memberPhones: invoice.phone ? [{ member_id: currentMember.id, phone: invoice.phone }] : [],
      },
    }).catch(() => {})
    history.push(paymentNo ? `/payments/${paymentNo}?token=${payToken}` : `/orders/${orderId}?tracking=1`)
  }

  const trackCartItem = (currentQuantity: number, nextQuantity: number) => {
    if (currentQuantity < nextQuantity) {
      // resourceCollection[0] &&
      // tracking.addToCart(resourceCollection[0], { direct: true, quantity: nextQuantity - currentQuantity })
    }

    if (currentQuantity > nextQuantity) {
      // resourceCollection[0] &&
      // tracking.removeFromCart(resourceCollection[0], { quantity: currentQuantity - nextQuantity })
    }
  }

  return (
    <>
      {renderTrigger({
        onOpen,
        onProductChange: productId => setProductId(productId),
        isLoading: isAuthenticating,
        isSubscription: productTarget.isSubscription,
        disable:
          (productTarget.endedAt ? new Date(productTarget.endedAt) < new Date(now()) : false) ||
          (productTarget.expiredAt ? new Date(productTarget.expiredAt) < new Date(now()) : false),
      })}
      <CommonModal
        title={<StyledTitle className="mb-4">{formatMessage(checkoutMessages.title.cart)}</StyledTitle>}
        isOpen={isOpen}
        isFullWidth
        onClose={() => {
          onClose()
          const resource = resourceCollection.filter(notEmpty).length > 0 && resourceCollection[0]
          // resource && tracking.removeFromCart(resource, { quantity: quantity })
          setQuantity(1)
        }}
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
            quantity={quantity}
            onChange={value => {
              if (typeof value === 'number') {
                trackCartItem(quantity, value)
                setQuantity(value)
              }
            }}
          />
        </div>

        {settings['feature.contact_info.enabled'] === '1' && totalPrice === 0 && (
          <Box ref={contactInfoRef} mb="3">
            <ContactInfoInput value={invoice} onChange={v => setInvoice(v)} errorContactFields={errorContactFields} />
          </Box>
        )}

        {renderProductSelector && (
          <div className="mb-5">
            {renderProductSelector({ productId, onProductChange: productId => setProductId(productId) })}
          </div>
        )}

        {!!warningText && <StyledWarningText>{warningText}</StyledWarningText>}

        {productTarget.isPhysical && (
          <div ref={shippingRef}>
            <ShippingInput
              value={shipping}
              onChange={value => setShipping(value)}
              shippingMethods={shippingMethods}
              isValidating={isValidating}
            />
          </div>
        )}

        {enabledModules.group_buying && !!productTarget.groupBuyingPeople && productTarget.groupBuyingPeople > 1 && (
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
              title={productTarget.title || ''}
              partnerCount={productTarget.groupBuyingPeople - 1}
              onChange={value => setGroupBuying(value)}
            />
          </div>
        )}

        {totalPrice > 0 && productTarget.isSubscription === false && (
          <div className="mb-5" ref={paymentMethodRef}>
            <PaymentSelector value={payment} onChange={v => setPayment(v)} isValidating={isValidating} />
          </div>
        )}

        {totalPrice <= 0 && productTarget.isSubscription && (
          <>
            {memberCreditCards[0]?.cardInfo?.['last_four'] ? (
              <Box borderWidth="1px" borderRadius="lg" w="100%" p={4}>
                <span>
                  {formatMessage(checkoutMessages.label.creditLastFour)}：{memberCreditCards[0].cardInfo['last_four']}
                </span>
              </Box>
            ) : (
              <TapPayForm onUpdate={setTpCreditCard} />
            )}
          </>
        )}
        {((totalPrice > 0 && productTarget?.currencyId !== 'LSC' && productTarget.productType !== 'MerchandiseSpec') ||
          productTarget.discountDownPrice) && (
          <>
            <div ref={invoiceRef} className="mb-5">
              {renderInvoice?.({ invoice, setInvoice, isValidating }) ||
                (settings['feature.invoice.disable'] !== '1' && (
                  <InvoiceInput
                    value={invoice}
                    onChange={value => setInvoice(value)}
                    isValidating={isValidating}
                    shouldSameToShippingCheckboxDisplay={productTarget.isPhysical}
                  />
                ))}
            </div>
            <div className="mb-3">
              <DiscountSelectionCard check={check} value={discountId} onChange={setDiscountId} />
            </div>
          </>
        )}

        {enabledModules.referrer && productTarget.currencyId !== undefined && productTarget.currencyId !== 'LSC' && (
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
        {settings['checkout.approvement'] === 'true' && (
          <div className="my-4">
            <StyledCheckbox
              className="mr-2"
              size="lg"
              colorScheme="primary"
              isChecked={isApproved}
              onChange={() => setIsApproved(prev => !prev)}
            />
            <StyledLabel>{formatMessage(checkoutMessages.label.approved)}</StyledLabel>
            <StyledApprovementBox
              className="mt-2"
              dangerouslySetInnerHTML={{ __html: settings['checkout.approvement_content'] }}
            />
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
                <CheckoutProductItem
                  key={orderProduct.name}
                  name={orderProduct.name}
                  price={
                    orderProduct.productId.includes('MerchandiseSpec_') && orderProduct.options?.currencyId === 'LSC'
                      ? orderProduct.options.currencyPrice || orderProduct.price
                      : orderProduct.price
                  }
                  quantity={quantity}
                  saleAmount={Number((orderProduct.options?.amount || 1) / quantity)}
                  defaultProductId={defaultProductId}
                  currencyId={orderProduct.options?.currencyId || appCurrencyId}
                />
              ))}

              {check.orderDiscounts.map((orderDiscount, idx) => (
                <CheckoutProductItem
                  key={orderDiscount.name}
                  name={orderDiscount.name}
                  price={
                    check.orderProducts[0]?.productId.includes('MerchandiseSpec_') &&
                    check.orderProducts[0].options?.currencyId === 'LSC'
                      ? -orderDiscount.options?.coins
                      : -orderDiscount.price
                  }
                  currencyId={productTarget.currencyId}
                />
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
              {!isCoinMerchandise || isCoinsEnough ? (
                <PriceLabel listPrice={totalPrice} />
              ) : (
                `${settings['coin.unit'] || check.orderProducts[0].options?.currencyId} ${formatMessage(
                  checkoutMessages.message.notEnough,
                )}`
              )}
            </StyledCheckoutPrice>
          </>
        )}

        <StyledSubmitBlock className="text-right">
          <Button
            variant="outline"
            onClick={() => {
              onClose()
              const resource = resourceCollection.filter(notEmpty).length > 0 && resourceCollection[0]
              // resource && tracking.removeFromCart(resource)
            }}
            className="mr-3"
          >
            {formatMessage(commonMessages.ui.cancel)}
          </Button>
          <Button
            colorScheme="primary"
            isLoading={orderPlacing}
            onClick={handleSubmit}
            disabled={
              (totalPrice === 0 && productTarget.isSubscription && !isCreditCardReady) ||
              isApproved === false ||
              !isCoinsEnough
            }
          >
            {productTarget.isSubscription
              ? formatMessage(commonMessages.button.subscribeNow)
              : formatMessage(checkoutMessages.button.cartSubmit)}
          </Button>
        </StyledSubmitBlock>
      </CommonModal>
    </>
  )
}

const useMemberCoinsRemaining = (memberId: string) => {
  const { loading, error, data } = useQuery<
    hasura.GET_MEMBER_COIN_REMAINING,
    hasura.GET_MEMBER_COIN_REMAININGVariables
  >(
    gql`
      query GET_MEMBER_COIN_REMAINING($memberId: String!) {
        coin_status(where: { member_id: { _eq: $memberId } }) {
          remaining
        }
      }
    `,
    {
      variables: { memberId },
    },
  )
  const remainingCoins = data?.coin_status.reduce((total, coin) => {
    return (total += coin.remaining)
  }, 0)
  return { remainingCoins }
}

export default CheckoutProductModal
