import { gql, useMutation, useQuery } from '@apollo/client'
import hasura from '../hasura'
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
          pictureUrl: data.member_by_pk.picture_url || null,
          shipping: data.member_by_pk.metadata.shipping || null,
          invoice: data.member_by_pk.metadata.invoice || null,
          payment: data.member_by_pk.metadata.payment || null,
          description: data.member_by_pk.description || null,
          createdAt: data.member_by_pk.created_at,
          loginedAt: data.member_by_pk.logined_at,
          facebookUserId: data.member_by_pk.facebook_user_id || null,
          googleUserId: data.member_by_pk.google_user_id || null,
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

export const useUpdateMemberMetadata = () => {
  const [updateMemberMetadata] = useMutation<hasura.UPDATE_MEMBER_METADATA, hasura.UPDATE_MEMBER_METADATAVariables>(gql`
    mutation UPDATE_MEMBER_METADATA(
      $memberId: String!
      $metadata: jsonb
      $memberPhones: [member_phone_insert_input!]!
    ) {
      update_member(where: { id: { _eq: $memberId } }, _set: { metadata: $metadata }) {
        affected_rows
      }
      insert_member_phone(
        objects: $memberPhones
        on_conflict: { constraint: member_phone_member_id_phone_key, update_columns: [] }
      ) {
        affected_rows
      }
    }
  `)

  return updateMemberMetadata
}
