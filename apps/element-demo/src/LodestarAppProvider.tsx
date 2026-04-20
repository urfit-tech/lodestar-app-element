import { ThemeOverride } from '@chakra-ui/react'
import { createContext } from 'react'
import { AppThemeProvider, AuthProvider, LanguageProvider } from '@lodestar/contexts'
import { ApiProvider, AppProvider } from '@lodestar/data-hasura'

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
