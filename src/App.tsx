import React from 'react'
import Button from './components/Button'
import { LodestarAppProvider } from './contexts/LodestarAppContext'

const App: React.VFC = () => {
  if (!process.env.REACT_APP_ID) {
    return <div>REACT_APP_ID is undefined</div>
  }
  return (
    <LodestarAppProvider appId={process.env.REACT_APP_ID}>
      <Button size="lg" variant="outline">
        TEST
      </Button>
    </LodestarAppProvider>
  )
}

export default App
