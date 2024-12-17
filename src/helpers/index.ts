import axios, { AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import moment from 'moment'
import queryString from 'query-string'
import { css, FlattenSimpleInterpolation } from 'styled-components'
import { BREAK_POINT } from '../components/common/Responsive'
import { ContactInfo } from '../types/checkout'
import { ProductPlan } from '../types/data'
import {
  BindDeviceError,
  InputError,
  LoginDeviceError,
  NoMemberError,
  NoModuleError,
  PasswordError,
  SendEmailError,
  SessionError,
} from './error'

export const durationFullFormatter = (seconds: number) => {
  if (seconds >= 3600) {
    const remainSeconds = seconds % 3600
    return `HOURS:MINUTES:SECONDS`
      .replace('HOURS', `${Math.floor(seconds / 3600)}`.padStart(2, '0'))
      .replace('MINUTES', `${Math.floor(remainSeconds / 60)}`.padStart(2, '0'))
      .replace('SECONDS', `${Math.floor(remainSeconds % 60)}`.padStart(2, '0'))
  } else {
    return `MINUTES:SECONDS`
      .replace('MINUTES', `${Math.floor(seconds / 60)}`.padStart(2, '0'))
      .replace('SECONDS', `${Math.floor(seconds % 60)}`.padStart(2, '0'))
  }
}

export const durationFormatter = (value?: number | null) => {
  return typeof value === 'number' && `約 ${(value / 60).toFixed(0)} 分鐘`
}

export const uploadFile = async (key: string, file: Blob, authToken: string | null, config?: AxiosRequestConfig) =>
  await axios
    .post(
      `${process.env.REACT_APP_API_BASE_ROOT}/sys/sign-url`,
      {
        operation: 'putObject',
        params: {
          Key: key,
          ContentType: file.type,
        },
      },
      {
        headers: { authorization: `Bearer ${authToken}` },
      },
    )
    .then(res => res.data.result)
    .then(url => {
      const { query } = queryString.parseUrl(url)
      return axios.put<{ status: number; data: string }>(url, file, {
        ...config,
        headers: {
          ...query,
          'Content-Type': file.type,
        },
      })
    })

export const handleError = (error: any) => {
  process.env.NODE_ENV === 'development' && console.error(error)
  if (error.response && error.response.data) {
    return alert(error.response.data.message)
  }
  return alert(error.message)
}

export const notEmpty = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined
}

export const rgba = (hexCode: string, alpha: number) => {
  const hexColor = (hexCode || '#2d313a').replace('#', '')
  const r = parseInt(hexColor.slice(0, 2), 16)
  const g = parseInt(hexColor.slice(2, 4), 16)
  const b = parseInt(hexColor.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const dateFormatter = (value: Date, format?: string) => moment(value).format(format || `YYYY/MM/DD HH:mm`)

export const getCurrentPrice = (plan: Partial<ProductPlan>) =>
  (plan.soldAt && moment() < moment(plan.soldAt) ? plan.salePrice : plan.listPrice) || 0

export const findCheapestPlan = (plans: Partial<ProductPlan>[]) =>
  plans
    .filter(plan => plan.publishedAt !== null)
    .reduce(
      (accum, plan) => (accum === null ? plan : getCurrentPrice(plan) < getCurrentPrice(accum) ? plan : accum),
      null as Partial<ProductPlan> | null,
    )

export const desktopViewMixin = (children: FlattenSimpleInterpolation) => css`
  @media (min-width: ${BREAK_POINT}px) {
    ${children}
  }
`

export const validationRegExp: { [fieldId: string]: RegExp } = {
  phone:
    /^((?:\+|00)[17](?: |-)?|(?:\+|00)[1-9]\d{0,2}(?: |-)?|(?:\+|00)1-\d{3}(?: |-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |-)[0-9]{3}(?: |-)[0-9]{4})|([0-9]{7}))$/,
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  phoneBarCode: /^\/{1}[0-9A-Z+-.]{7}$/,
  citizenCode: /^[A-Z]{2}[0-9]{14}$/,
}

export const validateContactInfo: (contactInfo: ContactInfo) => string[] = contactInfo => {
  const errorFields: string[] = []
  contactInfo.name.length === 0 && errorFields.push('name')
  ;(contactInfo.phone.length === 0 || !validationRegExp['phone']?.test(contactInfo.phone)) && errorFields.push('phone')
  ;(contactInfo.email.length === 0 || !validationRegExp['email']?.test(contactInfo.email)) && errorFields.push('email')
  return errorFields
}

export const convertPathName = (pathName: string) => {
  const pathList = pathName.split('/').filter(p => p !== '')
  return pathList.join('_') || '_'
}

export const isHTMLString = (str: string) =>
  !(str || '')
    // replace html tag with content
    .replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/gi, '')
    // remove remaining self closing tags
    .replace(/(<([^>]+)>)/gi, '')
    // remove extra space at start and end
    .trim()

export function zipWith<T, R>(a1: T[], a2: T[], f: (v1: T, v2: T) => R): R[] {
  const length = Math.min(a1.length, a2.length)
  const result: R[] = []

  for (let i = 0; i < length; i++) result[i] = f(a1[i], a2[i])

  return result
}

export function add(a: number, b: number) {
  return a + b
}

export function multiply(a: number, b: number) {
  return a * b
}

export type BanValidationOptions = {
  /**
   * validate `input` with old format only: https://www.fia.gov.tw/singlehtml/3?cntId=c4d9cff38c8642ef8872774ee9987283
   */
  applyOldRules?: boolean
}

export const checkUniformNumber = (input: string | number, options: BanValidationOptions = {}) => {
  const { applyOldRules = false } = options

  if (typeof input !== 'string' && typeof input !== 'number') return false

  /**
   * Example: 12345675
   * Step 1:
   * 1 * 1 = 1
   * 2 * 2 = 4
   * 3 * 1 = 3
   * 4 * 2 = 8
   * 5 * 1 = 5
   * 6 * 2 = 12
   * 7 * 4 = 28
   * 5 * 1 = 5
   *
   * Step 2:
   * 1 -> 1
   * 4 -> 4
   * 3 -> 3
   * 8 -> 8
   * 5 -> 5
   * 12 -> 1 + 2 = 3
   * 28 -> 2 + 8 = 10
   * 5 -> 5
   *
   * Step 3:
   * (1 + 4 + 3 + 8 + 5 + 3 + 10 + 5) % 10 = 9
   */

  const BAN_COEFFICIENTS = [1, 2, 1, 2, 1, 2, 4, 1]

  const n = input.toString()
  const regex = /^\d{8}$/

  if (!regex.test(n)) return false

  /**
   * Step 1: 先把統一編號的每個數字分別乘上對應的係數 (1, 2, 1, 2, 1, 2, 4, 1)
   * Step 2: 再把個別乘積的十位數與個位數相加，得出八個小於 10 的數字
   */

  const intRadix = 10
  const checksum = zipWith(
    BAN_COEFFICIENTS,
    n.split('').map(c => parseInt(c, intRadix)),
    multiply,
  )
    .map(n => (n % 10) + Math.floor(n / 10))
    .reduce(add, 0)

  /**
   * Step 3: 檢查把這 8 個數字相加之後計算此和除以 5 or 10 的餘數
   * Step 4:
   *  4-1: 若是餘數為 0，則為正確的統一編號
   *  4-2: 若是餘數為 9，且原統一編號的第七位是 7，則也為正確的統一編號
   */

  const divisor = applyOldRules ? 10 : 5

  return checksum % divisor === 0 || (parseInt(n.charAt(6), intRadix) === 7 && (checksum + 1) % divisor === 0)
}

export const getBackendServerError = (code: string, message: string) => {
  let errorObject: Error
  switch (code) {
    case 'E_INPUT':
      errorObject = new InputError(message)
      break
    case 'E_SESSION':
      errorObject = new SessionError(message)
      break
    case 'E_NO_MODULE':
      errorObject = new NoModuleError(message)
      break
    case 'E_SEND_EMAIL':
      errorObject = new SendEmailError(message)
      break
    case 'E_PASSWORD':
      errorObject = new PasswordError(message)
      break
    case 'E_NO_MEMBER':
      errorObject = new NoMemberError(message)
      break
    case 'E_BIND_DEVICE':
      errorObject = new BindDeviceError(message)
      break
    case 'E_LOGIN_DEVICE':
      errorObject = new LoginDeviceError(message)
      break
    default:
      errorObject = new Error(message)
  }
  return errorObject
}

export const getTrackingCookie = () => {
  const fbc = Cookies.get('_fbc') // dmpId
  const fbp = Cookies.get('_fbp') // dmpId
  const dmpId = Cookies.get('__eruid') // dmpId
  let utm = Cookies.get('utm')
  utm = utm ? JSON.parse(utm) : null
  const trackingCookie = {}
  if (utm) Object.assign(trackingCookie, { utm })
  if (dmpId) Object.assign(trackingCookie, { dmpId })
  if (fbc) Object.assign(trackingCookie, { fbc })
  if (fbp) Object.assign(trackingCookie, { fbp })
  return trackingCookie
}

export const currencyFormatter = (value?: number | string | null, currencyId?: string, coinUnit?: string) => {
  if (value === null || value === undefined) {
    return
  } else if (currencyId === 'LSC') {
    return `${value} ${coinUnit || currencyId}`
  } else {
    return `NT$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}
