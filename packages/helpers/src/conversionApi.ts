import Cookies from 'js-cookie'
import { ConversionApiContent, ConversionApiData, ConversionApiEvent, ConversionApiEventName, ConversionApiUserData } from '../types/conversionApi'
import { MemberProps } from '../types/member'
import axios, { AxiosResponse } from 'axios'


/* TODO:
* conversionApi: 
* send request to backend and let backend send events to meta
* this will be deprecated when we can add cart product and payment info via backend api instead of using Hasura mutation.
----------------------------------------------------------------
* conversionApiData: convert data structure
*/ 
export const getConversionApiData: (
  member: MemberProps | null,
  data: {
    contents?: ConversionApiContent[]
    event: ConversionApiEvent
  },
) => {
  conversionApiData: ConversionApiData
  conversionApi: (authToken: string, eventName: ConversionApiEventName) => Promise<AxiosResponse<any>>
} = (member, data) => {
  const { contents, event } = data
  const emails = member?.email ? [member.email] : undefined
  const phones = member?.phone ? [member.phone] : undefined
  const fbp = Cookies.get('_fbp') as string
  const fbc = Cookies.get('_fbc') as string
  const clientUserAgent = window.navigator.userAgent
  const userData: ConversionApiUserData = { emails, phones, fbp, fbc, clientUserAgent }

  const conversionApiData: ConversionApiData = { userData, contents, event }

  const conversionApi = (authToken: string, eventName: string) => {
    const headers = {
      Authorization: `Bearer ${authToken}`,
    }
    return axios.post(
      `${process.env.REACT_APP_API_BASE_ROOT}/tracking`,
      { payload: { data: conversionApiData, trackingType: 'facebook' }, eventName },
      { headers },
    )
  }

  return { conversionApiData, conversionApi }
}
