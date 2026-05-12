import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { AppProvider } from './AppContext'

const mockUseQuery = jest.fn()
const mockRefreshToken = jest.fn()

jest.mock('@apollo/client', () => ({
  gql: (strings: TemplateStringsArray) => strings.join(''),
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
}))

jest.mock('./AuthContext', () => ({
  useAuth: () => ({
    authToken: 'auth-token',
    refreshToken: mockRefreshToken,
  }),
}))

describe('AppProvider', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: true,
      refetch: jest.fn(),
    })
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
    mockUseQuery.mockReset()
    mockRefreshToken.mockReset()
  })

  it('does not request app secrets in the GET_APP bootstrap query', () => {
    act(() => {
      render(<AppProvider appId="demo-app" />, container)
    })

    expect(mockUseQuery.mock.calls[0][0]).toContain('query GET_APP')
    expect(mockUseQuery.mock.calls[0][0]).not.toContain('app_secrets')
  })
})
