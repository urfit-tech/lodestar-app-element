import { CraftLayout } from '../components/craft'

const LayoutPage = () => {
  return (
    <>
      <CraftLayout
        mobile={{
          padding: { p: '20' },
          margin: { ml: '20', mr: '20' },
          columnAmount: 1,
          columnRatio: [12],
          displayAmount: 3,
        }}
        desktop={{
          padding: { p: '20' },
          margin: { ml: '200', mr: '200' },
          columnAmount: 1,
          columnRatio: [12],
          displayAmount: 3,
        }}
      />
    </>
  )
}

export default LayoutPage