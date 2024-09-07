import { ThemeOverride } from '@chakra-ui/react'
import { createContext } from 'react'
import { ApiProvider } from './ApiContext'
import { AppProvider } from './AppContext'
import { AppThemeProvider } from './AppThemeContext'
import { AuthProvider } from './AuthContext'
import { LanguageProvider } from './LanguageContext'

export const LodestarAppProvider: React.FC<{ appId: string; extend?: { chakraTheme?: ThemeOverride } }> = ({
  appId,
  children,
  extend,
}) => {
  const LodestarAppContext = createContext({ appId })
  return (
    <LodestarAppContext.Provider value={{ appId }}>
      <LanguageProvider>
        <AuthProvider appId={appId}>
          <ApiProvider appId={appId}>
            <AppProvider appId={appId}>
              <AppThemeProvider extendChakraTheme={extend?.chakraTheme}>{children}</AppThemeProvider>
            </AppProvider>
          </ApiProvider>
        </AuthProvider>
      </LanguageProvider>
    </LodestarAppContext.Provider>
  )
}
