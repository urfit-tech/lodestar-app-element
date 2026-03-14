interface IpApiResponse {
  ip: string
}

export interface IpApiResponseSuccess extends IpApiResponse {
  network: string
  version: string
  city: string
  region: string
  region_code: string
  country: string
  country_name: 'Taiwan'
  country_code: 'TW'
  country_code_iso3: string
  country_capital: string
  country_tld: string
  continent_code: string
  in_eu: boolean
  postal: string | null
  latitude: number
  longitude: number
  timezone: string
  utc_offset: string
  country_calling_code: string
  currency: string
  currency_name: string
  languages: string
  country_area: number
  country_population: number
  asn: string
  org: string
  error?: false
}

export interface IpApiResponseFail {
  error: true
  reason: string
}

export type MetaTag = {
  seo?: { pageTitle?: string; description: string; keywords?: string }
  openGraph?: { title?: string; description?: string; image?: string; imageAlt?: string }
}

export type EcItem = {
  item_id: string
  item_name: string
  currency?: string
  price?: number
  quantity?: number
  item_brand?: string
  item_category?: string
  item_category2?: string
  item_category3?: string
  item_category4?: string
  item_category5?: string
  index?: number
  item_list_id?: string
  item_list_name?: string
  item_variant?: string
}
