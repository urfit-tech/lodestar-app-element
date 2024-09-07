import { defineMessages } from 'react-intl'

const commonMessages = {
  Embedded: defineMessages({
    iframe: { id: 'commonMessages.Embedded.iframe', defaultMessage: '請填入 iframe' },
  }),
  StyledBraftEditor: defineMessages({
    content: { id: 'commonMessages.StyledBraftEditor.content', defaultMessage: '內文' },
    title: { id: 'commonMessages.StyledBraftEditor.title', defaultMessage: '標題' },
  }),
}

export default commonMessages
