import { useContext } from 'react'
import { useApp } from '../contexts/AppContext'
import LanguageContext from '../contexts/LanguageContext'
import { ResourceType } from './resource'

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
  switch (productType) {
    case 'ProgramPackage':
      return { type: 'program_package', target: productTarget }
    case 'ProgramPackagePlan':
      return { type: 'program_package_plan', target: productTarget }
    case 'Program':
      return { type: 'program', target: productTarget }
    case 'ProgramPlan':
      return { type: 'program_plan', target: productTarget }
    case 'Activity':
      return { type: 'activity', target: productTarget }
    default:
      return { type: 'unknown', target: productTarget }
  }
}
