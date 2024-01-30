import Axios, { AxiosError } from 'axios'
import jwt from 'jsonwebtoken'
import parsePhoneNumber from 'libphonenumber-js'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import ReactGA from 'react-ga'
import { getBackendServerError } from '../helpers'
import { fetchCurrentGeolocation, getFingerPrintId, parsePayload } from '../hooks/util'
import { Permission } from '../types/app'
import { Member, UserRole } from '../types/data'
import { LodestarWindow } from '../types/lodestar.window'
declare let window: LodestarWindow

type ProviderType = 'facebook' | 'google' | 'line' | 'parenting' | 'commonhealth' | 'cw'

type AuthProps = {
  isAuthenticating: boolean
  isAuthenticated: boolean
  currentUserRole: UserRole
  currentMemberId: string | null
  authToken: string | null
  isFinishedSignUpProperty: boolean
  updateAuthToken?: (authToken: string | null) => void
  currentMember: Pick<Member, 'id' | 'name' | 'username' | 'email' | 'pictureUrl' | 'role' | 'options'> | null
  permissions: { [key in Permission]?: boolean }
  refreshToken?: () => Promise<void>
  register?: (data: {
    appId?: string
    username: string
    email: string
    password: string
    withoutLogin?: boolean
    isBusiness?: boolean
  }) => Promise<any>
  login?: (data: { account: string; password: string; accountLinkToken?: string }) => Promise<void>
  socialLogin?: (data: {
    provider: ProviderType
    providerToken: any
    accountLinkToken?: string
    isForceLogin?: boolean
  }) => Promise<void>
  switchMember?: (data: { memberId: string }) => Promise<void>
  logout?: () => Promise<void>
  sendSmsCode?: (data: { phoneNumber: string }) => Promise<void>
  verifySmsCode?: (data: { phoneNumber: string; code: string }) => Promise<void>
  forceLogin?: (data: { account: string; password: string; accountLinkToken?: string }) => Promise<void>
}

const defaultAuthContext: AuthProps = {
  isAuthenticating: (window as any).AUTH_TOKEN ? false : true,
  isAuthenticated: false,
  currentUserRole: 'anonymous',
  currentMemberId: null,
  authToken: null,
  currentMember: null,
  permissions: {},
  isFinishedSignUpProperty: true,
}

const initLodestarWindow = () => {
  window.lodestar = window.lodestar || {}
}

const AuthContext = createContext<AuthProps>(defaultAuthContext)
export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ appId: string }> = ({ appId, children }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(defaultAuthContext.isAuthenticating)
  const [authToken, setAuthToken] = useState<string | null>((window as any).AUTH_TOKEN || null)
  const payload = useMemo(() => (authToken ? parsePayload(authToken) : null), [authToken])

  useEffect(() => {
    if (payload) {
      try {
        const phoneNumber = payload.phoneNumber ? parsePhoneNumber(payload.phoneNumber, 'TW') : null
        const _window = window as any
        _window.insider_object = {
          user: {
            gdpr_optin: true,
            sms_optin: true,
            email: payload.email,
            phone_number: phoneNumber?.isValid() ? phoneNumber.number : payload.phoneNumber,
            email_optin: true,
          },
        }
        ReactGA.set({ userId: payload.sub })
      } catch (error) {
        process.env.NODE_ENV === 'development' && console.error(error)
      }
    }
  }, [payload])

  const refreshToken = useCallback(async () => {
    const fingerPrintId = await getFingerPrintId()
    const { ip, country, countryCode } = await fetchCurrentGeolocation()
    const {
      data: { code, result },
    } = await Axios.post(
      `${process.env.REACT_APP_API_BASE_ROOT}/auth/refresh-token`,
      { appId, fingerPrintId, geoLocation: { ip, country, countryCode } },
      {
        method: 'POST',
        withCredentials: true,
      },
    )
    if (code === 'SUCCESS') {
      setAuthToken(result.authToken)
    } else if (code === 'E_NO_DEVICE') {
      setAuthToken(null)
      alert('您已被登出，目前有其他裝置登入這組帳號')
    } else {
      setAuthToken(null)
    }
    setIsAuthenticating(false)
  }, [appId])

  const currentMember = payload && {
    id: payload.sub,
    name: payload.name,
    username: payload.username,
    email: payload.email,
    pictureUrl: payload.pictureUrl || null,
    role: payload.role as UserRole,
    options: payload.options || {},
  }

  initLodestarWindow()
  window.lodestar.getCurrentMember = () => currentMember
  window.lodestar.getDataLayerByEvent = (event: string) => (window as any).dataLayer.find((d: any) => d.event === event)

  return (
    <AuthContext.Provider
      value={{
        isAuthenticating,
        isAuthenticated: Boolean(authToken),
        currentUserRole: (payload?.role as UserRole) || 'anonymous',
        currentMemberId: payload?.sub || null,
        authToken,
        updateAuthToken: authToken => setAuthToken(authToken),
        isFinishedSignUpProperty: !!payload?.isFinishedSignUpProperty,
        currentMember,
        permissions:
          payload?.permissions?.reduce((accumulator: { [key: string]: boolean }, currentValue: string) => {
            accumulator[currentValue] = true
            return accumulator
          }, {}) || {},
        refreshToken,
        register: async data =>
          Axios.post(
            `${process.env.REACT_APP_API_BASE_ROOT}/auth/register`,
            {
              appId: data.appId || appId,
              username: data.username,
              email: data.email,
              password: data.password,
              isBusiness: data.isBusiness ?? false,
            },
            { withCredentials: true },
          ).then(({ data: { code, message, result } }) => {
            if (code === 'SUCCESS') {
              if (!data.withoutLogin) {
                setAuthToken(result.authToken)
              }
              try {
                const currentMemberId = jwt.decode(result.authToken)?.sub
                const phone = sessionStorage.getItem('phone')
                if (phone) {
                  process.env.REACT_APP_GRAPHQL_PH_ENDPOINT &&
                    Axios.post(
                      process.env.REACT_APP_GRAPHQL_PH_ENDPOINT,
                      {
                        query: `
                        mutation INSERT_MEMBER_PHONE_ONE($currentMemberId: String!, $phone: String!) {
                          insert_member_phone_one(object: { member_id: $currentMemberId, phone: $phone }) {
                            id
                          }
                        }
                    `,
                        variables: {
                          currentMemberId,
                          phone,
                        },
                      },
                      { headers: { Authorization: `Bearer ${result.authToken}` } },
                    )
                }

                const categoryIds: string[] = JSON.parse(sessionStorage.getItem('categoryIds') || '[]')
                const memberProperties: { propertyId?: string; value?: string }[] = JSON.parse(
                  sessionStorage.getItem('memberProperties') || '[]',
                )
                if (categoryIds.length) {
                  process.env.REACT_APP_GRAPHQL_PH_ENDPOINT &&
                    Axios.post(
                      process.env.REACT_APP_GRAPHQL_PH_ENDPOINT,
                      {
                        query: `
                        mutation INSERT_MEMBER_CATEGORIES($memberProperties: [member_property_insert_input!]!, $data: [member_category_insert_input!]!) {
                          insert_member_property(objects: $memberProperties) {
                            affected_rows
                          }
                          insert_member_category(objects: $data) {
                            affected_rows
                          }
                        }
                      `,
                        variables: {
                          memberProperties: memberProperties.map(v => ({
                            member_id: currentMemberId,
                            property_id: v.propertyId,
                            value: v.value,
                          })),
                          data: categoryIds.map((categoryId, index) => ({
                            member_id: currentMemberId,
                            category_id: categoryId,
                            position: index,
                          })),
                        },
                      },
                      { headers: { Authorization: `Bearer ${result.authToken}` } },
                    )
                }
                const star = sessionStorage.getItem('star')
                if (star) {
                  process.env.REACT_APP_GRAPHQL_PH_ENDPOINT &&
                    Axios.post(
                      process.env.REACT_APP_GRAPHQL_PH_ENDPOINT,
                      {
                        query: `
                        mutation SET_MEMBER_STAR($memberId: String!, $star: numeric!) {
                          update_member(where: {id: {_eq: $memberId}}, _set: {star: $star}) {
                            affected_rows
                          }
                        }                      
                      `,
                        variables: {
                          memberId: currentMemberId,
                          star: parseInt(star),
                        },
                      },
                      { headers: { Authorization: `Bearer ${result.authToken}` } },
                    )
                }
                return result.authToken
              } catch {}
            } else {
              setAuthToken(null)
              throw new Error(code)
            }
          }),
        login: async ({ account, password, accountLinkToken }) => {
          const {
            data: { code, message, result },
          } = await Axios.post(
            `${process.env.REACT_APP_API_BASE_ROOT}/auth/general-login`,
            { appId, account, password },
            { withCredentials: true },
          )
          if (code === 'SUCCESS') {
            setAuthToken(result.authToken)
            if (accountLinkToken && result.authToken) {
              window.location.assign(`/line-binding?accountLinkToken=${accountLinkToken}`)
            }
          } else if (code === 'I_RESET_PASSWORD') {
            window.location.assign(`/check-email?email=${account}&type=reset-password`)
          } else {
            setAuthToken(null)
            throw getBackendServerError(code, message)
          }
        },
        socialLogin: async ({ provider, providerToken, accountLinkToken, isForceLogin }) =>
          Axios.post(
            `${process.env.REACT_APP_API_BASE_ROOT}/auth/social-login`,
            {
              appId,
              provider,
              providerToken,
              isForceLogin,
            },
            { withCredentials: true },
          ).then(async ({ data: { code, message, result } }) => {
            if (code === 'SUCCESS') {
              setAuthToken(result.authToken)
              const decodedToken = parsePayload(result.authToken)
              if (!decodedToken) {
                throw new Error('no auth token')
              }
              if (accountLinkToken && result.authToken) {
                window.location.assign(`/line-binding?accountLinkToken=${accountLinkToken}`)
              }
            } else {
              setAuthToken(null)
              throw getBackendServerError(code, message)
            }
          }),
        switchMember: async ({ memberId }) => {
          return Axios.post(
            `${process.env.REACT_APP_API_BASE_ROOT}/auth/switch-member`,
            {
              memberId,
            },
            { withCredentials: true, headers: { Authorization: 'Bearer ' + authToken } },
          ).then(({ data: { code, message, result } }) => {
            if (code === 'SUCCESS') {
              setAuthToken(result.authToken)
            } else {
              throw new Error(code)
            }
          })
        },
        logout: async () => {
          localStorage.clear()
          window.location.assign(`${process.env.REACT_APP_API_BASE_ROOT}/auth/logout?redirect=${window.location.href}`)
        },
        sendSmsCode: async ({ phoneNumber }) =>
          Axios.post(
            `${process.env.REACT_APP_API_BASE_ROOT}/sms/send-code`,
            {
              appId,
              phoneNumber,
            },
            { withCredentials: true },
          ).then(({ data: { code, message, result } }) => {
            if (code !== 'SUCCESS') {
              throw new Error(code)
            }
          }),
        verifySmsCode: async ({ phoneNumber, code }) =>
          Axios.post(
            `${process.env.REACT_APP_API_BASE_ROOT}/sms/verify-code`,
            {
              appId,
              phoneNumber,
              code,
            },
            { withCredentials: true },
          ).then(({ data: { code, message, result } }) => {
            if (code !== 'SUCCESS' || !result?.codeValid) {
              throw new Error(code)
            }
          }),
        forceLogin: async ({ account, password, accountLinkToken }) => {
          return Axios.post(
            `${process.env.REACT_APP_API_BASE_ROOT}/auth/force-login`,
            { appId, account, password },
            { withCredentials: true },
          )
            .then(({ data: { code, result } }) => {
              if (code === 'SUCCESS') {
                setAuthToken(result.authToken)
                if (accountLinkToken && result.authToken) {
                  window.location.assign(`/line-binding?accountLinkToken=${accountLinkToken}`)
                }
              } else if (code === 'I_RESET_PASSWORD') {
                window.location.assign(`/check-email?email=${account}&type=reset-password`)
              } else {
                setAuthToken(null)
                throw new Error(code)
              }
            })
            .catch((error: AxiosError) => {
              throw error
            })
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
