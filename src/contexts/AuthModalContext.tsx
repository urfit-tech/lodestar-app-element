import React from 'react'

export const AuthModalContext = React.createContext<{
  visible: boolean
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>
}>({ visible: false })
