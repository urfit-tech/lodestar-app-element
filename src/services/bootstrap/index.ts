import { AppProps } from '../../types/app'
import { createAppBackendClient } from '../http'

export type AppBootstrapPayload = AppProps

export const fetchAppBootstrap = (appId: string): Promise<AppBootstrapPayload> =>
  createAppBackendClient().get<AppBootstrapPayload>('/api/v3/bootstrap', {
    params: { appId },
  })
