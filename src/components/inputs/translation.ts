import { defineMessages } from 'react-intl'

const inputMessages = {
  '*': defineMessages({
    receiverName: { id: 'checkout.form.label.receiverName', defaultMessage: '收件人姓名' },
  }),
  ContactInfoInput: defineMessages({
    contactInfo: { id: 'input.ContactInfoInput.contactInfo', defaultMessage: '聯絡資訊' },
    contactInfoDescription: {
      id: 'input.ContactInfoInput.contactInfoDescription',
      defaultMessage: '請填寫真實資料，填寫後不可更改，僅通知資訊與相關連繫使用',
    },
    name: { id: 'input.ContactInfoInput.name', defaultMessage: '姓名' },
    phone: { id: 'input.ContactInfoInput.phone', defaultMessage: '電話' },
    email: { id: 'input.ContactInfoInput.email', defaultMessage: 'email' },
    nameHelpText: { id: 'input.ContactInfoInput.nameHelpText', defaultMessage: '請填寫姓名' },
    phoneHelpText: { id: 'input.ContactInfoInput.phoneHelpText', defaultMessage: '請確認電話格式' },
    emailHelpText: { id: 'input.ContactInfoInput.emailHelpText', defaultMessage: '請確認email格式' },
  }),
  ShippingInput: defineMessages({
    shippingInput: { id: 'checkout.label.shippingInput', defaultMessage: '寄送資訊' },
    shippingMethod: { id: 'checkout.label.shippingMethod', defaultMessage: '寄送方式' },
    specification: { id: 'checkout.label.specification', defaultMessage: '商品規格與備註' },
    selectStore: { id: 'checkout.label.selectStore', defaultMessage: '選擇門市' },
    sevenEleven: { id: 'checkout.label.sevenEleven', defaultMessage: '7-11超商取貨' },
    familyMart: { id: 'checkout.label.familyMart', defaultMessage: '全家超商取貨' },
    hiLife: { id: 'checkout.label.hiLife', defaultMessage: '萊爾富超商取貨' },
    okMart: { id: 'checkout.label.okMart', defaultMessage: 'OK超商取貨' },
    sendByPost: { id: 'checkout.label.sendByPost', defaultMessage: '郵寄' },
    homeDelivery: { id: 'checkout.label.homeDelivery', defaultMessage: '宅配' },
    other: { id: 'checkout.label.other', defaultMessage: '其他' },
    outsideTaiwanIslandNoShipping: {
      id: 'checkout.label.outsideTaiwanIslandNoShipping',
      defaultMessage: '台灣離島/海外不寄送',
    },
    giftPlanDeliverNotice1: {
      id: 'checkout.label.giftPlanDeliverNotice1',
      defaultMessage: '(1) 請確實填寫收件地址與聯絡電話，以利贈品順利送達。',
    },
    giftPlanDeliverNotice2: {
      id: 'checkout.label.giftPlanDeliverNotice2',
      defaultMessage: '(2) 贈品若因資訊填寫錯誤而無法順利送達，將不再補發寄送。',
    },
    giftPlanDeliverNotice3: {
      id: 'checkout.label.giftPlanDeliverNotice3',
      defaultMessage: '(3) 台灣離島/海外恕不寄送，請勾選下方選項。',
    },
    nameText: { id: 'checkout.form.message.name', defaultMessage: '真實姓名' },
    receiverPhone: { id: 'checkout.form.label.receiverPhone', defaultMessage: '收件人電話' },
    receiverAddress: { id: 'checkout.form.label.receiverAddress', defaultMessage: '收件人地址' },
    mobilePhone: { id: 'checkout.form.label.mobilePhone', defaultMessage: '手機' },
    addressText: { id: 'checkout.form.message.addressText', defaultMessage: '請輸入地址' },
    penghuCounty: { id: 'checkout.option.penghuCounty', defaultMessage: '澎湖縣' },
    kinmenCounty: { id: 'checkout.option.kinmenCounty', defaultMessage: '金門縣' },
    lienchiangCounty: { id: 'checkout.option.lienchiangCounty', defaultMessage: '連江縣' },
    diaoyutaiIslands: { id: 'checkout.option.diaoyutaiIslands', defaultMessage: '釣魚台列嶼' },
    ludaoTownship: { id: 'checkout.option.ludaoTownship', defaultMessage: '綠島鄉' },
    lanyuTownship: { id: 'checkout.option.lanyuTownship', defaultMessage: '蘭嶼鄉' },
    dongshaIslands: { id: 'checkout.option.dongshaIslands', defaultMessage: '東沙群島' },
    nanshaIslands: { id: 'checkout.option.nanshaIslands', defaultMessage: '南沙群島' },
  }),
  InvoiceInput: defineMessages({
    edenSocialWelfareFoundation: {
      id: 'option.edenSocialWelfareFoundation',
      defaultMessage: '25885 財團法人伊甸社會福利基金會',
    },
    taiwanAlzheimerAssociation: {
      id: 'option.taiwanAlzheimerAssociation',
      defaultMessage: '5380 社團法人台灣失智症協會',
    },
    strayAnimalsHomeFoundation: {
      id: 'option.strayAnimalsHomeFoundation',
      defaultMessage: '8957282 財團法人流浪動物之家基金會',
    },
  }),
}

export default inputMessages
