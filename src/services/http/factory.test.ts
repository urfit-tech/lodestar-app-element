import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiError } from './error'
import { createHttpClient } from './factory'

const createAdapter =
  <T>(data: T, onConfig?: (config: AxiosRequestConfig) => void) =>
  async (config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    onConfig?.(config)

    return {
      config,
      data,
      headers: {},
      status: 200,
      statusText: 'OK',
    }
  }

const readAuthorizationHeader = (headers: unknown): unknown => {
  if (headers && typeof (headers as { get?: unknown }).get === 'function') {
    return (headers as { get: (name: string) => unknown }).get('Authorization')
  }

  return (headers as { Authorization?: unknown } | undefined)?.Authorization
}

describe('HTTP client factory', () => {
  it('throws when baseURL is missing', () => {
    expect(() => createHttpClient()).toThrow('HTTP client baseURL is required')
  })

  it('calls token getter at request time and sets Authorization header', async () => {
    let token = 'token_before_request'
    const getAuthToken = jest.fn(() => token)
    const seenHeaders: unknown[] = []
    const client = createHttpClient({
      baseURL: 'https://api.example.com',
      getAuthToken,
    })

    token = 'token_at_request'

    await client.get('/orders', {
      adapter: createAdapter({ ok: true }, config => {
        seenHeaders.push(config.headers)
      }),
    })

    expect(getAuthToken).toHaveBeenCalledTimes(1)
    expect(readAuthorizationHeader(seenHeaders[0])).toBe('Bearer token_at_request')
  })

  it('returns raw response data without unwrapping', async () => {
    const client = createHttpClient({ baseURL: 'https://api.example.com' })

    await expect(
      client.request({
        adapter: createAdapter({ code: 'SUCCESS', result: { id: 'order_1' } }),
        url: '/orders/order_1',
      }),
    ).resolves.toEqual({ code: 'SUCCESS', result: { id: 'order_1' } })
  })

  it('preserves axios default timeout unless timeoutMs is explicitly provided', async () => {
    const defaultClient = createHttpClient({ baseURL: 'https://api.example.com' })
    const timeoutClient = createHttpClient({ baseURL: 'https://api.example.com', timeoutMs: 30000 })
    const seenTimeouts: unknown[] = []

    await defaultClient.get('/default-timeout', {
      adapter: createAdapter({ ok: true }, config => {
        seenTimeouts.push(config.timeout)
      }),
    })
    await timeoutClient.get('/custom-timeout', {
      adapter: createAdapter({ ok: true }, config => {
        seenTimeouts.push(config.timeout)
      }),
    })

    expect(seenTimeouts).toEqual([0, 30000])
  })

  it('unwraps standard backend responses with postResult', async () => {
    const client = createHttpClient({ baseURL: 'https://api.example.com' })

    await expect(
      client.postResult(
        '/orders',
        { id: 'order_1' },
        { adapter: createAdapter({ code: 'SUCCESS', result: { ok: true } }) },
      ),
    ).resolves.toEqual({ ok: true })
  })

  it('throws ApiError for malformed requestResult responses', async () => {
    const client = createHttpClient({ baseURL: 'https://api.example.com' })

    await expect(
      client.requestResult({
        adapter: createAdapter({ code: 'SUCCESS' }),
        url: '/orders/order_1',
      }),
    ).rejects.toBeInstanceOf(ApiError)
  })
})
