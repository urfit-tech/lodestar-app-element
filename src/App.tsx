import { Editor, Frame } from '@craftjs/core'
import React from 'react'
import { BrowserRouter, Link, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import * as CraftResolvers from './components/craft'
import { LodestarAppProvider } from './contexts/LodestarAppContext'
import ProgramCollectionPage from './pages/ProgramCollectionPage'

const routes = [
  { name: 'Home', path: '/', render: () => null },
  { name: 'Program collection', path: '/programs', component: ProgramCollectionPage },
]
const App: React.VFC = () => {
  if (!process.env.REACT_APP_ID) {
    return <div>REACT_APP_ID is undefined</div>
  }
  return (
    <LodestarAppProvider appId={process.env.REACT_APP_ID}>
      <Editor resolver={CraftResolvers}>
        <Frame>
          <BrowserRouter>
            <QueryParamProvider ReactRouterRoute={Route}>
              <div className="p-5">
                <ul>
                  {routes.map(route => (
                    <Link key={route.path} to={route.path}>
                      <li>{route.name}</li>
                    </Link>
                  ))}
                </ul>
              </div>
              {routes.map(route => (
                <Route key={route.path} path={route.path} render={route.render} component={route.component} />
              ))}
            </QueryParamProvider>
          </BrowserRouter>
        </Frame>
      </Editor>
    </LodestarAppProvider>
  )
}

export default App
