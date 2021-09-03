import React, { useContext } from 'react'

type AuthProps = {
  isAuthenticating: boolean
  isAuthenticated: boolean
  authToken: string | null
}

const defaultAuthContext: AuthProps = {
  isAuthenticating: true,
  isAuthenticated: false,
  authToken: null,
}

const AuthContext = React.createContext<AuthProps>(defaultAuthContext)

export const AuthProvider: React.FC<{
  authToken: string | null
  isAuthenticating: boolean
}> = ({ authToken, isAuthenticating, children }) => {
  return (
    <AuthContext.Provider
      value={{
        isAuthenticating,
        isAuthenticated: Boolean(authToken),
        authToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
