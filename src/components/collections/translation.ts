import { defineMessages } from 'react-intl'

const collectionsMessages = {
  '*': defineMessages({}),
  Collection: defineMessages({
    empty: { id: 'collections.Collection.empty', defaultMessage: '目前尚無相關資料' },
    error: { id: 'collections.Collection.error', defaultMessage: '資料錯誤' },
  }),
  ProgramCollection: defineMessages({
    recentWatchedEmpty: {
      id: 'collections.ProgramCollection.recentWatchedEmpty',
      defaultMessage: '尚未開始觀看任何課程',
    },
  }),
}

export default collectionsMessages
