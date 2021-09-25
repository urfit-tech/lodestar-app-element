export type Module =
  | 'currency'
  | 'invoice'
  | 'locale'
  | 'search'
  | 'social_connect'
  | 'permission'
  | 'customer_review'
  | 'creator_display'
  | 'xuemi_pt'
  | 'sms_verification'
  | 'line'
  | 'craft_page'
  | 'xuemi'
  | 'coin'
  | 'coupon_scope'
  | 'member_card'
  | 'point'
  | 'voucher'
  | 'sharing_code'
  | 'referrer'
  | 'group_buying'
  | 'learning_statistics'
  | 'member_note'
  | 'member_property'
  | 'member_task'
  | 'member_assignment'
  | 'attend'
  | 'member_rejection'
  | 'member_note_demo'
  | 'learning_statistics_advanced'
  | 'commonhealth_login'
  | 'contract'
  | 'sku'
  | 'sales'
  | 'permission_group'
  | 'activity'
  | 'appointment'
  | 'approval'
  | 'blog'
  | 'merchandise'
  | 'podcast'
  | 'podcast_recording'
  | 'program_package'
  | 'project'
  | 'qrcode'
  | 'tempo_delivery'
  | 'merchandise_customization'
  | 'merchandise_virtualness'
  | 'order_contact'
  | 'practice'
  | 'program_content_material'
  | 'exercise'
  | 'private_appointment_plan'
  | 'activity_online'
  | 'zoom'
  | 'fb_pixel'
  | 'ga'
  | 'gtm'
  | 'hotjar'
  | 'tappay'
  | 'spgateway'
  | 'parenting'
  | 'paypal'
  | 'line_login'
  | 'google_login'
  | 'fb_login'
  | 'commonhealth'
  | 'parenting_login'

export type Currency = {
  id: string
  name: string
  label: string
  unit: string
  minorUnits: number
}

export type NavProps = {
  id: string
  block: 'header' | 'footer' | 'social_media'
  position: number
  label: string
  icon: string | null
  href: string
  external: boolean
  locale: string
  tag: string | null
}

export type AppNavProps = NavProps & {
  subNavs: NavProps[]
}

export type AppProps = {
  id: string
  host: string
  hosts: string[]
  name: string | null
  title: string | null
  description: string | null
  vimeoProjectId?: string | null
  enabledModules: {
    [key in Module]?: boolean
  }
  settings: Record<string, string>
  secrets: Record<string, string> & {
    'payment.perpetual.default_gateway'?: undefined
    'payment.perpetual.default_gateway_method'?: undefined
    'payment.subscription.default_gateway'?: undefined
  }
  currencyId: string
  currencies: { [currencyId: string]: Currency }
  navs: AppNavProps[]
}
