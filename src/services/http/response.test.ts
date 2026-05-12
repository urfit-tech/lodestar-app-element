import { ApiError } from './error'
import { isStandardApiResponse, unwrapApiResponse } from './response'

describe('HTTP response helpers', () => {
  it('detects standard backend responses', () => {
    expect(isStandardApiResponse({ code: 'SUCCESS', result: { id: 'order_1' } })).toBe(true)
    expect(isStandardApiResponse({ result: { id: 'order_1' } })).toBe(false)
    expect(isStandardApiResponse(null)).toBe(false)
  })

  it('unwraps SUCCESS result payloads', () => {
    expect(unwrapApiResponse({ code: 'SUCCESS', message: 'ok', result: { link: 'https://example.com' } })).toEqual({
      link: 'https://example.com',
    })
  })

  it('throws ApiError for non-success backend responses', () => {
    try {
      unwrapApiResponse({ code: 'E_FORBIDDEN', message: 'Forbidden', result: { reason: 'missing permission' } })
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError)
      expect((error as ApiError).details).toEqual({
        code: 'E_FORBIDDEN',
        message: 'Forbidden',
        result: { reason: 'missing permission' },
      })
      return
    }

    throw new Error('Expected unwrapApiResponse to throw')
  })

  it('throws ApiError for malformed backend responses', () => {
    expect(() => unwrapApiResponse({ code: 'SUCCESS' })).toThrow(ApiError)
  })
})
