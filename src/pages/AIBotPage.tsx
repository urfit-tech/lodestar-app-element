import { Element } from '@craftjs/core'
import { useIntl } from 'react-intl'
import { CraftAIBot, CraftSection } from '../components/common/CraftElement'
import pagesMessages from './translation'

const AIBotPage: React.FC = () => {
  const { formatMessage } = useIntl()
  return (
    <Element id="Section" is={CraftSection} canvas customStyle={{ padding: 0 }}>
      <Element
        is={CraftAIBot}
        temperature={1}
        system={formatMessage(pagesMessages.AIBotPage.coverLetter)}
        assistants={[
          {
            label: formatMessage(pagesMessages.AIBotPage.nameLabel),
            content: formatMessage(pagesMessages.AIBotPage.nameContent),
            placeholder: formatMessage(pagesMessages.AIBotPage.namePlaceholder),
          },
          {
            label: formatMessage(pagesMessages.AIBotPage.applyCompanyName),
            content: formatMessage(pagesMessages.AIBotPage.applyCompanyName),
            placeholder: formatMessage(pagesMessages.AIBotPage.companyName),
            required: true,
          },
          {
            label: formatMessage(pagesMessages.AIBotPage.position),
            content: formatMessage(pagesMessages.AIBotPage.position),
            placeholder: formatMessage(pagesMessages.AIBotPage.positionPlaceholder),
            required: true,
          },
        ]}
        submitText={formatMessage(pagesMessages.AIBotPage.submit)}
      />
    </Element>
  )
}

export default AIBotPage
