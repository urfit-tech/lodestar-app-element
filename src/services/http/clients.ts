import { createHttpClient } from './factory'
import { HttpClientOptions } from './types'

export const resolveAppBackendBaseUrl = (): string | undefined => process.env.REACT_APP_API_BASE_ROOT

export const resolveLodestarServerBaseUrl = (): string | undefined => process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT

export const resolveKolableServerBaseUrl = (): string | undefined => process.env.REACT_APP_KOLABLE_SERVER_ENDPOINT

type ClientFactoryOptions = Omit<HttpClientOptions, 'baseURL'> & { baseURL?: string }

const resolveClientOptions = (baseURL: string | undefined, options: ClientFactoryOptions = {}): HttpClientOptions => ({
  ...options,
  baseURL: options.baseURL ?? baseURL,
})

export const createAppBackendClient = (options: ClientFactoryOptions = {}) =>
  createHttpClient(resolveClientOptions(resolveAppBackendBaseUrl(), options))

export const createLodestarServerClient = (options: ClientFactoryOptions = {}) =>
  createHttpClient(resolveClientOptions(resolveLodestarServerBaseUrl(), options))

export const createKolableServerClient = (options: ClientFactoryOptions = {}) =>
  createHttpClient(resolveClientOptions(resolveKolableServerBaseUrl(), options))
