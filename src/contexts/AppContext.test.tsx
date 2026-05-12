import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { AppProvider, useApp } from './AppContext'

const mockUseQuery = jest.fn()
const mockRefreshToken = jest.fn()
const mockFetchAppBootstrap = jest.fn()
const mockRefetch = jest.fn()
let mockAuthToken: string | null = 'auth-token'

jest.mock('@apollo/client', () => ({
  gql: (strings: TemplateStringsArray) => strings.join(''),
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
}))

jest.mock('../services/bootstrap', () => ({
  fetchAppBootstrap: (...args: unknown[]) => mockFetchAppBootstrap(...args),
}))

jest.mock('./AuthContext', () => ({
  useAuth: () => ({
    authToken: mockAuthToken,
    refreshToken: mockRefreshToken,
  }),
}))

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0))

const apiApp = {
  id: 'demo-app',
  orgId: null,
  name: 'API App',
  title: 'API Demo',
  description: 'API description',
  host: 'api.example.com',
  hosts: ['api.example.com'],
  enabledModules: { locale: true },
  appPlanId: 'default',
  navs: [],
  settings: { title: 'API title' },
  currencyId: 'TWD',
  currencies: {
    TWD: {
      id: 'TWD',
      name: 'Taiwan Dollar',
      label: 'NT$',
      unit: '元',
      minorUnits: 0,
    },
  },
  options: {
    video_duration: 0,
    watched_seconds: 0,
  },
  endedAt: null,
}

const hasuraAppData = {
  currency: [
    {
      id: 'TWD',
      name: 'Taiwan Dollar',
      label: 'NT$',
      unit: '元',
      minor_units: 0,
    },
  ],
  app_by_pk: {
    id: 'demo-app',
    org_id: null,
    name: 'Hasura App',
    title: 'Hasura Demo',
    description: 'Hasura description',
    app_modules: [{ id: 'module-1', module_id: 'locale' }],
    app_plan_id: 'default',
    app_navs: [],
    app_settings: [{ key: 'title', value: 'Hasura title' }],
    app_hosts: [{ host: 'hasura.example.com' }],
    options: {
      video_duration: 0,
      watched_seconds: 0,
    },
    ended_at: null,
  },
}

describe('AppProvider', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    mockAuthToken = 'auth-token'
    mockFetchAppBootstrap.mockResolvedValue(apiApp)
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: true,
      refetch: mockRefetch,
    })
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
    mockUseQuery.mockReset()
    mockRefreshToken.mockReset()
    mockFetchAppBootstrap.mockReset()
    mockRefetch.mockReset()
  })

  it('does not request app secrets in the GET_APP bootstrap query', async () => {
    await act(async () => {
      render(<AppProvider appId="demo-app" />, container)
      await flushPromises()
    })

    expect(mockUseQuery.mock.calls[0][0]).toContain('query GET_APP')
    expect(mockUseQuery.mock.calls[0][0]).not.toContain('app_secrets')
  })

  it('loads the public bootstrap API before an auth token exists and skips anonymous GET_APP', async () => {
    mockAuthToken = null
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      refetch: mockRefetch,
    })
    const snapshots: Array<{ id: string; loading: boolean; title?: string }> = []

    const Consumer = () => {
      const app = useApp()
      snapshots.push({
        id: app.id,
        loading: app.loading,
        title: app.settings.title,
      })
      return null
    }

    await act(async () => {
      render(
        <AppProvider appId="demo-app">
          <Consumer />
        </AppProvider>,
        container,
      )
      await flushPromises()
    })

    expect(mockUseQuery.mock.calls[0][1]).toMatchObject({ skip: true })
    expect(mockFetchAppBootstrap).toHaveBeenCalledWith('demo-app')
    expect(mockRefreshToken).toHaveBeenCalled()
    expect(snapshots[snapshots.length - 1]).toMatchObject({
      id: 'demo-app',
      loading: false,
      title: 'API title',
    })
  })

  it('keeps the API snapshot while authenticated GET_APP refreshes, then switches to Hasura data', async () => {
    mockAuthToken = null
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      refetch: mockRefetch,
    })
    const snapshots: Array<{ id: string; loading: boolean; title?: string }> = []

    const Consumer = () => {
      const app = useApp()
      snapshots.push({
        id: app.id,
        loading: app.loading,
        title: app.settings.title,
      })
      return null
    }

    await act(async () => {
      render(
        <AppProvider appId="demo-app">
          <Consumer />
        </AppProvider>,
        container,
      )
      await flushPromises()
    })

    expect(snapshots[snapshots.length - 1]).toMatchObject({
      id: 'demo-app',
      loading: false,
      title: 'API title',
    })

    mockAuthToken = 'auth-token'
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: true,
      refetch: mockRefetch,
    })

    await act(async () => {
      render(
        <AppProvider appId="demo-app">
          <Consumer />
        </AppProvider>,
        container,
      )
      await flushPromises()
    })

    expect(mockUseQuery.mock.calls[mockUseQuery.mock.calls.length - 1][1]).toMatchObject({ skip: false })
    expect(snapshots[snapshots.length - 1]).toMatchObject({
      id: 'demo-app',
      loading: false,
      title: 'API title',
    })

    mockUseQuery.mockReturnValue({
      data: hasuraAppData,
      loading: false,
      refetch: mockRefetch,
    })

    await act(async () => {
      render(
        <AppProvider appId="demo-app">
          <Consumer />
        </AppProvider>,
        container,
      )
      await flushPromises()
    })

    expect(snapshots[snapshots.length - 1]).toMatchObject({
      id: 'demo-app',
      loading: false,
      title: 'Hasura title',
    })
  })
})
