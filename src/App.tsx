import { Editor, Frame } from '@craftjs/core'
import { useState } from 'react'
import { BrowserRouter, Link, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import * as CraftResolvers from './components/craft'
import { LodestarAppProvider } from './contexts/LodestarAppContext'
import ActivityPage from './pages/ActivityPage'
import LayoutPage from './pages/LayoutPage'
import ProgramCollectionPage from './pages/ProgramCollectionPage'
import ProgramContentCollectionPage from './pages/ProgramContentCollectionPage'
import ProgramPackagePage from './pages/ProgramPackagePage'

const routes = [
  { name: 'Home', path: '/', render: () => null },
  { name: 'Program collection', path: '/programs', component: ProgramCollectionPage },
  { name: 'Program content collection', path: '/program-contents', component: ProgramContentCollectionPage },
  { name: 'Program package', path: '/program-package', component: ProgramPackagePage },
  { name: 'Activity package', path: '/activity', component: ActivityPage },
  { name: 'Layout', path: '/layout', component: LayoutPage },
]
const App: React.VFC = () => {
  const [editing, setEditing] = useState(false)
  if (!process.env.REACT_APP_ID) {
    return <div>REACT_APP_ID is undefined</div>
  }
  return (
    <LodestarAppProvider appId={process.env.REACT_APP_ID}>
      <Editor enabled={editing} resolver={CraftResolvers}>
        <Frame>
          <BrowserRouter>
            <QueryParamProvider ReactRouterRoute={Route}>
              <div className="p-5">
                <label htmlFor="editing">
                  <input
                    className="mr-1"
                    type="checkbox"
                    checked={editing}
                    onChange={e => setEditing(Boolean(e.target.checked))}
                  />
                  <span>Editing</span>
                </label>
                <ul className="pl-3">
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
