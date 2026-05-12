import { ApiError } from './error'
import { StandardApiResponse } from './types'

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

export const isStandardApiResponse = <T = unknown>(value: unknown): value is StandardApiResponse<T> =>
  isRecord(value) && typeof value.code === 'string' && 'result' in value

export const unwrapApiResponse = <T>(response: unknown): T => {
  if (!isStandardApiResponse<T>(response)) {
    throw new ApiError('Malformed API response', {
      details: response,
    })
  }

  if (response.code === 'SUCCESS') {
    return response.result
  }

  throw new ApiError(response.message || response.code || 'Request failed', {
    code: response.code,
    data: response.result,
    details: response,
  })
}
