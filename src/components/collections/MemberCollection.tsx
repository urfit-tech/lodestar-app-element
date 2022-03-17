import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { StringParam } from 'serialize-query-params'
import { DeepPick } from 'ts-deep-pick/lib'
import { useQueryParam } from 'use-query-params'
import { getMemberCollectionQuery } from '../../graphql/queries'
import * as hasura from '../../hasura'
import { notEmpty } from '../../helpers'
import { Member } from '../../types/data'
import { ElementComponent } from '../../types/element'
import { ProductCustomSource, ProductRoleSource } from '../../types/options'
import MemberPrimaryCard from '../cards/MemberPrimaryCard'
import MemberSecondaryCard from '../cards/MemberSecondaryCard'
import { BaseCarouselProps } from '../common/BaseCarousel'
import Collection, { CollectionLayout, ContextCollection } from './Collection'
import CollectionCarousel from './CollectionCarousel'

type MemberData = DeepPick<Member, 'id' | 'name' | 'title' | 'abstract' | 'pictureUrl' | 'description'>

type MemberContextCollection = ContextCollection<MemberData>

export type MemberCollectionProps = {
  name?: string
  source?: ProductCustomSource | ProductRoleSource
  variant?: 'primary' | 'secondary'
  layout?: CollectionLayout
  withSelector?: boolean
  collectionVariant?: 'grid' | 'carousel'
  carousel?: BaseCarouselProps
}
const MemberCollection: ElementComponent<MemberCollectionProps> = props => {
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)

  const { loading, errors, children, source = { from: 'role' } } = props
  if (loading || errors) {
    return null
  }

  const collectionName = props.name || window.location.pathname
  const EntityElement =
    props.variant === 'primary'
      ? MemberPrimaryCard
      : props.variant === 'secondary'
      ? MemberSecondaryCard
      : MemberPrimaryCard
  const ElementCollection =
    props.collectionVariant === 'carousel'
      ? CollectionCarousel(collectionName, 'member', EntityElement)
      : Collection(collectionName, 'member', EntityElement)

  let ContextCollection: MemberContextCollection
  switch (source.from) {
    case 'role':
      ContextCollection = collectRoleCollection(source)
      break
    case 'custom':
      ContextCollection = collectCustomCollection(source)
      break
    default:
      ContextCollection = collectRoleCollection(source)
  }

  return (
    <ContextCollection>
      {ctx => {
        return (
          <div className={props.className}>
            {ctx.loading ? (
              <ElementCollection layout={props.layout} carouselProps={props.carousel} loading />
            ) : ctx.errors ? (
              <ElementCollection layout={props.layout} carouselProps={props.carousel} errors={ctx.errors} />
            ) : (
              <ElementCollection
                layout={props.layout}
                carouselProps={props.carousel}
                data={ctx.data}
                renderElement={({ data: member, ElementComponent: MemberElement }) => (
                  <MemberElement
                    editing={props.editing}
                    id={member.id}
                    name={member.name || ''}
                    title={member.title}
                    abstract={member.abstract}
                    avatarUrl={member.pictureUrl}
                    description={member.description}
                  />
                )}
              />
            )}
          </div>
        )
      }}
    </ContextCollection>
  )
}

const collectCustomCollection = (options: ProductCustomSource) => {
  const MemberElementCollection: MemberContextCollection = ({ children }) => {
    const { data, loading, error } = useQuery<hasura.GET_MEMBER_COLLECTION, hasura.GET_MEMBER_COLLECTIONVariables>(
      getMemberCollectionQuery(memberFields),
      {
        variables: {
          limit: undefined,
          orderByClause: [],
          whereClause: {
            id: { _in: options.idList || [] },
          },
        },
      },
    )
    const orderedData = {
      ...data,
      member_public:
        options.idList
          ?.filter(memberId => data?.member_public.find(p => p.id === memberId))
          .map(memberId => data?.member_public.find(p => p.id === memberId))
          .filter(notEmpty) || [],
    }
    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: data && composeCollectionData(orderedData),
    })
  }
  return MemberElementCollection
}

const collectRoleCollection = (options: ProductRoleSource) => {
  const MemberElementCollection: MemberContextCollection = ({ children }) => {
    const { data, loading, error } = useQuery<hasura.GET_MEMBER_COLLECTION, hasura.GET_MEMBER_COLLECTIONVariables>(
      getMemberCollectionQuery(memberFields),
      {
        variables: {
          limit: options.limit || 100,
          orderByClause: [{ name: 'asc_nulls_last' as hasura.order_by }],
          whereClause: {
            role: { _eq: options.role },
          },
        },
      },
    )
    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: data && composeCollectionData(data),
    })
  }
  return MemberElementCollection
}

const composeCollectionData = (data: hasura.GET_MEMBER_COLLECTION): MemberData[] =>
  data.member_public.map(m => ({
    id: m.id || '',
    name: m.name || '',
    title: m.title,
    abstract: m.abstract,
    pictureUrl: m.picture_url,
    description: m.description,
  }))

const memberFields = gql`
  fragment memberFields on member_public {
    id
    name
    title
    abstract
    description
    picture_url
  }
`

export default MemberCollection
