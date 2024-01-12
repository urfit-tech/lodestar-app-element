import Axios from 'axios'
import { prop, sum } from 'ramda'
import { useCallback, useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { useApp } from '../contexts/AppContext'
import { useAuth } from '../contexts/AuthContext'
import { getTrackingCookie } from '../helpers'
import {
  CheckProps,
  InvoiceProps,
  OrderDiscountProps,
  OrderProductProps,
  PaymentProps,
  ShippingOptionProps,
  ShippingProps,
} from '../types/checkout'

export const useCheck = ({
  productIds,
  discountId,
  shipping,
  options,
}: {
  productIds: string[]
  discountId: string | null
  shipping: ShippingProps | null
  options: { [ProductId: string]: any }
}) => {
  const { authToken } = useAuth()
  const { id: appId } = useApp()
  const [check, setCheck] = useState<CheckProps>({ orderProducts: [], orderDiscounts: [], shippingOption: null })
  const [orderChecking, setOrderChecking] = useState(false)
  const [orderPlacing, setOrderPlacing] = useState(false)
  const [checkError, setCheckError] = useState<Error | null>(null)

  useEffect(() => {
    setOrderChecking(true)
    Axios.post<{
      code: string
      message: string
      result: {
        orderProducts: OrderProductProps[]
        orderDiscounts: OrderDiscountProps[]
        shippingOption: ShippingOptionProps
      }
    }>(
      `${process.env.REACT_APP_API_BASE_ROOT}/payment/checkout-order`,
      {
        appId,
        productIds,
        discountId,
        shipping,
        options,
      },
      {
        headers: { authorization: `Bearer ${authToken}` },
      },
    )
      .then(({ data: { code, message, result } }) => {
        if (code === 'SUCCESS') {
          setCheck(result)
        } else {
          setCheckError(new Error(message))
        }
      })
      .catch(setCheckError)
      .finally(() => setOrderChecking(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    appId,
    authToken,
    discountId,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(productIds),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(shipping),
  ])

  const placeOrder = useCallback(
    async (
      paymentType: 'perpetual' | 'subscription' | 'groupBuying',
      invoice: InvoiceProps,
      payment?: PaymentProps | null,
    ) => {
      setOrderPlacing(true)
      const trackingCookie = getTrackingCookie()
      const trackingOptions = { ...trackingCookie }
      return Axios.post<{
        code: string
        message: string
        result: {
          orderId: string
          totalAmount: number
          paymentNo: string | null
          payToken: string | null
          products: { name: string; price: number }[]
          discounts: { name: string; price: number }[]
        }
      }>(
        `${process.env.REACT_APP_API_BASE_ROOT}/order/create`,
        {
          clientBackUrl: window.location.origin,
          paymentModel: { type: paymentType, gateway: payment?.gateway, method: payment?.method },
          productIds,
          discountId,
          shipping,
          invoice,
          options,
          tracking: trackingOptions,
        },
        {
          headers: { authorization: `Bearer ${authToken}` },
        },
      )
        .then(({ data: { code, result, message } }) => {
          if (code === 'SUCCESS') {
            ReactGA.plugin.execute('ec', 'setAction', 'checkout', { step: 4 })
            ReactGA.ga('send', 'pageview')
            return result
          } else {
            throw new Error(message)
          }
        })
        .finally(() => setOrderPlacing(false))
    },
    [authToken, discountId, options, productIds, shipping],
  )

  const totalPrice =
    sum(check.orderProducts.map(prop('price'))) -
    sum(check.orderDiscounts.map(prop('price'))) +
    (check.shippingOption?.fee || 0)

  return {
    check,
    checkError,
    orderPlacing,
    orderChecking,
    placeOrder,
    totalPrice: Math.max(totalPrice, 0),
  }
}
