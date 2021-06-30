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
  label: defineMessages({
    listPrice: { id: 'common.label.listPrice', defaultMessage: '定價' },
    free: { id: 'common.label.free', defaultMessage: '免費' },
    firstPeriod: { id: 'common.label.firstPeriod', defaultMessage: '首期' },
    fromSecondPeriod: { id: 'common.label.fromSecondPeriod', defaultMessage: '第二期開始' },
    originalPrice: { id: 'common.label.originalPrice', defaultMessage: '原價' },
  }),
}

export const productMessages = {
  activity: {
    content: defineMessages({
      remaining: { id: 'product.activity.content.remaining', defaultMessage: '剩餘' },
    }),
  },
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
