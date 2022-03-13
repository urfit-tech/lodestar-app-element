import { defineMessages } from 'react-intl'

const inputMessages = {
  ContactInfoInput: defineMessages({
    contactInfo: { id: 'input.ContactInfoInput.contactInfo', defaultMessage: '聯絡資訊' },
    contactInfoDescription: {
      id: 'input.ContactInfoInput.contactInfoDescription',
      defaultMessage: '請填寫真實資料，填寫後不可更改，僅通知資訊與相關連繫使用',
    },
    name: { id: 'input.ContactInfoInput.name', defaultMessage: '姓名' },
    phone: { id: 'input.ContactInfoInput.phone', defaultMessage: '電話' },
    email: { id: 'input.ContactInfoInput.email', defaultMessage: 'email' },
    nameHelpText: { id: 'input.ContactInfoInput.name', defaultMessage: '請填寫姓名' },
    phoneHelpText: { id: 'input.ContactInfoInput.phoneHelpText', defaultMessage: '請確認電話格式' },
    emailHelpText: { id: 'input.ContactInfoInput.emailHelpText', defaultMessage: '請確認email格式' },
  }),
}

export default inputMessages
