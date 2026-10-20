import { expect, it, jest } from '@jest/globals'
import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { readAuthResponse } from '../helpers/authResponse'
import { AuthProvider, useAuth } from './AuthContext'

const mockPost = jest.fn()
jest.mock('../services/http', () => ({
  createAppBackendClient: () => ({ post: (...args: any[]) => mockPost(...args) }),
}))
jest.mock('../helpers', () => ({
  getBackendServerError: (code: string, message: string) => Object.assign(new Error(message), { code }),
}))
jest.mock('../hooks/util', () => ({
  getFingerPrintId: async () => 'fingerprint',
  fetchCurrentGeolocation: async () => ({}),
  parsePayload: () => ({ sub: 'member', role: 'general-member' }),
}))
jest.mock('react-ga', () => ({ set: () => undefined }))
let auth: ReturnType<typeof useAuth>
const Consumer = () => {
  auth = useAuth()
  return <span>{auth.isAuthenticating ? 'loading' : auth.isAuthenticated ? 'signed in' : 'anonymous'}</span>
}
it('a rejected refresh clears authentication and always releases loading', async () => {
  ;(window as any).AUTH_TOKEN = 'old-token'
  mockPost.mockRejectedValue({ response: { status: 403, data: { code: 'E_CROSS_SITE' } } })
  const root = document.createElement('div')
  act(() => {
    ReactDOM.render(
      <AuthProvider appId="app">
        <Consumer />
      </AuthProvider>,
      root,
    )
  })
  await act(async () => {
    await auth.refreshToken?.()
  })
  expect(root.textContent).toBe('anonymous')
  expect(auth!.authToken).toBeNull()
  expect((window as any).AUTH_TOKEN).toBeNull()
  act(() => {
    ReactDOM.unmountComponentAtNode(root)
  })
})

it.each(['E_PROVIDER_TOKEN', 'E_PROVIDER', 'E_APP_MISMATCH', 'E_SOCIAL_LOGIN', 'E_TOO_MANY_ATTEMPTS'])(
  'social rejection preserves %s for the UI and clears a previous login',
  async (code: string) => {
    ;(window as any).AUTH_TOKEN = 'old-token'
    const status = code === 'E_TOO_MANY_ATTEMPTS' ? 429 : code === 'E_SOCIAL_LOGIN' ? 409 : 403
    mockPost.mockRejectedValue({ response: { status, data: { code, message: 'backend detail', retryAfter: 123 } } })
    const root = document.createElement('div')
    act(() => {
      ReactDOM.render(
        <AuthProvider appId="app">
          <Consumer />
        </AuthProvider>,
        root,
      )
    })
    let failure: unknown
    await act(async () => {
      try {
        await auth.socialLogin?.({ provider: 'google', providerToken: 'token' })
      } catch (error) {
        failure = error
      }
    })
    expect(readAuthResponse(failure)).toMatchObject({ code, retryAfter: 123 })
    expect(root.textContent).toBe('anonymous')
    act(() => {
      ReactDOM.unmountComponentAtNode(root)
    })
  },
)

it('a legacy 200 refresh refusal cannot resurrect the bootstrap token on remount', async () => {
  ;(window as any).AUTH_TOKEN = 'old-token'
  mockPost.mockResolvedValue({ code: 'E_AUTH_TOKEN', result: null })
  const root = document.createElement('div')
  const mount = () =>
    ReactDOM.render(
      <AuthProvider appId="app">
        <Consumer />
      </AuthProvider>,
      root,
    )
  act(() => {
    mount()
  })
  await act(async () => {
    await auth.refreshToken?.()
  })
  expect(root.textContent).toBe('anonymous')
  expect((window as any).AUTH_TOKEN).toBeNull()
  act(() => {
    ReactDOM.unmountComponentAtNode(root)
  })
  act(() => {
    mount()
  })
  expect(root.textContent).toBe('anonymous')
  act(() => {
    ReactDOM.unmountComponentAtNode(root)
  })
})

it.each(['register', 'login', 'socialLogin', 'forceLogin'])(
  'preserves the full legacy 200 rate-limit body through %s',
  async (method: string) => {
    ;(window as any).AUTH_TOKEN = 'old-token'
    const body = { code: 'E_TOO_MANY_ATTEMPTS', message: 'limited', result: null, retryAfter: 3599 }
    mockPost.mockResolvedValue(body)
    const root = document.createElement('div')
    act(() => {
      ReactDOM.render(
        <AuthProvider appId="app">
          <Consumer />
        </AuthProvider>,
        root,
      )
    })
    let failure: unknown
    await act(async () => {
      try {
        await (auth as any)[method]({ account: 'test@example.com', password: 'password', provider: 'google' })
      } catch (error) {
        failure = error
      }
    })
    expect(readAuthResponse(failure)).toMatchObject({ code: body.code, retryAfter: 3599 })
    expect(root.textContent).toBe('anonymous')
    expect((window as any).AUTH_TOKEN).toBeNull()
    act(() => {
      ReactDOM.unmountComponentAtNode(root)
    })
  },
)
