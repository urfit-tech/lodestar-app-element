import { createContext, useContext } from 'react'
import { AppProps } from '@lodestar/types/app'

export type AppContextProps = AppProps & {
  loading: boolean
  error?: Error
  refetch?: () => void
}

export const defaultAppContextProps: AppContextProps = {
  id: '',
  orgId: null,
  name: '',
  title: null,
  description: null,
  host: '',
  hosts: [],
  enabledModules: {},
  appPlanId: '',
  navs: [],
  settings: {},
  secrets: {},
  currencyId: 'TWD',
  currencies: {},
  loading: true,
  options: {
    video_duration: 0,
    watched_seconds: 0,
  },
  endedAt: null,
}

export const AppContext = createContext<AppContextProps>(defaultAppContextProps)
export const useApp = () => useContext(AppContext)
