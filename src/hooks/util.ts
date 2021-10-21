import { useContext } from 'react'
import { useApp } from '../contexts/AppContext'
import LanguageContext from '../contexts/LanguageContext'

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
