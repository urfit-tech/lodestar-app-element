import { defineMessages } from 'react-intl'

export const commonMessages = {
  unknown: defineMessages({
    period: { id: 'common.unknown.period', defaultMessage: '未知週期' },
  }),
  unit: defineMessages({
    min: { id: 'common.unit.min', defaultMessage: '分' },
    sec: { id: 'common.unit.sec', defaultMessage: '秒' },
    hour: { id: 'common.unit.hour', defaultMessage: '時' },
    day: { id: 'common.unit.day', defaultMessage: '天' },
    week: { id: 'common.unit.week', defaultMessage: '週' },
    month: { id: 'common.unit.month', defaultMessage: '月' },
    monthWithQuantifier: { id: 'common.unit.monthWithQuantifier', defaultMessage: '個月' },
    year: { id: 'common.unit.year', defaultMessage: '年' },
  }),
  title: defineMessages({
    podcastSubscription: { id: 'common.title.podcast.subscribe', defaultMessage: '訂閱廣播頻道' },
  }),
  label: defineMessages({
    listPrice: { id: 'common.label.listPrice', defaultMessage: '定價' },
    free: { id: 'common.label.free', defaultMessage: '免費' },
    firstPeriod: { id: 'common.label.firstPeriod', defaultMessage: '首期' },
    fromSecondPeriod: { id: 'common.label.fromSecondPeriod', defaultMessage: '第二期開始' },
    originalPrice: { id: 'common.label.originalPrice', defaultMessage: '原價' },
    name: { id: 'common.label.name', defaultMessage: '名稱' },
    or: { id: 'common.label.or', defaultMessage: '或' },
    referrer: { id: 'common.label.referrer', defaultMessage: '推薦人' },
    referrerEmail: { id: 'common.label.referrerEmail', defaultMessage: '請輸入推薦人的註冊信箱' },
  }),
  ui: defineMessages({
    uploadImage: { id: 'common.ui.uploadImage', defaultMessage: '上傳圖片' },
    upload: { id: 'common.ui.upload', defaultMessage: '上傳' },
    selectImage: { id: 'common.ui.selectImage', defaultMessage: '選擇圖片' },
    save: { id: 'common.ui.save', defaultMessage: '儲存' },
    cancel: { id: 'common.ui.cancel', defaultMessage: '取消' },
    modify: { id: 'common.ui.modify', defaultMessage: '更改' },
    add: { id: 'common.ui.add', defaultMessage: '新增' },
    delete: { id: 'common.ui.delete', defaultMessage: '刪除' },
  }),
  button: defineMessages({
    allCategory: { id: 'common.button.allCategory', defaultMessage: '全部分類' },
    add: { id: 'common.button.add', defaultMessage: '新增' },
    subscribeNow: { id: 'common.subscribe.now', defaultMessage: '立即訂閱' },
  }),
  content: defineMessages({
    noPeriod: { id: 'common.content.noPeriod', defaultMessage: '無使用期限' },
  }),
  text: defineMessages({
    selfReferringIsNotAllowed: { id: 'common.text.selfReferringIsNotAllowed', defaultMessage: '不可填寫自己的信箱' },
    notFoundMemberEmail: { id: 'common.text.notFoundMemberEmail', defaultMessage: '找不到這個註冊信箱' },
    emailFormatError: { id: 'common.text.emailFormatError', defaultMessage: '請輸入正確信箱格式' },
  }),
}

export const productMessages = {
  activity: {
    content: defineMessages({
      remaining: { id: 'product.activity.content.remaining', defaultMessage: '剩餘' },
    }),
  },
  label: defineMessages({
    availableForLimitTime: {
      id: 'programPackage.label.availableForLimitTime',
      defaultMessage: '可觀看 {amount} {unit}',
    },
    voucherPlanPriceLabel: {
      id: 'product.label.voucherPlanPriceLabel',
      defaultMessage: '1 份 {saleAmount} 張 ',
    },
    voucherProductItem: {
      id: 'product.label.voucherProductItem',
      defaultMessage: '{quantity} 份 {totalAmount} 張',
    },
  }),
}

export const projectMessages = {
  label: defineMessages({
    isExpired: { id: 'project.label.isExpired', defaultMessage: '已結束' },
    isExpiredFunding: { id: 'project.label.isExpiredFunding', defaultMessage: '專案結束' },
  }),
  text: defineMessages({
    people: { id: 'project.text.people', defaultMessage: '{count} {count, plural, one {人} other {人}}' },
    preOrderCountDownDays: {
      id: 'project.text.preOrderCountDownDays',
      defaultMessage: '優惠倒數 {days} {days, plural, one {天} other {天}}',
    },
    fundingCountDownDays: {
      id: 'project.text.fundingCountDownDays',
      defaultMessage: '募資倒數 {days} {days, plural, one {天} other {天}}',
    },
    totalParticipants: {
      id: 'project.text.totalParticipants',
      defaultMessage: '已有 {count} {count, plural, one {人} other {人}}參與',
    },
  }),
}

export const craftPageMessages = {
  ui: defineMessages({
    createPage: { id: 'craft.ui.createPage', defaultMessage: '建立頁面' },
    deleteAllBlock: { id: 'craft.ui.deleteAllBlock', defaultMessage: '移除整個區塊' },
    deleteBlock: { id: 'craft.ui.deleteBlock', defaultMessage: '移除區塊' },
    deletePage: { id: 'craft.ui.deletePage', defaultMessage: '刪除頁面' },
    empty: { id: 'craft.ui.empty', defaultMessage: '無' },
    image: { id: 'craft.ui.image', defaultMessage: '圖片' },
    solidColor: { id: 'craft.ui.solidColor', defaultMessage: '純色' },
  }),
  label: defineMessages({
    emptyPage: { id: 'craft.label.emptyPage', defaultMessage: '空白頁' },
    settings: { id: 'craft.label.settings', defaultMessage: '基本設定' },
    pageEditor: { id: 'craft.label.pageEditor', defaultMessage: '首頁 - 編輯頁面' },
    editPage: { id: 'craft.label.editPage', defaultMessage: '編輯頁面' },
    choiceTemplate: { id: 'craft.label.choiceTemplate', defaultMessage: '選擇版型' },
    pageName: { id: 'craft.label.pageName', defaultMessage: '頁面名稱' },
    path: { id: 'craft.label.urlPath', defaultMessage: '網址路徑' },
    url: { id: 'craft.label.url', defaultMessage: '網址' },
    latestUpdatedAt: { id: 'craft.label.latestUpdatedAt', defaultMessage: '最後修改時間' },
    publish: { id: 'craft.label.publish', defaultMessage: '發佈' },
    columnAmount: { id: 'craft.label.columnAmount', defaultMessage: '欄數' },
    scrollAmount: { id: 'craft.label.scrollAmount', defaultMessage: '捲動數量' },
    ratio: { id: 'craft.label.ratio', defaultMessage: '比例' },
    displayAmount: { id: 'craft.label.displayAmount', defaultMessage: '資料顯示數量' },
    title: { id: 'craft.label.title', defaultMessage: '標題' },
    titleContent: { id: 'craft.label.titleContent', defaultMessage: '標題內容' },
    content: { id: 'craft.label.content', defaultMessage: '內文' },
    imageSetting: { id: 'craft.label.imageSetting', defaultMessage: '圖片設定' },
    imageStyle: { id: 'craft.label.imageStyle', defaultMessage: '圖片樣式' },
    avatarSetting: { id: 'craft.label.avatar', defaultMessage: '頭像設定' },
    titleStyle: { id: 'craft.label.titleStyle', defaultMessage: '標題樣式' },
    paragraphStyle: { id: 'craft.label.paragraphStyle', defaultMessage: '段落樣式' },
    paragraphContent: { id: 'craft.label.paragraphContent', defaultMessage: '段落內容' },
    cardStyle: { id: 'craft.label.cardStyle', defaultMessage: '卡片樣式' },
    margin: { id: 'craft.label.margin', defaultMessage: '外距' },
    padding: { id: 'craft.label.padding', defaultMessage: '內距' },
    buttonSetting: { id: 'craft.label.buttonSetting', defaultMessage: '按鈕設定' },
    buttonStyle: { id: 'craft.label.buttonStyle', defaultMessage: '按鈕樣式' },
    carouselSetting: { id: 'craft.label.carouselSetting', defaultMessage: '輪播設定' },
    desktopDisplay: { id: 'craft.label.desktopDisplay', defaultMessage: '電腦版顯示' },
    mobileDisplay: { id: 'craft.label.mobileDisplay', defaultMessage: '手機版顯示' },
    link: { id: 'craft.label.link', defaultMessage: '連結' },
    openNewTab: { id: 'craft.label.openNewTab', defaultMessage: '另開分頁' },
    fontSize: { id: 'craft.label.fontSize', defaultMessage: '字級' },
    lineHeight: { id: 'craft.label.lineHeight', defaultMessage: '行高' },
    textAlign: { id: 'craft.label.textAlign', defaultMessage: '對齊' },
    left: { id: 'craft.label.left', defaultMessage: '左' },
    center: { id: 'craft.label.center', defaultMessage: '中' },
    right: { id: 'craft.label.right', defaultMessage: '右' },
    fontWeight: { id: 'craft.label.fontWeight', defaultMessage: '字重' },
    lighter: { id: 'craft.label.lighter', defaultMessage: '細' },
    normal: { id: 'craft.label.normal', defaultMessage: '中' },
    bold: { id: 'craft.label.bold', defaultMessage: '粗' },
    size: { id: 'craft.label.size', defaultMessage: '尺寸' },
    large: { id: 'craft.label.large', defaultMessage: '大' },
    middle: { id: 'craft.label.middle', defaultMessage: '中' },
    small: { id: 'craft.label.small', defaultMessage: '小' },
    width: { id: 'craft.label.width', defaultMessage: '寬度' },
    buttonBlock: { id: 'craft.label.buttonBlock', defaultMessage: '滿版' },
    variant: { id: 'craft.label.variant', defaultMessage: '變化' },
    plainText: { id: 'craft.label.plainText', defaultMessage: '純文字' },
    coloring: { id: 'craft.label.coloring', defaultMessage: '填色' },
    background: { id: 'craft.label.background', defaultMessage: '背景' },
    backgroundColor: { id: 'craft.label.backgroundColor', defaultMessage: '底色' },
    none: { id: 'craft.label.none', defaultMessage: '無樣式' },
    outline: { id: 'craft.label.outline', defaultMessage: '線框' },
    color: { id: 'craft.label.color', defaultMessage: '顏色' },
    containerComponent: { id: 'craft.label.containerComponent', defaultMessage: '區塊元件' },
    desktopLayoutComponent: { id: 'craft.label.desktopLayoutComponent', defaultMessage: '電腦版排版元件' },
    mobileLayoutComponent: { id: 'craft.label.mobileLayoutComponent', defaultMessage: '手機版排版元件' },
    desktopCarouselComponent: { id: 'craft.label.desktopCarouselComponent', defaultMessage: '電腦版輪播元件' },
    mobileCarouselComponent: { id: 'craft.label.mobileCarouselComponent', defaultMessage: '手機版輪播元件' },
    allTemplate: { id: 'craft.label.allTemplate', defaultMessage: '所有樣板' },
    cover: { id: 'craft.label.cover', defaultMessage: '輪播' },
    programBlock: { id: 'craft.label.programBlock', defaultMessage: '課程區塊' },
    activityBlock: { id: 'craft.label.activityBlock', defaultMessage: '活動區塊' },
    podcastBlock: { id: 'craft.label.podcastBlock', defaultMessage: '廣播區塊' },
    lecturerBlock: { id: 'craft.label.lecturerBlock', defaultMessage: '講師區塊' },
    fundraisingBlock: { id: 'craft.label.fundraisingBlock', defaultMessage: '講師區塊' },
    preOrderBlock: { id: 'craft.label.preOrderBlock', defaultMessage: '預購專區' },
    statistics: { id: 'craft.label.statisticsBlock', defaultMessage: '統計數字' },
    description: { id: 'craft.label.description', defaultMessage: '描述' },
    feature: { id: 'craft.label.feature', defaultMessage: '特色' },
    callToAction: { id: 'craft.label.callToAction', defaultMessage: '行動呼籲' },
    referrerEvaluation: { id: 'craft.label.referrerEvaluation', defaultMessage: '推薦評價' },
    partner: { id: 'craft.label.partner', defaultMessage: '合作夥伴' },
    commonProblem: { id: 'craft.label.commonProblem', defaultMessage: '常見問題' },
    imageBlock: { id: 'craft.label.imageBlock', defaultMessage: '圖片區塊' },
    textBlock: { id: 'craft.label.textBlock', defaultMessage: '文字區塊' },
    programSection: { id: 'craft.label.programSection', defaultMessage: '課程區塊' },
    activitySection: { id: 'craft.label.activitySection', defaultMessage: '活動區塊' },
    blockSetting: { id: 'craft.label.blockSetting', defaultMessage: '區塊樣式' },
    dataDisplay: { id: 'craft.label.dataDisplay', defaultMessage: '資料顯示' },
    addItem: { id: 'craft.label.addItem', defaultMessage: '新增項目' },
    specifyDisplayItem: { id: 'craft.label.specifyDisplayItem', defaultMessage: '指定顯示項目' },
    categorySelector: { id: 'craft.label.categorySelector', defaultMessage: '分類選擇器' },
    categorySelectorEnabled: { id: 'craft.label.categorySelectorEnabled', defaultMessage: '啟用分類選擇器' },
    defaultCategoryId: { id: 'craft.label.defaultCategoryId', defaultMessage: '預設分類' },
    choiceData: { id: 'craft.label.choiceData', defaultMessage: '選擇資料' },
    program: { id: 'craft.label.program', defaultMessage: '課程' },
    activity: { id: 'craft.label.activity', defaultMessage: '活動' },
    podcast: { id: 'craft.label.podcast', defaultMessage: '廣播' },
    lecturer: { id: 'craft.label.lecturer', defaultMessage: '講師' },
    fundraising: { id: 'craft.label.fundraising', defaultMessage: '募資' },
    preOrder: { id: 'craft.label.preOrder', defaultMessage: '預購' },
    newest: { id: 'craft.label.newest', defaultMessage: '最新上架' },
    custom: { id: 'craft.label.custom', defaultMessage: '自訂項目' },
    ruleOfSort: { id: 'craft.label.ruleOfSort', defaultMessage: '排序規則' },
    recentWatched: { id: 'program.ProgramCollectionSelector.recentWatched', defaultMessage: '依最後觀看時間' },
    publishedAt: { id: 'program.ProgramCollectionSelector.publishedAt', defaultMessage: '依上架日期' },
    currentPrice: { id: 'program.ProgramCollectionSelector.currentPrice', defaultMessage: '依產品價錢' },
    popular: { id: 'craft.label.popular', defaultMessage: '依熱門程度' },
  }),
  text: defineMessages({
    chooseCategories: {
      id: 'craft.text.chooseCategories',
      defaultMessage: '選擇分類',
    },
    deleteWarning: {
      id: 'craft.text.deleteWarning',
      defaultMessage: '刪除不可恢復，確定要刪除嗎？',
    },
    deletePageConfirmation: {
      id: 'craft.text.deletePageConfirmation',
      defaultMessage: '頁面一經刪除即不可恢復，確定要刪除嗎？',
    },
    deletePageWarning: {
      id: 'craft.text.deletePageWarning',
      defaultMessage: '請仔細確認是否真的要刪除頁面，因為一旦刪除就無法恢復。',
    },
    noPageName: {
      id: 'craft.text.noPageName',
      defaultMessage: '尚未填寫頁面名稱',
    },
    noPath: {
      id: 'craft.text.noPath',
      defaultMessage: '尚未填寫網址路徑',
    },
    notCompleteNotation: {
      id: 'craft.text.notCompleteNotation',
      defaultMessage: '請填寫以下必填資料，填寫完畢即可由此發佈',
    },
    unpublishedNotation: {
      id: 'craft.text.unpublishedNotation',
      defaultMessage: '因你的頁面未發佈，此頁面並不會顯示。',
    },
    publishedNotation: {
      id: 'craft.text.publishedNotation',
      defaultMessage: '現在你的頁面已經發佈，此頁面將會顯示。',
    },
    boxModelInputWarning: {
      id: 'craft.text.boxModelInputWarning',
      defaultMessage: '請填入以下格式，5;3;5;3',
    },
  }),
}

export const certificateMessages = {
  CertificateContent: defineMessages({
    number: { id: 'certificate.CertificateContent.number', defaultMessage: '證書編號：{number}' },
    expiredTime: { id: 'certificate.CertificateContent.expiredTime', defaultMessage: '證書效期：{expiredTime} 止' },
    deliveredAt: {
      id: 'certificate.CertificateContent.deliveredAt',
      defaultMessage: '發放日期：{deliveredAt}',
    },
    qualification: {
      id: 'certificate.CertificateContent.qualification',
      defaultMessage: '學習時數',
    },
  }),
}

export const checkoutMessages = {
  unit: defineMessages({
    piece: { id: 'checkout.piece', defaultMessage: '張' },
  }),
  form: {
    label: defineMessages({
      cardNo: { id: 'checkout.form.label.cardNo', defaultMessage: '卡號' },
      cardExp: { id: 'checkout.form.label.cardExp', defaultMessage: '有效期' },
    }),
  },
  coupon: defineMessages({
    fromNow: { id: 'checkout.coupon.fromNow', defaultMessage: '即日起' },
    noPeriod: { id: 'checkout.coupon.noPeriod', defaultMessage: '無使用期限' },
  }),
  content: defineMessages({
    discountDirectly: { id: 'checkout.discount.directly', defaultMessage: '直接折抵' },
  }),
  title: defineMessages({
    cart: { id: 'checkout.title.cart', defaultMessage: '購物清單' },
    chooseCoupon: { id: 'checkout.title.chooseCoupon', defaultMessage: '選擇折價券' },
    chooseMemberCard: { id: 'checkout.title.chooseMemberCard', defaultMessage: '選擇會員卡' },
  }),
  label: defineMessages({
    email: { id: 'checkout.label.email', defaultMessage: '聯絡信箱' },
    phone: { id: 'checkout.label.phone', defaultMessage: '手機' },
    name: { id: 'checkout.label.name', defaultMessage: '姓名' },
    invoice: { id: 'checkout.label.invoice', defaultMessage: '發票' },
    paymentMethodPlaceholder: { id: 'checkout.label.paymentMethodPlaceholder', defaultMessage: '請選擇付款方式' },
    paymentMethod: { id: 'checkout.label.paymentMethod', defaultMessage: '付款方式' },
    credit: { id: 'checkout.label.credit', defaultMessage: '信用卡' },
    vacc: { id: 'checkout.label.vacc', defaultMessage: 'ATM轉帳' },
    cvs: { id: 'checkout.label.cvs', defaultMessage: '超商付款' },
    instflag: { id: 'checkout.label.instflag', defaultMessage: '信用卡分期' },
    unionpay: { id: 'checkout.label.unionpay', defaultMessage: '銀聯卡支付' },
    webatm: { id: 'checkout.label.webatm', defaultMessage: 'WebATM' },
    barcode: { id: 'checkout.label.barcode', defaultMessage: '超商條碼繳費' },
    androidpay: { id: 'checkout.label.androidpay', defaultMessage: 'Google Pay' },
    samsungpay: { id: 'checkout.label.samsungpay', defaultMessage: 'Samsung Pay' },
    creditred: { id: 'checkout.label.creditred', defaultMessage: '信用卡紅利支付' },
    cvscom: { id: 'checkout.label.cvscom', defaultMessage: '超商取貨付款' },
    cash: { id: 'checkout.label.cash', defaultMessage: '現金' },
    bankTransfer: { id: 'checkout.label.bankTransfer', defaultMessage: '銀行轉帳' },
    physicalCredit: { id: 'checkout.label.physicalCredit', defaultMessage: '實體刷卡' },
    physicalRemoteCredit: { id: 'checkout.label.physicalRemoteCredit', defaultMessage: '實體刷卡遠刷' },
    alipay: { id: 'checkout.label.alipay', defaultMessage: '支付寶' },
    ezpay: { id: 'checkout.label.ezpay', defaultMessage: 'ezPay' },
    esumwallet: { id: 'checkout.label.esumwallet', defaultMessage: '玉山 Wallet' },
    taiwanpay: { id: 'checkout.label.taiwanpay', defaultMessage: '台灣 Pay' },
    linepay: { id: 'checkout.label.linepay', defaultMessage: 'Line Pay' },
    applepay: { id: 'checkout.label.applepay', defaultMessage: 'Apple Pay' },
    spgateway: { id: 'checkout.label.spgateway', defaultMessage: '藍新' },
    physical: { id: 'checkout.label.physical', defaultMessage: '實體' },
    spgateway2: { id: 'checkout.label.spgateway2', defaultMessage: '藍新' },
    tappay: { id: 'checkout.label.tappay', defaultMessage: 'tappay' },
    paypal: { id: 'checkout.label.paypal', defaultMessage: 'PayPal - 限非台灣地區' },
    parenting: { id: 'checkout.label.parenting', defaultMessage: '親子天下' },
    commonhealth: { id: 'checkout.label.commonhealth', defaultMessage: '康健' },
    cw_commonhealth: { id: 'checkout.label.cw_commonhealth', defaultMessage: '康健' },
    cw_parenting: { id: 'checkout.label.cw_parenting', defaultMessage: '親子天下' },
    cw_cw: { id: 'checkout.label.cw_cw', defaultMessage: '天下' },
    atome: { id: 'checkout.label.atome', defaultMessage: 'Atome' },
    groupBuying: { id: 'checkout.label.groupBuying', defaultMessage: '多人同行揪團' },
    noDiscount: { id: 'checkout.label.noDiscount', defaultMessage: '無折扣' },
    useCoupon: { id: 'checkout.label.useCoupon', defaultMessage: '使用折價券' },
    useMemberCard: { id: 'checkout.label.useMemberCard', defaultMessage: '使用會員卡' },
    groupBuyingRuleTitle: {
      id: 'checkout.label.groupBuyingRuleTitle',
      defaultMessage: '多人同行揪團規定與退費說明',
    },
    groupBuyingPlan: {
      id: 'checkout.label.groupBuyingTitle',
      defaultMessage: '你購買「{title}」多人同行 方案：',
    },
    partnerEmail: {
      id: 'checkout.label.partnerEmail',
      defaultMessage: '第{index}位同行者',
    },
    shippingInput: { id: 'checkout.label.shippingInput', defaultMessage: '寄送資訊' },
    shippingMethod: { id: 'checkout.label.shippingMethod', defaultMessage: '寄送方式' },
    selectStore: { id: 'checkout.label.selectStore', defaultMessage: '選擇門市' },
    receiverName: { id: 'checkout.label.receiverName', defaultMessage: '收件人姓名' },
    receiverPhone: { id: 'checkout.label.receiverPhone', defaultMessage: '收件人電話' },
    specification: { id: 'checkout.label.specification', defaultMessage: '商品規格與備註' },
    receiverAddress: { id: 'checkout.label.receiverAddress', defaultMessage: '收件人地址' },
    electronicInvoice: { id: 'checkout.label.electronicInvoice', defaultMessage: '個人' },
    donateInvoice: { id: 'checkout.label.donateInvoice', defaultMessage: '捐贈' },
    uniformNumber: { id: 'checkout.label.uniformNumber', defaultMessage: '統一編號' },
    hardcopyInvoice: { id: 'checkout.label.hardcopyInvoice', defaultMessage: '個人' },
    hardcopyUniformNumberInvoice: { id: 'checkout.label.hardcopyUniformNumberInvoice', defaultMessage: '公司' },
    sendToEmail: { id: 'checkout.label.sendToEmail', defaultMessage: '寄送至電子信箱' },
    usePhoneBarCode: { id: 'checkout.label.usePhoneBarCode', defaultMessage: '使用手機條碼' },
    citizenCode: { id: 'checkout.label.citizenCode', defaultMessage: '自然人憑證條碼' },
    phoneBarCode: { id: 'checkout.label.phoneBarCode', defaultMessage: '手機條碼' },
    uniformTitle: { id: 'checkout.label.uniformTitle', defaultMessage: '發票抬頭' },
    postCode: { id: 'checkout.label.postCode', defaultMessage: '郵遞區號' },
    approved: { id: 'checkout.label.approved', defaultMessage: '我同意' },
    creditLastFour: { id: 'checkout.label.creditLastFour', defaultMessage: '末四碼' },
  }),
  message: defineMessages({
    phone: { id: 'checkout.message.phone', defaultMessage: '手機' },
    errorName: { id: 'checkout.message.errorName', defaultMessage: '請輸入姓名' },
    errorEmail: { id: 'checkout.message.errorEmail', defaultMessage: '信箱格式錯誤' },
    emailText: { id: 'checkout.message.email', defaultMessage: '請填寫電子信箱' },
    addressText: { id: 'checkout.message.addressText', defaultMessage: '請輸入地址' },
    warningPayment: {
      id: 'checkout.message.warningPayment',
      defaultMessage: '下一步將連至第三方金流服務進行付款，你所有的交易資訊皆獲得安全保護。',
    },
    warningEmail: {
      id: 'checkout.message.warningEmail',
      defaultMessage: '請填寫真實資料，填寫後不可更改，僅供發票與相關聯繫使用。',
    },
    warningHardcopy: {
      id: 'checkout.message.warningHardcopy',
      defaultMessage: '以下資訊只用於開立發票，資料填寫後不可更改。',
    },
    sameToShipping: { id: 'checkout.message.sameToShipping', defaultMessage: '同寄送資訊' },
    errorPhone: { id: 'checkout.message.errorPhone', defaultMessage: '手機格式錯誤' },
    phoneBarCodeText: {
      id: 'checkout.message.phoneBarCode',
      defaultMessage: '長度 8 個字元，由斜線（/）加上 7 碼 +、-、.、數字及大寫字母組成',
    },
    citizenCodeText: {
      id: 'checkout.message.citizenCode',
      defaultMessage: '長度 16 個字元，由 2 碼大寫字母加上 14 碼數字組成',
    },
    uniformNumberText: {
      id: 'checkout.message.uniformNumberText',
      defaultMessage: '送出後無法更改，請務必確認',
    },
    uniformTitleText: { id: 'checkout.message.uniformTitleText', defaultMessage: '請輸入發票抬頭' },
    uniformNumberRemark: {
      id: 'checkout.message.uniformNumberRemark',
      defaultMessage: '備註：統編發票將直接寄送至您留下的電子信箱內',
    },
    notEnough: {
      id: 'checkout.message.notEnough',
      defaultMessage: '不足',
    },
    notEnoughCoins: {
      id: 'checkout.message.notEnoughCoins',
      defaultMessage: '代幣不足',
    },
  }),
  shipping: defineMessages({
    sevenEleven: { id: 'checkout.label.sevenEleven', defaultMessage: '7-11超商取貨' },
    familyMart: { id: 'checkout.label.familyMart', defaultMessage: '全家超商取貨' },
    hiLife: { id: 'checkout.label.hiLife', defaultMessage: '萊爾富超商取貨' },
    okMart: { id: 'checkout.label.okMart', defaultMessage: 'OK超商取貨' },
    sendByPost: { id: 'checkout.label.sendByPost', defaultMessage: '郵寄' },
    homeDelivery: { id: 'checkout.label.homeDelivery', defaultMessage: '宅配' },
    other: { id: 'checkout.label.other', defaultMessage: '其他' },
  }),
  button: defineMessages({
    reselectCoupon: { id: 'checkout.button.reselectCoupon', defaultMessage: '重新選擇' },
    chooseCoupon: { id: 'checkout.button.chooseCoupon.', defaultMessage: '選擇折價券' },
    cartSubmit: { id: 'checkout.cart.cartSubmit', defaultMessage: '前往結帳' },
  }),
  placeholder: defineMessages({
    enterCouponCode: { id: 'checkout.placeholder.enterCouponCode', defaultMessage: '輸入折扣碼' },
    nameText: { id: 'checkout.placeholder.nameText', defaultMessage: '真實姓名' },
  }),
  text: defineMessages({
    groupBuyingRuleLink: {
      id: 'checkout.text.groupBuyingRuleLink',
      defaultMessage: '規定與退費',
    },
    groupBuyingRule1: {
      id: 'checkout.text.groupBuyingRule1',
      defaultMessage: ' 選擇多人同行方案，僅會開立一張發票，無法另外提供多張發票。',
    },
    groupBuyingRule2: {
      id: 'checkout.text.groupBuyingRule2',
      defaultMessage: '多人同行方案不得與其他優惠合併使用。',
    },
    groupBuyingRule3: {
      id: 'checkout.text.groupBuyingRule3',
      defaultMessage: '多人同行方案於購買後 7 天內，只要所有人尚未使用，即可申請全額退費。',
    },
    groupBuyingRule4: {
      id: 'checkout.text.groupBuyingRule4',
      defaultMessage: '退費時由多人同行方案的購買人向平台方提出申請，平台方也將統一退費給當初的購買人，將不分別退費。',
    },
    groupBuyingRule5: {
      id: 'checkout.text.groupBuyingRule5',
      defaultMessage: '會員之間的項目轉讓，均屬會員的私人行為，平台方均不干涉。',
    },
    groupBuyingDescription1: {
      id: 'checkout.text.groupBuyingDescription1',
      defaultMessage:
        '可於底下填寫同行者信箱帳號，將於完成付款後隨即開通，主揪者與同行者皆可在「我的主頁」內找到購買項目。',
    },
    groupBuyingDescription2: {
      id: 'checkout.text.groupBuyingDescription2',
      defaultMessage: '請{warning}；若因填寫錯誤導致權益開通失敗，造成權益損失，{appName}恕不負責。',
    },
    groupBuyingDescriptionComfirmWarning: {
      id: 'checkout.text.groupBuyingDescriptionComfirmWarning',
      defaultMessage: '務必確認同行者信箱帳號正確',
    },
    groupBuyingDescription3: {
      id: 'checkout.text.groupBuyingDescription3',
      defaultMessage: '若本次未填寫同行者信箱，則會保留在後台的「我的揪團」，可以之後再指定開通給其他會員。',
    },
    groupBuyingDescription4: {
      id: 'checkout.text.groupBuyingDescription4',
      defaultMessage: '注意事項：購買即同意以下多人同行揪團{modal}辦法。',
    },
    existingPartner: {
      id: 'checkout.text.existingPartner',
      defaultMessage: '重複的同行者',
    },
    fillInPartnerEmail: {
      id: 'checkout.text.fillInPartnerEmail',
      defaultMessage: '請填寫同行者在站上註冊的電子信箱',
    },
    invoiceDescription1: {
      id: 'checkout.text.invoiceDescription1',
      defaultMessage: '你的發票姓名、手機、email 與您註冊時填寫的會員資料相同，中獎時會主動通知。',
    },
    invoiceDescription2: {
      id: 'checkout.text.invoiceDescription2',
      defaultMessage: '若需要修改密碼、會員資料，',
    },
    invoiceDescription3: {
      id: 'checkout.text.invoiceDescription3',
      defaultMessage: '請點此',
    },
    invoiceDescription4: {
      id: 'checkout.text.invoiceDescription4',
      defaultMessage: '，登入後進行修改。',
    },
  }),
}

export const codeMessages = defineMessages({
  SUCCESS: {
    id: 'code.SUCCESS',
    defaultMessage: '成功',
  },
  E_INPUT: {
    id: 'code.E_INPUT',
    defaultMessage: '輸入資料有誤',
  },
  E_USERNAME_EXISTS: {
    id: 'code.E_USERNAME_EXISTS',
    defaultMessage: '使用者名稱已存在',
  },
  E_EMAIL_EXISTS: {
    id: 'code.E_EMAIL_EXISTS',
    defaultMessage: '電子信箱已存在',
  },
  E_SEND_EMAIL: {
    id: 'code.E_SEND_EMAIL',
    defaultMessage: '寄送信件失敗',
  },
  E_UNKNOWN: {
    id: 'code.E_UNKNOWN',
    defaultMessage: '未知錯誤',
  },
  E_INSERT_QUEUE: {
    id: 'code.E_INSERT_QUEUE',
    defaultMessage: 'E_INSERT_QUEUE',
  },
  E_NO_MEMBER: {
    id: 'code.E_NO_MEMBER',
    defaultMessage: '找不到該使用者',
  },
  E_NO_APP_HOST: {
    id: 'code.E_NO_APP_HOST',
    defaultMessage: 'E_NO_APP_HOST',
  },
  E_NO_ORDER: {
    id: 'code.E_NO_ORDER',
    defaultMessage: '找不到該訂單',
  },
  E_NO_PAYMENT: {
    id: 'code.E_NO_PAYMENT',
    defaultMessage: '找不到該付款紀錄',
  },
  E_NO_EMAIL: {
    id: 'code.E_NO_EMAIL',
    defaultMessage: '找不到信箱',
  },
  E_PASSWORD: {
    id: 'code.E_PASSWORD',
    defaultMessage: '密碼錯誤',
  },
  E_PROVIDER: {
    id: 'code.E_PROVIDER',
    defaultMessage: 'E_PROVIDER',
  },
  E_PROVIDER_TOKEN: {
    id: 'code.E_PROVIDER_TOKEN',
    defaultMessage: 'E_PROVIDER_TOKEN',
  },
  E_UPDATE_PASSWORD: {
    id: 'code.E_UPDATE_PASSWORD',
    defaultMessage: '更新密碼錯誤',
  },
  E_CHECKOUT_ORDER: {
    id: 'code.E_CHECKOUT_ORDER',
    defaultMessage: '結帳錯誤',
  },
  E_MPG_SERVICE: {
    id: 'code.E_MPG_SERVICE',
    defaultMessage: 'E_MPG_SERVICE',
  },
  E_SPGATEWAY_NOTIFY: {
    id: 'code.E_SPGATEWAY_NOTIFY',
    defaultMessage: 'E_SPGATEWAY_NOTIFY',
  },
  E_UPDATE_ORDER_STATUS: {
    id: 'code.E_UPDATE_ORDER_STATUS',
    defaultMessage: 'E_UPDATE_ORDER_STATUS',
  },
  E_LOGOUT: {
    id: 'code.E_LOGOUT',
    defaultMessage: '登出錯誤',
  },
  E_DELIVER_PRODUCTS: {
    id: 'code.E_DELIVER_PRODUCTS',
    defaultMessage: 'E_DELIVER_PRODUCTS',
  },
  E_ISSUE_INVOICE: {
    id: 'code.E_ISSUE_INVOICE',
    defaultMessage: '開立發票錯誤',
  },
  E_NO_CODE: {
    id: 'code.E_NO_CODE',
    defaultMessage: '折價券序號有誤',
  },
  E_EXCHANGE_CODE: {
    id: 'code.E_EXCHANGE_CODE',
    defaultMessage: '無法加入該折價券',
  },
  E_OUTDATED_CODE: {
    id: 'code.E_OUTDATED_CODE',
    defaultMessage: '折價券已過期',
  },
  E_VALIDATE_CREDIT_CARD: {
    id: 'code.E_VALIDATE_CREDIT_CARD',
    defaultMessage: '信用卡驗證錯誤',
  },
  E_SETUP_TPCLIENT: {
    id: 'code.E_SETUP_TPCLIENT',
    defaultMessage: 'E_SETUP_TPCLIENT',
  },
  E_BIND_CREDIT_CARD: {
    id: 'code.E_BIND_CREDIT_CARD',
    defaultMessage: '綁定信用卡錯誤',
  },
  E_PAYPAL_EXEC: {
    id: 'code.E_PAYPAL_EXEC',
    defaultMessage: 'PAYPAL執行操作失敗',
  },
  E_PAYPAL_ORDER: {
    id: 'code.E_PAYPAL_ORDER',
    defaultMessage: 'PAYPAL建立付款失敗',
  },
  E_PAYPAL_CAPTURE: {
    id: 'code.E_PAYPAL_CAPTURE',
    defaultMessage: 'PAYPAL請款失敗',
  },
  E_NO_PAYMENT_METHOD: {
    id: 'code.E_NO_PAYMENT_METHOD',
    defaultMessage: '找不到該付款方式',
  },
  E_INVALID_PAYMENT_METHOD: {
    id: 'code.E_INVALID_PAYMENT_METHOD',
    defaultMessage: '該付款方式無效',
  },
  E_PAY_TPCLIENT: {
    id: 'code.E_PAY_TPCLIENT',
    defaultMessage: '信用卡付款失敗請重新輸入卡號',
  },
  E_SIGN_URL: {
    id: 'code.E_SIGN_URL',
    defaultMessage: 'E_SIGN_URL',
  },
  E_ZOOM_SECRET: {
    id: 'code.E_ZOOM_SECRET',
    defaultMessage: 'E_ZOOM_SECRET',
  },
  E_LIST_ZOOM_USER: {
    id: 'code.E_LIST_ZOOM_USER',
    defaultMessage: 'E_LIST_ZOOM_USER',
  },
  E_HANDLE_TRIGGER: {
    id: 'code.E_HANDLE_TRIGGER',
    defaultMessage: 'E_HANDLE_TRIGGER',
  },
  E_GET_MEMBER: {
    id: 'code.E_GET_MEMBER',
    defaultMessage: '無法取得使用者',
  },
  E_REGISTER_MEMBER: {
    id: 'code.E_REGISTER_MEMBER',
    defaultMessage: '註冊使用者錯誤',
  },
  E_PAYMENT_GATEWAY: {
    id: 'code.E_PAYMENT_GATEWAY',
    defaultMessage: 'E_PAYMENT_GATEWAY',
  },
  E_RESET_PASSWORD_TOKEN: {
    id: 'code.E_RESET_PASSWORD_TOKEN',
    defaultMessage: '連結已失效',
  },
  E_SETUP_PAYPAL: {
    id: 'code.E_SETUP_PAYPAL',
    defaultMessage: 'Paypal 環境設定失敗',
  },
  E_CW_SETUP: {
    id: 'code.E_CW_SETUP',
    defaultMessage: 'CW 環境設定失敗',
  },
  E_CW_SERVICE: {
    id: 'code.E_CW_SERVICE',
    defaultMessage: 'CW 導入付款頁失敗',
  },
  E_DUPLICATED_EXCHANGE: {
    id: 'code.E_DUPLICATED_EXCHANGE',
    defaultMessage: 'Discount already exchange',
  },
})
