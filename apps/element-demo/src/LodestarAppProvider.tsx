import { ThemeOverride } from '@chakra-ui/react'
import { createContext } from 'react'
import { AppThemeProvider, AuthProvider, LanguageProvider } from '@lodestar/contexts'
// Import from specific subpaths to avoid pulling the whole data-hasura
// barrel (including hasura.d.ts, ~150K lines) into the element-demo
// compilation unit and blowing up TS union-representation limits (TS2590)
// in downstream chakra-heavy files.
import { ApiProvider } from '@lodestar/data-hasura/contexts/ApiProvider'
import { AppProvider } from '@lodestar/data-hasura/contexts/AppProvider'

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
