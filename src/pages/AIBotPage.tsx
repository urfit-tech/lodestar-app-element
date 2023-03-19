import { Element } from '@craftjs/core'
import { CraftAIBot, CraftSection } from '../components/common/CraftElement'

const AIBotPage: React.VFC = () => {
  return (
    <Element id="Section" is={CraftSection} canvas customStyle={{ padding: 0 }}>
      <Element
        is={CraftAIBot}
        temperature={1}
        system="你是一位人資，請根據以下問答撰寫求職信（Cover letter）"
        assistants={[
          { label: '你的名字', content: '你的名字是？', placeholder: '姓名' },
          { label: '想申請的公司名稱', content: '想申請的公司名稱', placeholder: '公司名稱', required: true },
          { label: '職位名稱', content: '職位名稱', placeholder: '公司名稱', required: true },
        ]}
        submitText="送出"
      />
    </Element>
  )
}

export default AIBotPage
