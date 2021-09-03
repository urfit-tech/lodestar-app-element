import React, { createContext, useContext } from 'react'

type AppContextProps = {
  id: string
}

const defaultContextValue: AppContextProps = {
  id: '',
}

const AppContext = createContext<AppContextProps>(defaultContextValue)

export const AppProvider: React.FC<{
  appId: string
}> = ({ appId, children }) => {
  return <AppContext.Provider value={{ id: appId }}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
