import { IntlShape } from 'react-intl'
import { codeMessages } from './translation'

const record = (value: unknown): Record<string, any> =>
  typeof value === 'object' && value !== null ? (value as Record<string, any>) : {}

/** Shared contract: Axios rejection, normalized ApiError, legacy Error(code), or a 2xx response body. */
export const readAuthResponse = (error: unknown) => {
  const value = record(error)
  const response = record(value.response || record(value.cause).response)
  const data = record(response.data || value.details || value)
  const status = response.status || value.status
  const code =
    typeof data.code === 'string'
      ? data.code
      : typeof value.code === 'string'
      ? value.code
      : typeof value.message === 'string' && value.message.startsWith('E_')
      ? value.message
      : undefined
  const rawRetry =
    data.retryAfter ?? value.retryAfter ?? record(data.result).retryAfter ?? record(response.headers)['retry-after']
  const seconds = Number(rawRetry)
  return {
    code: code || (status === 429 ? 'E_TOO_MANY_ATTEMPTS' : undefined),
    message: typeof data.message === 'string' ? data.message : undefined,
    retryAfter:
      Number.isFinite(seconds) && seconds > 0
        ? Math.min(86400, Math.ceil(seconds))
        : status === 429 || code === 'E_TOO_MANY_ATTEMPTS'
        ? 60
        : undefined,
  }
}

export const formatAuthError = (error: unknown, formatMessage: IntlShape['formatMessage']): string => {
  const { code, retryAfter } = readAuthResponse(error)
  if (retryAfter) return formatMessage(codeMessages.E_RETRY_AFTER, { seconds: retryAfter })
  const descriptor =
    code && Object.prototype.hasOwnProperty.call(codeMessages, code)
      ? codeMessages[code as keyof typeof codeMessages]
      : codeMessages.E_AUTH_GENERIC
  // Never expose arbitrary server messages (or Axios status text) to users.
  return formatMessage(descriptor)
}
