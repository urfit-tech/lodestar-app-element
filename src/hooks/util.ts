import { useContext, useMemo } from 'react'
import { useApp } from '../contexts/AppContext'
import LanguageContext from '../contexts/LanguageContext'
import { ResourceType } from './resource'

// TODO: should be context
export const useTappay = () => {
  const TPDirect = (window as any)['TPDirect']
  const { settings } = useApp()

  useMemo(() => {
    settings['tappay.app_id'] &&
      settings['tappay.app_key'] &&
      TPDirect &&
      TPDirect.setupSDK(
        settings['tappay.app_id'],
        settings['tappay.app_key'],
        settings['tappay.dry_run'] === 'true' ? 'sandbox' : 'production',
      )
  }, [])

  return { TPDirect }
}

export const useCurrency = (currencyId?: string, coinUnit?: string) => {
  const { locale } = useContext(LanguageContext)
  const { currencies, settings } = useApp()

  const formatCurrency = (value: number) => {
    const currentCurrencyId = currencyId || settings['currency_id'] || 'TWD'
    const currency = currencies[currentCurrencyId]

    if (currentCurrencyId === 'LSC') {
      return value + ' ' + settings['coin.unit'] || coinUnit || 'Coins'
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
