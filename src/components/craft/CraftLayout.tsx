import { UserComponent } from '@craftjs/core'
import { CraftLayoutProps } from '../../types/craft'
import { Craftize } from '../common'
import Layout from '../common/Layout'

const CraftLayout: UserComponent<{
  desktop: CraftLayoutProps
  mobile: CraftLayoutProps
}> = ({ desktop, mobile, children }) => {
  const CraftElement = Craftize(Layout)
  return (
    <CraftElement
      customStyle={{
        type: 'grid',
        mobile,
        desktop,
      }}
    >
      {children}
    </CraftElement>
  )
}

export default CraftLayout
