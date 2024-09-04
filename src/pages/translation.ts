import { defineMessages } from 'react-intl'

const pagesMessages = {
  ProgramPackagePage: defineMessages({
    designerCore: {
      id: 'page.ProgramPackagePage.designerCore',
      defaultMessage: '設計師核心能力',
    },
  }),
  CheckoutPage: defineMessages({
    pleaseLogin: { id: 'page.CheckoutPage.pleaseLogin', defaultMessage: '請先登入' },
    freeAutoSubscription: { id: 'page.CheckoutPage.freeAutoSubscription', defaultMessage: 'Free auto subscription' },
    checkoutProductModal: { id: 'page.CheckoutPage.checkoutProductModal', defaultMessage: 'CheckoutProductModal' },
  }),
  AIBotPage: defineMessages({
    coverLetter: {
      id: 'page.AIBotPage.coverLetter',
      defaultMessage: '你是一位人資，請根據以下問答撰寫求職信（Cover letter）',
    },
    nameLabel: { id: 'page.AIBotPage.nameLabel', defaultMessage: '你的名字' },
    nameContent: { id: 'page.AIBotPage.yournContent', defaultMessage: '你的名字是？' },
    namePlaceholder: { id: 'page.AIBotPage.namePlaceholder', defaultMessage: '姓名' },
    applyCompanyName: { id: 'page.AIBotPage.applyCompanyName', defaultMessage: '想申請的公司名稱' },
    companyName: { id: 'page.AIBotPage.companyName', defaultMessage: '公司名稱' },
    position: { id: 'page.AIBotPage.position', defaultMessage: '職位名稱' },
    positionPlaceholder: { id: 'page.AIBotPage.positionPlaceholder', defaultMessage: '公司名稱' },
    submit: { id: 'page.AIBotPage.submit', defaultMessage: '送出' },
  }),
}

export default pagesMessages
