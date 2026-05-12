import { gql, useQuery } from '@apollo/client'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import hasura from '../hasura'
import { fetchAppBootstrap } from '../services/bootstrap'
import { AppProps, NavProps } from '../types/app'
import { useAuth } from './AuthContext'

type AppContextProps = AppProps & {
  loading: boolean
  error?: Error
  refetch?: () => void
}

const defaultAppContextProps: AppContextProps = {
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
  currencyId: 'TWD',
  currencies: {},
  loading: true,
  options: {
    video_duration: 0,
    watched_seconds: 0,
  },
  endedAt: null,
}

const AppContext = createContext<AppContextProps>(defaultAppContextProps)
export const useApp = () => useContext(AppContext)

export const AppProvider: React.FC<{ appId: string }> = ({ appId, children }) => {
  const { authToken, refreshToken } = useAuth()
  const bootstrapRequestIdRef = useRef(0)
  const lastLoadedAppRef = useRef<AppContextProps | null>(null)
  const [bootstrapApp, setBootstrapApp] = useState<AppContextProps | null>(null)
  const [bootstrapLoading, setBootstrapLoading] = useState(true)
  const [bootstrapError, setBootstrapError] = useState<Error | undefined>()
  const loadBootstrapApp = useCallback(() => {
    const requestId = bootstrapRequestIdRef.current + 1
    bootstrapRequestIdRef.current = requestId

    setBootstrapApp(current => (current?.id === appId ? current : null))
    setBootstrapLoading(true)
    setBootstrapError(undefined)

    return fetchAppBootstrap(appId)
      .then(app => {
        if (bootstrapRequestIdRef.current !== requestId) {
          return
        }
        setBootstrapApp({ ...app, loading: false })
      })
      .catch(error => {
        if (bootstrapRequestIdRef.current !== requestId) {
          return
        }
        setBootstrapError(error instanceof Error ? error : new Error(String(error)))
      })
      .finally(() => {
        if (bootstrapRequestIdRef.current === requestId) {
          setBootstrapLoading(false)
        }
      })
  }, [appId])

  const { data, loading, error, refetch } = useQuery<hasura.GET_APP, hasura.GET_APPVariables>(
    gql`
      query GET_APP($appId: String!) {
        currency {
          id
          name
          label
          unit
          minor_units
        }

        app_by_pk(id: $appId) {
          id
          org_id
          name
          title
          description
          app_modules {
            id
            module_id
          }
          app_plan_id
          app_navs(order_by: { position: asc }, where: { parent_id: { _is_null: true } }) {
            id
            block
            position
            label
            icon
            href
            external
            locale
            tag
            parent_id
            sub_app_navs(order_by: { position: asc }) {
              id
              block
              position
              label
              icon
              href
              external
              locale
              tag
              parent_id
            }
          }
          app_settings {
            key
            value
          }
          app_hosts(order_by: { priority: asc }) {
            host
          }
          options
          ended_at
        }
      }
    `,
    {
      variables: { appId },
      context: { important: true },
      skip: !authToken,
    },
  )
  const settings = useMemo(
    () => Object.fromEntries(data?.app_by_pk?.app_settings.map(v => [v.key, v.value]) || []),
    [data?.app_by_pk?.app_settings],
  )
  const hasuraApp: AppContextProps = useMemo(
    () =>
      data?.app_by_pk
        ? {
            loading,
            error,
            refetch,
            id: data.app_by_pk.id,
            orgId: data.app_by_pk.org_id || null,
            name: data.app_by_pk.name || '',
            title: data.app_by_pk.title || null,
            description: data.app_by_pk.description || null,
            host: data.app_by_pk.app_hosts?.[0]?.host || window.location.host,
            hosts: data?.app_by_pk?.app_hosts.map(v => v.host) || [],
            enabledModules: Object.fromEntries(data.app_by_pk.app_modules.map(v => [v.module_id, true]) || []),
            appPlanId: data?.app_by_pk.app_plan_id,
            navs: data.app_by_pk.app_navs.map(appNav => ({
              id: appNav.id,
              block: appNav.block as NavProps['block'],
              position: appNav.position,
              label: appNav.label,
              icon: appNav.icon || null,
              href: appNav.href,
              external: appNav.external,
              locale: appNav.locale,
              tag: appNav.tag || null,
              parentId: appNav.parent_id || null,
              subNavs: appNav.sub_app_navs.map(v => ({
                id: v.id,
                block: v.block as NavProps['block'],
                position: v.position,
                label: v.label,
                icon: v.icon || null,
                href: v.href,
                external: v.external,
                locale: v.locale,
                tag: v.tag || null,
                parentId: v.parent_id || null,
              })),
            })),
            settings,
            currencyId: settings['currency_id'] || 'TWD',
            currencies:
              data?.currency.reduce((accumulator, currency) => {
                accumulator[currency.id] = {
                  id: currency.id,
                  name: currency.id === 'LSC' && settings['coin.name'] ? settings['coin.name'] : currency.name,
                  label: currency.id === 'LSC' && settings['coin.label'] ? settings['coin.label'] : currency.label,
                  unit: currency.id === 'LSC' && settings['coin.unit'] ? settings['coin.unit'] : currency.unit,
                  minorUnits: currency.minor_units ? currency.minor_units : 0,
                }
                return accumulator
              }, {} as AppProps['currencies']) || {},
            options: data.app_by_pk.options,
            endedAt: data.app_by_pk.ended_at || null,
          }
        : defaultAppContextProps,
    [data?.app_by_pk, data?.currency, error, loading, refetch, settings],
  )

  const refetchApp = authToken ? refetch : () => void loadBootstrapApp()
  const app = hasuraApp.id ? hasuraApp : bootstrapApp

  if (app?.id) {
    lastLoadedAppRef.current = app
  }

  const appContextValue =
    !app?.id && lastLoadedAppRef.current?.id === appId
      ? {
          ...lastLoadedAppRef.current,
          loading: false,
          error: error || bootstrapError,
          refetch: refetchApp,
        }
      : app?.id
      ? {
          ...app,
          loading: false,
          error: error || bootstrapError,
          refetch: refetchApp,
        }
      : {
          ...defaultAppContextProps,
          loading: bootstrapLoading || Boolean(authToken && loading),
          error: error || bootstrapError,
          refetch: refetchApp,
        }

  useEffect(() => {
    loadBootstrapApp()
    return () => {
      bootstrapRequestIdRef.current += 1
    }
  }, [loadBootstrapApp])

  useEffect(() => {
    if (!authToken) {
      refreshToken?.()
    }
  }, [appId, authToken, refreshToken])

  return <AppContext.Provider value={appContextValue}>{children}</AppContext.Provider>
}
