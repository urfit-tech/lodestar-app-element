import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import hasura from '../hasura'

export const useGiftPlanMutation = () => {
  const [upsertProductGiftPlan] = useMutation<
    hasura.UPSERT_PRODUCT_GIFT_PLAN,
    hasura.UPSERT_PRODUCT_GIFT_PLANVariables
  >(UPSERT_PRODUCT_GIFT_PLAN)
  const [deleteProductGiftPlan] = useMutation<
    hasura.DELETE_PRODUCT_GIFT_PLAN,
    hasura.DELETE_PRODUCT_GIFT_PLANVariables
  >(DELETE_PRODUCT_GIFT_PLAN)
  const [deleteGiftPlan] = useMutation<hasura.DELETE_GIFT_PLAN, hasura.DELETE_GIFT_PLANVariables>(DELETE_GIFT_PLAN)

  return {
    upsertProductGiftPlan,
    deleteProductGiftPlan,
    deleteGiftPlan,
  }
}

const UPSERT_PRODUCT_GIFT_PLAN = gql`
  mutation UPSERT_PRODUCT_GIFT_PLAN(
    $productGiftPlanId: uuid!
    $productId: String!
    $giftPlanId: uuid!
    $giftPlanStartedAt: timestamptz
    $giftPlanEndedAt: timestamptz
  ) {
    insert_product_gift_plan(
      objects: {
        id: $productGiftPlanId
        product_id: $productId
        gift_plan_id: $giftPlanId
        started_at: $giftPlanStartedAt
        ended_at: $giftPlanEndedAt
      }
      on_conflict: { constraint: product_gift_plan_pkey, update_columns: [gift_plan_id, started_at, ended_at] }
    ) {
      affected_rows
    }
  }
`

const DELETE_PRODUCT_GIFT_PLAN = gql`
  mutation DELETE_PRODUCT_GIFT_PLAN($productGiftPlanId: uuid!) {
    delete_product_gift_plan(where: { id: { _eq: $productGiftPlanId } }) {
      affected_rows
    }
  }
`

const DELETE_GIFT_PLAN = gql`
  mutation DELETE_GIFT_PLAN($giftPlanId: uuid!) {
    delete_gift_plan_product(where: { gift_plan_id: { _eq: $giftPlanId } }) {
      affected_rows
    }
    delete_product_gift_plan(where: { gift_plan_id: { _eq: $giftPlanId } }) {
      affected_rows
    }
    delete_gift_plan(where: { id: { _eq: $giftPlanId } }) {
      affected_rows
    }
  }
`

export const useProductGiftPlan = (productId: string) => {
  const { loading, data, error, refetch } = useQuery<
    hasura.GET_PRODUCT_GIFT_PLAN,
    hasura.GET_PRODUCT_GIFT_PLANVariables
  >(GET_PRODUCT_GIFT_PLAN, {
    variables: {
      productId,
    },
  })

  const giftId = !loading ? data?.product_gift_plan[0]?.gift_plan?.gift_plan_products[0].product.target || '' : ''
  const { gift } = useGift(giftId)

  const productGiftPlan = {
    id: data?.product_gift_plan[0]?.id,
    startedAt: data?.product_gift_plan[0]?.started_at,
    endedAt: data?.product_gift_plan[0]?.ended_at,
    giftPlan: {
      id: data?.product_gift_plan[0]?.gift_plan?.id,
      title: data?.product_gift_plan[0]?.gift_plan?.title,
      gift: gift,
    },
  }

  return { productGiftPlan: productGiftPlan, productGiftPlanLoading: loading, refetchProductGiftPlan: refetch }
}

const GET_PRODUCT_GIFT_PLAN = gql`
  query GET_PRODUCT_GIFT_PLAN($productId: String!) {
    product_gift_plan(where: { product_id: { _eq: $productId } }) {
      id
      started_at
      ended_at
      gift_plan {
        id
        title
        gift_plan_products {
          product {
            target
          }
        }
      }
    }
  }
`

export const useGift = (giftId: string) => {
  const { loading, data, error, refetch } = useQuery<hasura.GET_GIFT, hasura.GET_GIFTVariables>(GET_GIFT, {
    variables: {
      giftId,
    },
  })

  const gift = {
    id: data?.token_by_pk?.id,
    title: data?.token_by_pk?.title,
    coverUrl: data?.token_by_pk?.cover_url,
    price: data?.token_by_pk?.price,
    currencyId: data?.token_by_pk?.currency_id,
    isDeliverable: data?.token_by_pk?.is_deliverable,
  }

  return { gift: gift }
}

const GET_GIFT = gql`
  query GET_GIFT($giftId: uuid!) {
    token_by_pk(id: $giftId) {
      id
      title
      cover_url
      price
      currency_id
      is_deliverable
    }
  }
`
