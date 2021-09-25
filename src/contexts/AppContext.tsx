import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React, { createContext, useContext, useEffect } from 'react'
import hasura from '../hasura'
import { Module } from '../types/data'
import { useAuth } from './AuthContext'

type NavProps = {
  id: string
  block: string
  position: number
  label: string
  icon: string | null
  href: string
  external: boolean
  locale: string
  tag: string | null
}

export type AppNavProps = NavProps & {
  subNavs: NavProps[]
}

type AppProps = {
  loading: boolean
  id: string
  name: string
  title: string | null
  description: string | null
  enabledModules: {
    [key in Module]?: boolean
  }
  navs: AppNavProps[]
  settings: {
    [key: string]: string
  } & {
    'payment.perpetual.default_gateway'?: undefined
    'payment.perpetual.default_gateway_method'?: undefined
    'payment.subscription.default_gateway'?: undefined
  }
  currencyId: string
  currencies: {
    [currencyId: string]: { id: string; label: string | null; unit: string | null; minorUnits: number | null }
  }
}

const defaultAppProps: AppProps = {
  loading: true,
  id: '',
  name: '',
  title: null,
  description: null,
  enabledModules: {},
  navs: [],
  settings: {},
  currencyId: 'TWD',
  currencies: {},
}

const AppContext = createContext<AppProps>(defaultAppProps)
export const useApp = () => useContext(AppContext)

export const AppProvider: React.FC<{ appId: string }> = ({ appId, children }) => {
  const { authToken, refreshToken } = useAuth()
  const { data } = useQuery<hasura.GET_APP, hasura.GET_APPVariables>(
    gql`
      query GET_APP($appId: String!) {
        currency {
          id
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
        }
      }
    `,
    {
      variables: { appId },
      context: { important: true },
    },
  )

  const settings = Object.fromEntries(data?.app_by_pk?.app_settings.map(v => [v.key, v.value]) || [])

  const app: AppProps = React.useMemo(
    () =>
      data?.app_by_pk
        ? {
            loading: false,
            id: data.app_by_pk.id,
            name: data.app_by_pk.name || '',
            title: data.app_by_pk.title,
            description: data.app_by_pk.description,
            enabledModules: Object.fromEntries(data.app_by_pk.app_modules.map(v => [v.module_id, true]) || []),
            navs: data.app_by_pk.app_navs.map(appNav => ({
              id: appNav.id,
              block: appNav.block,
              position: appNav.position,
              label: appNav.label,
              icon: appNav.icon,
              href: appNav.href,
              external: appNav.external,
              locale: appNav.locale,
              tag: appNav.tag,
              subNavs: appNav.sub_app_navs.map(v => ({
                id: v.id,
                block: v.block,
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
            currencyId: settings['currency_id'] || 'TWD',
            currencies: Object.fromEntries(
              data.currency.map(v => [v.id, { id: v.id, label: v.label, unit: v.unit, minorUnits: v.minor_units }]),
            ),
          }
        : defaultAppProps,
    [data?.app_by_pk, data?.currency, settings],
  )

  useEffect(() => {
    if (!authToken) {
      refreshToken?.()
    }
  }, [appId, authToken, refreshToken])

  return <AppContext.Provider value={app}>{children}</AppContext.Provider>
}
