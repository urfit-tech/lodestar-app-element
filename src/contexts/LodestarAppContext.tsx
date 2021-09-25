import React from 'react'
import { ApiProvider } from './ApiContext'
import { AppProvider } from './AppContext'
import { AppThemeProvider } from './AppThemeContext'
import { AuthProvider } from './AuthContext'
import { LanguageProvider } from './LanguageContext'

export const LodestarAppProvider: React.FC<{ appId: string }> = ({ appId, children }) => {
  const LodestarAppContext = React.createContext({ appId })
  return (
    <LodestarAppContext.Provider value={{ appId }}>
      <AuthProvider appId={appId}>
        <ApiProvider appId={appId}>
          <AppProvider appId={appId}>
            <LanguageProvider>
              <AppThemeProvider>{children}</AppThemeProvider>
            </LanguageProvider>
          </AppProvider>
        </ApiProvider>
      </AuthProvider>
    </LodestarAppContext.Provider>
  )
}
