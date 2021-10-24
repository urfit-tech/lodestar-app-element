import { CraftText } from '../components/common/CraftElement'

const TextPage = () => {
  return (
    <>
      <CraftText content="this is title" as="h1" customStyle={{ fontSize: '24px' }} />
      <CraftText
        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic rem ipsam iusto itaque tenetur eum tempora? Quas
        iste in aliquid sequi soluta a! Dignissimos praesentium quae blanditiis consequuntur. Delectus, labore?"
      />
    </>
  )
}

export default TextPage
