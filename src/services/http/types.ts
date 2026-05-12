import { AxiosRequestConfig } from 'axios'

export type GetAuthToken = () => string | null | undefined

export type StandardApiResponse<T> = {
  code: string
  message?: string | null
  result: T
}

export type HttpClientOptions = {
  baseURL?: string
  getAuthToken?: GetAuthToken
  timeoutMs?: number
  withCredentials?: boolean
}

export type HttpRequestConfig<TData = unknown> = AxiosRequestConfig<TData> & {
  url: string
}

export type HttpClient = {
  request: <T = unknown, TData = unknown>(config: HttpRequestConfig<TData>) => Promise<T>
  requestResult: <T = unknown, TData = unknown>(config: HttpRequestConfig<TData>) => Promise<T>
  get: <T = unknown>(url: string, config?: Omit<HttpRequestConfig, 'url' | 'method'>) => Promise<T>
  post: <T = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: Omit<HttpRequestConfig<TData>, 'url' | 'method' | 'data'>,
  ) => Promise<T>
  postResult: <T = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: Omit<HttpRequestConfig<TData>, 'url' | 'method' | 'data'>,
  ) => Promise<T>
}
