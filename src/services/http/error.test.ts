import { ApiError, isApiError, normalizeHttpError } from './error'

describe('HTTP error helpers', () => {
  it('keeps existing ApiError instances', () => {
    const original = new ApiError('Original message', { code: 'E_ORIGINAL', status: 409 })

    expect(normalizeHttpError(original)).toBe(original)
    expect(isApiError(original)).toBe(true)
  })

  it('normalizes axios response errors', () => {
    const error = normalizeHttpError({
      isAxiosError: true,
      message: 'Request failed with status code 403',
      response: {
        status: 403,
        data: {
          code: 'E_FORBIDDEN',
          message: 'Forbidden',
          result: { reason: 'missing permission' },
        },
      },
    })

    expect(error).toBeInstanceOf(ApiError)
    expect(error.code).toBe('E_FORBIDDEN')
    expect(error.status).toBe(403)
    expect(error.message).toBe('Forbidden')
    expect(error.details).toEqual({
      code: 'E_FORBIDDEN',
      message: 'Forbidden',
      result: { reason: 'missing permission' },
    })
    expect(error.isNetworkError).toBe(false)
  })

  it('normalizes axios network errors', () => {
    const error = normalizeHttpError({
      isAxiosError: true,
      message: 'Network Error',
      request: {},
    })

    expect(error).toBeInstanceOf(ApiError)
    expect(error.message).toBe('Network Error')
    expect(error.isNetworkError).toBe(true)
  })

  it('normalizes unknown thrown values', () => {
    const error = normalizeHttpError('broken')

    expect(error).toBeInstanceOf(ApiError)
    expect(error.message).toBe('broken')
    expect(error.isNetworkError).toBe(false)
  })
})
