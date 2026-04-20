import { ThemeOverride } from '@chakra-ui/react'
import { ApiProvider } from '@lodestar/data-hasura/contexts/ApiProvider'
import { AppProvider } from '@lodestar/data-hasura/contexts/AppProvider'
import { createContext } from 'react'
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
      <AuthProvider appId={appId}>
        <ApiProvider appId={appId}>
          <AppProvider appId={appId}>
            <LanguageProvider>
              <AppThemeProvider extendChakraTheme={extend?.chakraTheme}>{children}</AppThemeProvider>
            </LanguageProvider>
          </AppProvider>
        </ApiProvider>
      </AuthProvider>
    </LodestarAppContext.Provider>
  )
}
