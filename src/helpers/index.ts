import axios, { AxiosRequestConfig } from 'axios'
import moment from 'moment'
import queryString from 'query-string'
import { css, FlattenSimpleInterpolation } from 'styled-components'
import { BREAK_POINT } from '../components/common/Responsive'
import { ContactInfo } from '../types/checkout'
import { ProductPlan } from '../types/data'

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

export const checkUniformNumber = (uniformNumber: string | number) => {
  let cx: number[] = []
  cx[0] = 1
  cx[1] = 2
  cx[2] = 1
  cx[3] = 2
  cx[4] = 1
  cx[5] = 2
  cx[6] = 4
  cx[7] = 1

  const cc = (n: number) => {
    if (n > 9) {
      var s: string = n + ''
      let n1: number = Number(s.substring(0, 1)) * 1
      let n2: number = Number(s.substring(1, 2)) * 1
      n = n1 + n2
    }
    return n
  }

  let totalSum = 0
  if (uniformNumber.toString().length !== 8) return false
  let splitNum: string[] = uniformNumber.toString().split('')
  for (let i = 0; i <= 7; i++) {
    totalSum += cc(Number(splitNum[i]) * cx[i])
  }
  if (totalSum % 10 === 0) return true
  else if (splitNum[6] === '7' && (totalSum + 1) % 10 === 0) return true
  else return false
}
