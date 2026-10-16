import Cookies from 'js-cookie'
import { createAppBackendClient } from '../services/http'
import {
  ConversionApiContent,
  ConversionApiData,
  ConversionApiEvent,
  ConversionApiEventName,
  ConversionApiUserData,
} from '../types/conversionApi'
import { MemberProps } from '../types/member'

/**
 * Facebook Conversions API (server-side events).
 *
 * The browser never holds tracking.fb_conversion_api.access_token: that key is blocked for every browser
 * role, and the backend reads it with the admin connection when POST /api/v1/tracking is called.
 * The frontend switch is the boolean app setting tracking.fb_conversion_api.enabled ('1') plus the
 * fb_conversion_api module; both are public settings.
 *
 * conversionApi: send the event content to the backend, which sends it to Meta.
 * conversionApiData: convert data structure (also stored into cart / order options for the server-side Purchase).
 */
export const FB_CONVERSION_API_ENABLED_SETTING = 'tracking.fb_conversion_api.enabled'

export const isConversionApiEnabled = (
  settings: Record<string, string>,
  enabledModules: { fb_conversion_api?: boolean },
): boolean => settings[FB_CONVERSION_API_ENABLED_SETTING] === '1' && Boolean(enabledModules.fb_conversion_api)

export const getConversionApiData: (
  member: MemberProps | null,
  data: {
    contents?: ConversionApiContent[]
    event: ConversionApiEvent
  },
) => {
  conversionApiData: ConversionApiData
  conversionApi: (authToken: string, eventName: ConversionApiEventName) => Promise<unknown>
} = (member, data) => {
  const { contents, event } = data
  const emails = member?.email ? [member.email] : undefined
  const phones = member?.phone ? [member.phone] : undefined
  const fbp = Cookies.get('_fbp') as string
  const fbc = Cookies.get('_fbc') as string
  const clientUserAgent = window.navigator.userAgent
  const userData: ConversionApiUserData = { emails, phones, fbp, fbc, clientUserAgent }

  const conversionApiData: ConversionApiData = { userData, contents, event }

  const conversionApi = (authToken: string, eventName: ConversionApiEventName) => {
    return createAppBackendClient({ getAuthToken: () => authToken }).post('/tracking', {
      payload: { data: conversionApiData, trackingType: 'facebook' },
      eventName,
    })
  }

  return { conversionApiData, conversionApi }
}
