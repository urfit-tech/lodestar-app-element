import { gql, useQuery } from '@apollo/client'
import { createContext, useContext, useEffect, useMemo } from 'react'
import hasura from '../hasura'
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
  endedAt: '',
}

const AppContext = createContext<AppContextProps>(defaultAppContextProps)
export const useApp = () => useContext(AppContext)

export const AppProvider: React.FC<{ appId: string }> = ({ appId, children }) => {
  const { authToken, refreshToken } = useAuth()
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
            }
          }
          app_settings {
            key
            value
          }
          app_secrets {
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
    },
  )
  const settings = useMemo(
    () => Object.fromEntries(data?.app_by_pk?.app_settings.map(v => [v.key, v.value]) || []),
    [data?.app_by_pk?.app_settings],
  )
  const secrets = useMemo(
    () => Object.fromEntries(data?.app_by_pk?.app_secrets.map(v => [v.key, v.value]) || []),
    [data?.app_by_pk?.app_secrets],
  )

  const app: AppContextProps = useMemo(
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
              })),
            })),
            settings,
            secrets,
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
    [data?.app_by_pk, data?.currency, error, loading, refetch, secrets, settings],
  )

  useEffect(() => {
    if (!authToken) {
      refreshToken?.()
    }
  }, [appId, authToken, refreshToken])

  return <AppContext.Provider value={app}>{children}</AppContext.Provider>
}
