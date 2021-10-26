import { useApolloClient, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useApp } from '../contexts/AppContext'
import hasura from '../hasura'
import { notEmpty } from '../helpers'
import { MemberProps, UserRole } from '../types/member'

export const useMember = (memberId: string) => {
  const { loading, data, error, refetch } = useQuery<hasura.GET_MEMBER, hasura.GET_MEMBERVariables>(
    gql`
      query GET_MEMBER($memberId: String!) {
        member_by_pk(id: $memberId) {
          id
          role
          username
          name
          email
          picture_url
          metadata
          description
          created_at
          logined_at
          facebook_user_id
          google_user_id
          youtube_channel_ids
          member_phones(limit: 1) {
            id
            phone
          }
        }
      }
    `,
    { variables: { memberId } },
  )

  const member: MemberProps | null =
    loading || error || !data || !data.member_by_pk
      ? null
      : {
          id: data.member_by_pk.id,
          role: data.member_by_pk.role as UserRole,
          username: data.member_by_pk.username,
          name: data.member_by_pk.name,
          email: data.member_by_pk.email,
          pictureUrl: data.member_by_pk.picture_url,
          shipping: data.member_by_pk.metadata.shipping || null,
          invoice: data.member_by_pk.metadata.invoice || null,
          payment: data.member_by_pk.metadata.payment || null,
          description: data.member_by_pk.description,
          createdAt: data.member_by_pk.created_at,
          loginedAt: data.member_by_pk.logined_at,
          facebookUserId: data.member_by_pk.facebook_user_id,
          googleUserId: data.member_by_pk.google_user_id,
          youtubeChannelIds: data.member_by_pk.youtube_channel_ids,
          phone: data.member_by_pk.member_phones[0]?.phone || '',
        }

  return {
    loadingMember: loading,
    errorMember: error,
    member,
    refetchMember: refetch,
  }
}
export const useSearchMembers = () => {
  const apolloClient = useApolloClient()
  const { id: appId } = useApp()
  const searchMembers = async (emails: string[]) => {
    try {
      const { data } = await apolloClient.query<hasura.SEARCH_MEMBERS, hasura.SEARCH_MEMBERSVariables>({
        query: gql`
          query SEARCH_MEMBERS($emails: [String!]!, $appId: String!) {
            member_public(where: { email: { _in: $emails }, app_id: { _eq: $appId } }) {
              id
              email
            }
          }
        `,
        variables: {
          emails: emails.filter(notEmpty),
          appId,
        },
        fetchPolicy: 'no-cache',
      })

      const members =
        data?.member_public
          .filter(v => v.id && v.email)
          .map(v => ({
            id: v.id || '',
            email: v.email || '',
          })) || []

      return members
    } catch {
      return []
    }
  }

  return searchMembers
}
