import axios from 'axios'
import { StandardApiResponse } from './types'

type ApiErrorOptions = {
  code?: string
  status?: number
  data?: unknown
  details?: unknown
  isNetworkError?: boolean
  cause?: unknown
}

export class ApiError extends Error {
  code?: string
  status?: number
  data?: unknown
  details?: unknown
  isNetworkError: boolean
  cause?: unknown

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message)
    this.name = 'ApiError'
    this.code = options.code
    this.status = options.status
    this.data = options.data
    this.details = options.details ?? options.data
    this.isNetworkError = options.isNetworkError ?? false
    this.cause = options.cause

    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const readBackendError = (data: unknown): Partial<StandardApiResponse<unknown>> => {
  if (!isRecord(data)) {
    return {}
  }

  return {
    code: typeof data.code === 'string' ? data.code : undefined,
    message: typeof data.message === 'string' ? data.message : undefined,
    result: data.result,
  }
}

const getUnknownErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'Unknown error'
}

export const normalizeHttpError = (error: unknown): ApiError => {
  if (isApiError(error)) {
    return error
  }

  if (axios.isAxiosError(error)) {
    const backendError = readBackendError(error.response?.data)

    return new ApiError(backendError.message || error.message || 'Request failed', {
      code: backendError.code || error.code,
      status: error.response?.status,
      data: backendError.result ?? error.response?.data,
      details: error.response?.data,
      isNetworkError: Boolean(!error.response && error.request),
      cause: error,
    })
  }

  return new ApiError(getUnknownErrorMessage(error), { cause: error })
}
