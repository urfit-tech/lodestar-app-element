import { CraftText } from '../components/common/CraftElement'
import { useTracking } from '../hooks/tracking'

const TextPage = () => {
  const { impress } = useTracking()
  return (
    <>
      <button
        onClick={() =>
          impress([
            {
              type: 'Activity',
              id: '66dccfad-4d91-4abf-8c2a-49d1f73709b5',
            },
            {
              type: 'ProgramPackage',
              id: '66dccfad-4d91-4abf-8c2a-49d1f73709b5',
            },
            {
              type: 'ProgramPackage',
              id: '17b7ece6-7bab-4875-a9e1-889c097e10f0',
            },
            {
              type: 'ProgramPackagePlan',
              id: 'ac843eb2-1cb1-45b8-afa7-aa8b32444abf',
            },
            {
              type: 'ProgramPackagePlan',
              id: '4b5d4176-a318-4715-a4b9-0c527f1e922a',
            },
            {
              type: 'ProgramPlan',
              id: '9f376014-55bf-44a1-8aab-62714eea9704',
            },
            {
              type: 'ProgramPlan',
              id: '0e353ec0-6a26-4ff6-95b5-500627b24427',
            },
            {
              type: 'Program',
              id: 'c08d6910-893a-419a-9df5-792727541dd1',
            },
            {
              type: 'Program',
              id: '496f5e67-7c62-406d-aa94-f001c1fadf02',
            },
          ])
        }
      >
        Impress
      </button>
      <CraftText content="this is title" as="h1" customStyle={{ fontSize: '24px' }} />
      <CraftText
        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic rem ipsam iusto itaque tenetur eum tempora? Quas
        iste in aliquid sequi soluta a! Dignissimos praesentium quae blanditiis consequuntur. Delectus, labore?"
      />
    </>
  )
}

export default TextPage
