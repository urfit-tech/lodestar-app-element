import { createContext } from 'react'
import { ApiProvider } from './ApiContext'
import { AppProvider } from './AppContext'
import { AppThemeProvider } from './AppThemeContext'
import { AuthProvider } from './AuthContext'
import { LanguageProvider } from './LanguageContext'
import { TrackingProvider } from './TrackingContext'

export const LodestarAppProvider: React.FC<{ appId: string }> = ({ appId, children }) => {
  const LodestarAppContext = createContext({ appId })
  return (
    <LodestarAppContext.Provider value={{ appId }}>
      <AuthProvider appId={appId}>
        <ApiProvider appId={appId}>
          <AppProvider appId={appId}>
            <LanguageProvider>
              <AppThemeProvider>
                <TrackingProvider>{children}</TrackingProvider>
              </AppThemeProvider>
            </LanguageProvider>
          </AppProvider>
        </ApiProvider>
      </AuthProvider>
    </LodestarAppContext.Provider>
  )
}
