import { defineMessages } from 'react-intl'

const cardsMessages = {
  ReferrerCard: defineMessages({
    defaultName: { id: 'card.referrerCard.defaultName', defaultMessage: '陳慕天' },
    defaultTitle: { id: 'card.referrerCard.defaultTitle', defaultMessage: '共同創辦人' },
    defaultDescription: {
      id: 'card.referrerCard.defaultDescription',
      defaultMessage: '設計，是這個世代必備的溝通手段，很高興看到一個源自網路社群的設計學院誕生！',
    },
  }),
  DialogCard: defineMessages({
    title: { id: 'card.dialog.title', defaultMessage: '行銷' },
    description: {
      id: 'card.dialog.description',
      defaultMessage:
        '本身非本科生，但目前有在業界從事網頁設計實習工作。對於網頁的知識和技能都是靠高中補習遙遠的記憶和零散的自學，但一直沒有融會貫通的感覺，每個功能都只是似懂非懂，搞不太清楚“為什麼要這樣做”，無法全靠自己刻出一個完整的頁面。',
    },
    name: { id: 'card.dialog.name', defaultMessage: 'Letitia' },
  }),
}

export default cardsMessages
