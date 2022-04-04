import { useQuery } from '@apollo/react-hooks'
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import { useMemo } from 'react'
import hasura from '../hasura'

export type ResourceType =
  | 'program_package'
  | 'program_package_plan'
  | 'program'
  | 'program_content'
  | 'program_plan'
  | 'activity'
  | 'activity_ticket'
  | 'podcast_album'
  | 'podcast_plan'
  | 'podcast_program'
  | 'member_shop'
  | 'merchandise'
  | 'merchandise_spec'
  | 'project'
  | 'post'
  | 'member'
  | 'unknown'

export type Resource = {
  id: string
  urn: string
  type: ResourceType
  title: string
  sku?: string
  price?: number
  categories?: string[]
  variants?: string[]
  products?: (Resource | null)[]
  metaId?: string
}

const composeResourceCollection = (
  urns: string[],
  data?: hasura.GET_RESOURCE_COLLECTION,
  withProducts: boolean = false,
): (Resource | null)[] => {
  const resources =
    data?.resource
      .filter(v => v.id !== null)
      .map(v => {
        const resourceUrn = v.id as string
        const [, resourceType, resourceId] = resourceUrn.split(':')
        return {
          urn: resourceUrn,
          id: resourceId,
          type: resourceType as ResourceType,
          title: v.name || '',
          price: v.price || 0,
          categories: v.categories || [],
          variants: v.variants || [],
          sku: v.sku || undefined,
          metaId: v.meta_id || undefined,
        }
      }) || []

  const filteredResources = urns.map(urn => {
    const resourceData = resources.find(v => v.urn === urn)
    return resourceData ?? null
  })
  if (withProducts) {
    const resourceWithProducts = filteredResources.map(resource => {
      return resource
        ? {
            ...resource,
            products: resources.filter(r => r.metaId === resource.urn && r.urn !== resource.urn),
          }
        : null
    })
    return resourceWithProducts
  }

  return filteredResources
}

export const getResourceCollection = async (
  apolloClient: ApolloClient<unknown>,
  urns: string[],
): Promise<(Resource | null)[]> => {
  const { data } = await apolloClient.query<hasura.GET_RESOURCE_COLLECTION, hasura.GET_RESOURCE_COLLECTIONVariables>({
    query: GET_RESOURCE_COLLECTION,
    variables: { urns },
  })
  const resourceCollection = composeResourceCollection(urns, data, false)
  return resourceCollection
}

export const useResourceCollection = (urns: string[], withProducts: boolean = false) => {
  const { data } = useQuery<hasura.GET_RESOURCE_COLLECTION, hasura.GET_RESOURCE_COLLECTIONVariables>(
    GET_RESOURCE_COLLECTION,
    {
      variables: { urns },
    },
  )
  const resourceCollection: (Resource | null)[] = useMemo(
    () => composeResourceCollection(urns, data, withProducts),
    [data, urns, withProducts],
  )
  return {
    resourceCollection,
  }
}

const GET_RESOURCE_COLLECTION = gql`
  query GET_RESOURCE_COLLECTION($urns: [String!]!) {
    resource(where: { _or: [{ id: { _in: $urns } }, { meta_id: { _in: $urns } }] }) {
      id
      name
      price
      categories
      variants
      sku
      meta_id
    }
  }
`
