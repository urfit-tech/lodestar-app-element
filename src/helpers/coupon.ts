import { CouponProps } from '../types/checkout'
import { CouponFromLodestarAPI } from '../types/data'

export const normalizeCoupon = (coupon: CouponFromLodestarAPI): CouponProps => {
  const plan = coupon.couponCode.couponPlan
  return {
    id: coupon.id,
    status: coupon.status,
    couponCode: {
      code: coupon.couponCode.code,
      couponPlan: {
        id: plan.id,
        startedAt: plan.startedAt ? new Date(plan.startedAt) : null,
        endedAt: plan.endedAt ? new Date(plan.endedAt) : null,
        type: plan.type === 1 ? 'cash' : 'percent',
        constraint: Number(plan.constraint ?? 0),
        amount: plan.amount,
        title: plan.title,
        description: plan.description || '',
        scope: plan.scope,
        productIds: plan.couponPlanProducts.map(product => product.productId),
      },
    },
  }
}
