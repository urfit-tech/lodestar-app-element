import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export type TrackingInstance = {
  type:
    | 'ProgramPackage'
    | 'ProgramPackagePlan'
    | 'Program'
    | 'ProgramPlan'
    | 'Activity'
    | 'ActivityTicket'
    | 'PodcastAlbum'
    | 'PodcastPlan'
    | 'PodcastProgram'
    | 'MemberShop'
    | 'Merchandise'
    | 'MerchandiseSpec'
    | 'Project'
    | 'Post'
    | 'Order'
    | 'Member'
  id: string
}

export const useTracking = (options = { separator: '|', currencyId: 'TWD' }) => {
  const { currentMember, isAuthenticating } = useAuth()
  // TODO: loggedIn, loggedOut

  useEffect(() => {
    if (!isAuthenticating && !currentMember) {
      // logged out
    } else if (currentMember) {
      // logged in
    }
  }, [currentMember, isAuthenticating])
  return {
    view: async () => {},
    impress: async (
      instances: TrackingInstance[],
      options?: {
        collection?: string
      },
    ) => {},
    click: async (
      instance: TrackingInstance,
      options?: {
        collection?: string
        position?: number
      },
    ) => {},
    detail: async (
      instance: TrackingInstance,
      options?: {
        collection?: string
      },
    ) => {},
    addToCart: async (
      instance: TrackingInstance,
      options?: {
        quantity?: number
      },
    ) => {},
    removeFromCart: async (
      instance: TrackingInstance,
      options?: {
        quantity?: number
      },
    ) => {},
    checkout: async (
      instances: TrackingInstance[],
      options?: {
        step?: number
      },
    ) => {},
    addPaymentInfo: async (
      paymentNo: string,
      options?: {
        step?: number
      },
    ) => {},
    purchase: async (
      orderId: string,
      options?: {
        step?: number
      },
    ) => {},
  }
}
