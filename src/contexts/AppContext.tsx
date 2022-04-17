import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { createContext, useContext, useEffect, useMemo } from 'react'
import hasura from '../hasura'
import { getCookie } from '../hooks/util'
import { AppProps, NavProps } from '../types/app'
import { useAuth } from './AuthContext'

type AppContextProps = AppProps & {
  loading: boolean
  error?: Error
  refetch?: () => void
}

const defaultAppContextProps: AppContextProps = {
  id: '',
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
}

const AppContext = createContext<AppContextProps>(defaultAppContextProps)
export const useApp = () => useContext(AppContext)

export const AppProvider: React.FC<{ appId: string }> = ({ appId, children }) => {
  const { currentMember } = useAuth()
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
            name: data.app_by_pk.name || '',
            title: data.app_by_pk.title,
            description: data.app_by_pk.description,
            host: data.app_by_pk.app_hosts.shift()?.host || window.location.host,
            hosts: data?.app_by_pk?.app_hosts.map(v => v.host) || [],
            enabledModules: Object.fromEntries(data.app_by_pk.app_modules.map(v => [v.module_id, true]) || []),
            navs: data.app_by_pk.app_navs.map(appNav => ({
              id: appNav.id,
              block: appNav.block as NavProps['block'],
              position: appNav.position,
              label: appNav.label,
              icon: appNav.icon,
              href: appNav.href,
              external: appNav.external,
              locale: appNav.locale,
              tag: appNav.tag,
              subNavs: appNav.sub_app_navs.map(v => ({
                id: v.id,
                block: v.block as NavProps['block'],
                position: v.position,
                label: v.label,
                icon: v.icon,
                href: v.href,
                external: v.external,
                locale: v.locale,
                tag: v.tag,
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
          }
        : defaultAppContextProps,
    [data?.app_by_pk, data?.currency, error, loading, refetch, secrets, settings],
  )

  useEffect(() => {
    if (!authToken) {
      refreshToken?.()
    }
  }, [appId, authToken, refreshToken])

  const enabledCW = Boolean(Number(settings['tracking.cw.enabled']))
  useEffect(() => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    !currentMember && (window as any).dataLayer.push({ event: 'clearMember', member: null })
  }, [currentMember])
  useEffect(() => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    currentMember &&
      (window as any).dataLayer.push({
        event: 'updateMember',
        member: {
          id: currentMember.id,
          email: currentMember.email,
        },
      })
  }, [currentMember, enabledCW])
  useEffect(() => {
    if (currentMember && enabledCW) {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({
        event: 'cwData',
        memberData: {
          id: currentMember.options[appId]?.id || '',
          social_id: currentMember.options[appId]?.social_id || '',
          uid: currentMember.options[appId]?.uid || '',
          uuid: currentMember.options[appId]?.uuid || '',
          env:
            window.location.href.includes('local') ||
            window.location.href.includes('dev') ||
            window.location.href.includes('127.0.0.1')
              ? 'develop'
              : 'prod',
          email: currentMember.email,
          dmp_id: getCookie('__eruid'),
          salesforce_id: currentMember.options[appId]?.salesforce_id || '',
          member_type: '會員',
        },
      })
    }
  }, [appId, currentMember, enabledCW])

  return <AppContext.Provider value={app}>{children}</AppContext.Provider>
}
