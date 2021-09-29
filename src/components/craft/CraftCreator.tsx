import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { Skeleton } from '@chakra-ui/react'
import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { gql } from 'graphql-tag'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import hasura from '../../hasura'
import { notEmpty } from '../../helpers'
import { CommonTextMixin } from '../../helpers/style'
import DefaultAvatar from '../../images/default-avatar.svg'
import { CraftRefBlock } from '../common'
import { CustomRatioImage } from '../Image'
import Layout from '../Layout'

const StyledCreatorName = styled.h2`
  color: var(--gray-darker);
  font-weight: bold;
  font-size: 20px;
  line-height: 1.5;
  letter-spacing: 0.77px;
`

const StyledCreatorTitle = styled.h3`
  color: var(--gray-darker);
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0.18px;
`

const StyledCreatorAbstract = styled.p`
  ${CommonTextMixin}
  line-height: 1.5;
`

const CraftCreator: UserComponent<{
  type: 'newest' | 'custom'
  ids: (string | null)[]
}> = ({ type, ids }) => {
  const apolloClient = useApolloClient()
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const {
    connectors: { connect },
    selected,
    hovered,
  } = useNode(node => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
  }))
  const [creatorIds, setCreatorIds] = useState<string[]>([])
  const { loading, creators } = usePublishedCreatorCollection(creatorIds)

  useEffect(() => {
    if (type === 'newest') {
      apolloClient
        .query({
          query: gql`
            query GET_NEWEST_CREATOR($limit: Int) {
              creator(where: { published_at: { _is_null: false } }, limit: $limit) {
                id
              }
            }
          `,
          variables: {
            limit: ids.length > 0 ? ids.length : undefined,
          },
        })
        .then(({ data }: { data?: hasura.GET_NEWEST_CREATOR }) => {
          setCreatorIds(data?.creator.map(v => v.id).filter(notEmpty) || [])
        })
    }
    if (type === 'custom') {
      setCreatorIds(ids.filter(notEmpty) || [])
    }
  }, [type, ids, apolloClient])

  if (loading) {
    return (
      <div>
        <Skeleton height="20px" className="my-1" />
        <Skeleton height="20px" className="my-1" />
        <Skeleton height="20px" className="my-1" />
      </div>
    )
  }

  const sortedCreator =
    type === 'custom'
      ? creatorIds.map(creatorId => creators.find(creator => creator.id === creatorId)).filter(notEmpty)
      : creators

  return (
    <Layout
      customStyle={{
        type: 'grid',
        mobile: {
          margin: { ml: '20', mr: '20' },
          columnAmount: 1,
          columnRatio: [1],
          displayAmount: ids.length,
        },
        desktop: {
          margin: { ml: '20', mr: '20' },
          columnAmount: 5,
          columnRatio: [1, 1, 1, 1, 1],
          displayAmount: ids.length,
        },
      }}
    >
      {sortedCreator.map(creator => (
        <CraftRefBlock
          key={creator.id}
          ref={ref => ref && connect(ref)}
          style={{
            width: '100%',
            marginBottom: '12px',
          }}
          events={{ hovered, selected }}
          options={{ enabled }}
        >
          <Link to={`/creators/${creator.id}`} onClick={enabled ? e => e.preventDefault() : undefined}>
            <CustomRatioImage
              width="100%"
              ratio={1}
              src={creator.pictureUrl || DefaultAvatar}
              className="mb-3"
              shape="rounded"
            />
            <StyledCreatorName className="mb-2">{creator.name}</StyledCreatorName>
            <StyledCreatorTitle className="mb-3">{creator.title}</StyledCreatorTitle>
            <StyledCreatorAbstract className="mb-3">{creator.abstract}</StyledCreatorAbstract>
          </Link>
        </CraftRefBlock>
      ))}
    </Layout>
  )
}

const usePublishedCreatorCollection = (ids: string[]) => {
  const { loading, error, data } = useQuery<hasura.GET_PUBLISHED_CREATOR, hasura.GET_PUBLISHED_CREATORVariables>(
    gql`
      query GET_PUBLISHED_CREATOR($ids: [String!]!) {
        creator(
          where: { id: { _in: $ids }, published_at: { _is_null: false } }
          order_by: { position: asc, published_at: desc }
        ) {
          id
          name
          picture_url
          member {
            title
            abstract
          }
        }
      }
    `,
    { variables: { ids } },
  )

  return {
    loading,
    error,
    creators:
      data?.creator.map(v => ({
        id: v.id || '',
        name: v.name || '',
        pictureUrl: v.picture_url || '',
        title: v.member?.title || '',
        abstract: v.member?.abstract || '',
      })) || [],
  }
}

export default CraftCreator
