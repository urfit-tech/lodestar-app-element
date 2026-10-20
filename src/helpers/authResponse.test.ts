import { expect, it } from '@jest/globals'
import { createIntl, createIntlCache } from 'react-intl'
import { normalizeHttpError } from '../services/http/error'
import { formatAuthError, readAuthResponse } from './authResponse'

const intl = createIntl({ locale: 'zh-TW', defaultLocale: 'zh-TW', messages: {} }, createIntlCache())
const format = intl.formatMessage
it.each([
  'E_SOCIAL_LOGIN',
  'E_APP_MISMATCH',
  'E_REDIRECT_URI',
  'E_CROSS_SITE',
  'E_DEVICE_CHALLENGE',
  'E_FORBIDDEN',
  'E_PROVIDER',
  'E_PROVIDER_TOKEN',
])('translates %s for both HTTP rejection and 2xx error body', (code: string) => {
  const body = { code, message: 'internal server detail' }
  expect(formatAuthError({ response: { status: 403, data: body } }, format)).toBe(formatAuthError(body, format))
  expect(formatAuthError(body, format)).not.toContain('internal server detail')
  expect(formatAuthError(body, format)).not.toContain('E_')
})
it('uses retryAfter on SUCCESS, 429 and normalized ApiError', () => {
  expect(formatAuthError({ code: 'SUCCESS', retryAfter: 3200 }, format)).toBe('請 3200 秒後再試')
  expect(formatAuthError({ response: { status: 429, data: { retryAfter: 90 } } }, format)).toBe('請 90 秒後再試')
  expect(formatAuthError({ status: 429, details: { code: 'E_TOO_MANY_ATTEMPTS', retryAfter: 75 } }, format)).toBe(
    '請 75 秒後再試',
  )
  expect(readAuthResponse({ response: { status: 429 } }).retryAfter).toBe(60)
})
it('handles legacy Error(code), unknown codes, malformed input and transport errors safely', () => {
  expect(formatAuthError(new Error('E_APP_MISMATCH'), format)).toBe(formatAuthError({ code: 'E_APP_MISMATCH' }, format))
  for (const error of [
    undefined,
    null,
    new Error('Request failed with status code 500'),
    { code: 'E_NEW' },
    { code: 'constructor' },
    { retryAfter: -1 },
  ]) {
    expect(formatAuthError(error, format)).toBe('操作失敗，請稍後再試')
  }
})

it('preserves Retry-After headers through the HTTP client ApiError wrapper', () => {
  const response = { status: 429, data: { code: 'E_TOO_MANY_ATTEMPTS' }, headers: { 'retry-after': '3599' } }
  expect(readAuthResponse({ response }).retryAfter).toBe(3599)
  expect(readAuthResponse({ status: 429, details: response.data, cause: { response } }).retryAfter).toBe(3599)
})

it('retains the real HTTP client normalized response and header metadata', () => {
  const error = normalizeHttpError({
    isAxiosError: true,
    response: {
      status: 429,
      data: { code: 'E_TOO_MANY_ATTEMPTS', message: 'limited' },
      headers: { 'retry-after': '3599' },
    },
  })
  expect(readAuthResponse(error)).toEqual({ code: 'E_TOO_MANY_ATTEMPTS', message: 'limited', retryAfter: 3599 })
})
