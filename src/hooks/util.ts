import { useToast } from '@chakra-ui/react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import Ajv, { JSONSchemaType } from 'ajv'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useApp } from '../contexts/AppContext'
import LanguageContext from '../contexts/LanguageContext'
import { codeMessages } from '../helpers/translation'
import { Member } from '../types/data'
import { IpApiResponseFail, IpApiResponseSuccess } from '../types/general'
import { ResourceType } from './resource'
const ajv = new Ajv()

// TODO: should be context
export const useTappay = () => {
  const _TPDirect = (window as any)['TPDirect']
  const { settings } = useApp()

  const TPDirect = useMemo(() => {
    settings['tappay.app_id'] &&
      settings['tappay.app_key'] &&
      _TPDirect &&
      _TPDirect.setupSDK(
        settings['tappay.app_id'],
        settings['tappay.app_key'],
        settings['tappay.dry_run'] === 'true' ? 'sandbox' : 'production',
      )
    return _TPDirect
  }, [_TPDirect, settings])

  return { TPDirect }
}

export const useCurrency = (currencyId?: string, coinUnit?: string) => {
  const { locale } = useContext(LanguageContext)
  const { currencies, settings } = useApp()

  const formatCurrency = (value: number) => {
    const currentCurrencyId = currencyId || settings['currency_id'] || 'TWD'
    const currency = currencies[currentCurrencyId]

    if (currentCurrencyId === 'LSC') {
      return `${value} ${settings['coin.unit'] || coinUnit || 'Coins'}`
    }

    return (
      value.toLocaleString(locale || navigator.language, {
        style: 'currency',
        currency: currentCurrencyId,
        maximumFractionDigits: currency?.['minorUnits'] || 0,
        minimumFractionDigits: 0,
      }) || ''
    )
  }

  return {
    formatCurrency,
  }
}

export const getCookie = (cookieName: string) => {
  const cookie: { [name: string]: string } = {}
  document.cookie.split(';').forEach(function (el) {
    let [key, value] = el.split('=')
    cookie[key.trim()] = value
  })
  return cookie[cookieName.trim()] || ''
}

export const getResourceByProductId = (productId: string): { type: ResourceType; target: string } => {
  const [productType, productTarget] = productId.split('_')
  var resourceType = productType
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase() as ResourceType
  return { type: resourceType, target: productTarget }
}

export const useToastMessage = () => {
  const { formatMessage } = useIntl()
  const toast = useToast()
  const toastMessage = (options: {
    title?: string
    status?: 'info' | 'warning' | 'success' | 'error'
    duration?: number | null
    position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left'
    responseCode?: string
  }) => {
    try {
      toast({
        title: options.responseCode
          ? `${formatMessage(codeMessages[options.responseCode as keyof typeof codeMessages])}`
          : options.title,
        status: options.status || 'success',
        duration: options.duration || 1500,
        position: options.position || 'top',
      })
    } catch (err) {
      alert(options.responseCode)
    }
  }
  return toastMessage
}

const fpPromise = FingerprintJS.load()
export const getFingerPrintId = async () => {
  const fp = await fpPromise
  const result = await fp.get()

  const fingerPrintId = getCookie('fingerPrintId')

  const visitorId = fingerPrintId.length > 0 ? fingerPrintId : result.visitorId
  return visitorId
}
export const fetchCurrentGeolocation = async () => {
  try {
    const getGeolocationRequest = await axios.get<IpApiResponseSuccess | IpApiResponseFail>(`https://ipapi.co/json/`)
    if (getGeolocationRequest.data?.error) {
      throw new Error(getGeolocationRequest.data.reason)
    }
    return {
      ip: getGeolocationRequest.data.ip,
      country: getGeolocationRequest.data.country_name,
      countryCode: getGeolocationRequest.data.country_code,
      error: null,
    }
  } catch (error) {
    return { ip: null, country: null, countryCode: null, error }
  }
}

export type AuthTokenPayload = {
  sub: string
  orgId?: string
  appId: string
  name: string
  username: string
  email: string
  phoneNumber?: string
  pictureUrl?: string
  role: string
  permissions: string[]
  options?: { [key: string]: any }
  isFinishedSignUpProperty?: boolean
  isBusiness?: boolean | null
  loggedInMembers?: Member[]
}

export const parsePayload = (authToken: string) => {
  const payload = jwt.decode(authToken)

  const schema: JSONSchemaType<AuthTokenPayload> = {
    type: 'object',
    properties: {
      sub: { type: 'string' },
      orgId: { type: 'string', nullable: true },
      appId: { type: 'string' },
      name: { type: 'string' },
      username: { type: 'string' },
      email: { type: 'string' },
      phoneNumber: { type: 'string', nullable: true },
      role: { type: 'string' },
      pictureUrl: { type: 'string', nullable: true },
      permissions: { type: 'array', items: { type: 'string' }, default: [] },
      options: { type: 'object', nullable: true },
      isFinishedSignUpProperty: { type: 'boolean', nullable: true },
      isBusiness: { type: 'boolean', nullable: true, default: false },
      loggedInMembers: { type: 'array', items: { type: 'object', required: [] }, nullable: true, default: [] },
    },
    required: [],
  }

  // validate is a type guard for MyData - type is inferred from schema type
  const validate = ajv.compile(schema)
  if (validate(payload)) {
    return payload
  } else {
    console.error(`validate error: ${validate.errors?.join('\n')}`)
    return null
  }
}
