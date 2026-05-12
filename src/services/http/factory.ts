import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios'
import { normalizeHttpError } from './error'
import { unwrapApiResponse } from './response'
import { HttpClient, HttpClientOptions, HttpRequestConfig, StandardApiResponse } from './types'

const DEFAULT_TIMEOUT_MS = 15000

export const createHttpClient = (options: HttpClientOptions = {}): HttpClient => {
  if (!options.baseURL) {
    throw new Error('HTTP client baseURL is required')
  }

  const instance = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    withCredentials: options.withCredentials,
  })

  instance.interceptors.request.use(config => {
    const token = options.getAuthToken?.()

    if (token) {
      const headers = AxiosHeaders.from(config.headers)
      headers.set('Authorization', `Bearer ${token}`)
      config.headers = headers
    }

    return config
  })

  const request = async <T = unknown, TData = unknown>(config: HttpRequestConfig<TData>): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await instance.request<T, AxiosResponse<T>, TData>(
        config as AxiosRequestConfig<TData>,
      )
      return response.data
    } catch (error) {
      throw normalizeHttpError(error)
    }
  }

  const requestResult = async <T = unknown, TData = unknown>(config: HttpRequestConfig<TData>): Promise<T> => {
    const data = await request<StandardApiResponse<T>, TData>(config)
    return unwrapApiResponse(data)
  }

  return {
    request,
    requestResult,
    get: (url, config) => request({ ...config, method: 'GET', url }),
    post: (url, data, config) => request({ ...config, data, method: 'POST', url }),
    postResult: (url, data, config) => requestResult({ ...config, data, method: 'POST', url }),
  }
}
