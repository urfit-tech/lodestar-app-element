import { normalizeCoupon } from './coupon'
import { CouponFromLodestarAPI } from '../types/data'

const coupon: CouponFromLodestarAPI = {
  id: 'coupon',
  memberId: 'member',
  createdAt: '2026-10-20T00:00:00Z',
  status: { used: false, outdated: false },
  couponCode: {
    id: 'code',
    deletedAt: null,
    code: 'CODE',
    appId: 'app',
    couponPlan: {
      id: 'plan',
      title: 'discount',
      description: null,
      startedAt: '2026-10-20T00:00:00Z',
      endedAt: null,
      type: 1,
      constraint: '100',
      amount: 50,
      scope: null,
      couponPlanProducts: [],
    },
  },
}

it('normalizes the API numeric string and dates without inventing inventory counts', () => {
  const plan = normalizeCoupon(coupon).couponCode.couponPlan
  expect(plan.constraint).toBe(100)
  expect(plan.startedAt).toEqual(new Date('2026-10-20T00:00:00Z'))
  expect(plan.endedAt).toBeNull()
  expect(plan.type).toBe('cash')
  expect(plan.count).toBeUndefined()
  expect(plan.remaining).toBeUndefined()
})

it('treats a missing minimum spend as zero', () => {
  const input = {
    ...coupon,
    couponCode: { ...coupon.couponCode, couponPlan: { ...coupon.couponCode.couponPlan, constraint: null } },
  }
  expect(normalizeCoupon(input).couponCode.couponPlan.constraint).toBe(0)
})
