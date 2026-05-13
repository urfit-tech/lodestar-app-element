import { AppProps } from '../../types/app'
import { resolveAppBackendBaseUrl } from '../http'
import { createHttpClient } from '../http/factory'

export type AppBootstrapPayload = AppProps

export const resolveAppBootstrapBaseUrl = (
  appBackendBaseUrl?: string,
  currentOrigin = window.location.origin,
): string => {
  if (!appBackendBaseUrl) {
    return currentOrigin
  }

  return new URL(appBackendBaseUrl, currentOrigin).origin
}

export const fetchAppBootstrap = (appId: string): Promise<AppBootstrapPayload> =>
  createHttpClient({ baseURL: resolveAppBootstrapBaseUrl(resolveAppBackendBaseUrl()) }).get<AppBootstrapPayload>(
    '/api/v3/bootstrap',
    {
      params: { appId },
    },
  )
