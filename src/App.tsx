import { Button } from '@chakra-ui/react'
import { Editor, Frame } from '@craftjs/core'
import { useState } from 'react'
import { BrowserRouter, Link, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import * as CraftResolvers from './components/common/CraftElement'
import CheckoutProductModal from './components/modals/CheckoutProductModal'
import { LodestarAppProvider } from './contexts/LodestarAppContext'
import ActivityPage from './pages/ActivityPage'
import CarouselPage from './pages/CarouselPage'
import ImagePage from './pages/ImagePage'
import LayoutPage from './pages/LayoutPage'
import MemberElementPage from './pages/MemberElementPage'
import ProgramContentCollectionPage from './pages/ProgramContentCollectionPage'
import ProgramElementPage from './pages/ProgramElementPage'
import ProgramPackagePage from './pages/ProgramPackagePage'
import ProjectElementPage from './pages/ProjectElementPage'
import TextPage from './pages/TextPage'

const routes = [
  { name: 'Home', path: '/', render: () => null },
  { name: 'Member', path: '/member', component: MemberElementPage },
  { name: 'Program', path: '/programs', component: ProgramElementPage },
  { name: 'Program content', path: '/program-contents', component: ProgramContentCollectionPage },
  { name: 'Program package', path: '/program-package', component: ProgramPackagePage },
  { name: 'Project', path: '/project', component: ProjectElementPage },
  { name: 'Activity', path: '/activity', component: ActivityPage },
  { name: 'Layout', path: '/layout', component: LayoutPage },
  { name: 'Text', path: '/text', component: TextPage },
  { name: 'Carousel', path: '/carousel', component: CarouselPage },
  { name: 'Image', path: '/image', component: ImagePage },
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
              <br />
              <CheckoutProductModal
                renderTrigger={({ onOpen, disable, isLoginAlert }) => (
                  <Button
                    colorScheme="primary"
                    disabled={disable}
                    onClick={() => {
                      if (isLoginAlert) return window.alert('請先登入')
                      onOpen?.()
                    }}
                  >
                    CheckoutProductModal
                  </Button>
                )}
                defaultProductId={`ProjectPlan_ddc70edd-3140-4463-a2ae-7ecf77984b06`}
              />
              <CheckoutProductModal
                renderTrigger={({ onOpen, disable, isLoginAlert }) => (
                  <Button
                    colorScheme="primary"
                    disabled={disable}
                    onClick={() => {
                      if (isLoginAlert) return window.alert('請先登入')
                      onOpen?.()
                    }}
                  >
                    CheckoutProductModal
                  </Button>
                )}
                defaultProductId={`ActivityTicket_f317da80-f4b8-4ae7-b7b8-06bd90547875`}
              />
            </QueryParamProvider>
          </BrowserRouter>
        </Frame>
      </Editor>
    </LodestarAppProvider>
  )
}

export default App
