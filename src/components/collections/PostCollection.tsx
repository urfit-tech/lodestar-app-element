import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { pipe, prop, sortBy, uniqBy } from 'ramda'
import { useHistory } from 'react-router'
import { StringParam } from 'serialize-query-params'
import { DeepPick } from 'ts-deep-pick/lib'
import { useQueryParam } from 'use-query-params'
import { getPostCollectionQuery } from '../../graphql/queries'
import * as hasura from '../../hasura'
import { convertPathName, notEmpty } from '../../helpers'
import { Category } from '../../types/data'
import { ElementComponent } from '../../types/element'
import { ProductCustomSource, ProductPublishedAtSource } from '../../types/options'
import { Post } from '../../types/post'
import PostCard from '../cards/PostCard'
import { BaseCarouselProps } from '../common/BaseCarousel'
import CategorySelector from '../common/CategorySelector'
import Collection, { CollectionLayout, ContextCollection } from './Collection'
import CollectionCarousel from './CollectionCarousel'

// @ts-ignore
type PostData = DeepPick<
  Post,
  'id' | 'codeName' | 'title' | 'coverUrl' | 'videoUrl' | 'publishedAt' | 'views' | 'pinnedAt' | 'author' | 'categories'
>

type PostContextCollection = ContextCollection<PostData>

export type PostCollectionProps = {
  name?: string
  source?: ProductCustomSource | ProductPublishedAtSource | ProductPublishedAtSource<'popular'>
  layout?: CollectionLayout
  withSelector?: boolean
  withOrderSelector?: boolean
  collectionVariant?: 'grid' | 'carousel'
  carousel?: BaseCarouselProps
}
const PostCollection: ElementComponent<PostCollectionProps> = props => {
  const history = useHistory()
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)

  const { loading, errors, children, source = { from: 'publishedAt' } } = props

  if (loading || errors) {
    return null
  }

  const collectionName = props.name || convertPathName(window.location.pathname)
  const EntityElement = PostCard
  let emptyText = ''

  const ElementCollection =
    props.collectionVariant === 'carousel'
      ? CollectionCarousel(collectionName, 'post', EntityElement)
      : Collection(collectionName, 'post', EntityElement, emptyText)
  let ContextCollection: PostContextCollection
  switch (source.from) {
    case 'publishedAt':
      ContextCollection = collectPublishedAtCollection(source)
      break
    case 'popular':
      ContextCollection = collectPopularCollection(source)
      break
    case 'custom':
      ContextCollection = collectCustomCollection(source)
      break
    default:
      ContextCollection = collectPublishedAtCollection(source)
      break
  }

  return (
    <ContextCollection>
      {ctx => {
        const categories =
          ctx.loading || ctx.errors
            ? []
            : pipe(
                uniqBy((category: Category) => category.id),
                sortBy(prop('position')),
              )(
                ctx.data
                  ?.flatMap(d => d.categories)
                  .filter(category => source.from === 'custom' || !source.defaultCategoryIds?.includes(category.id)) ||
                  [],
              )

        const postFilter = (d: PostData) =>
          !props.withSelector ||
          !activeCategoryId ||
          d.categories.map(category => category.id).includes(activeCategoryId)

        return (
          <div className={props.className}>
            <div className="d-flex justify-content-between">
              <div>
                {props.withSelector && (
                  <CategorySelector
                    categories={categories}
                    activeCategoryId={activeCategoryId || null}
                    onActive={categoryId => setActive(categoryId)}
                  />
                )}
              </div>
            </div>
            {children}
            {ctx.loading ? (
              <ElementCollection layout={props.layout} carouselProps={props.carousel} loading />
            ) : ctx.errors ? (
              <ElementCollection layout={props.layout} carouselProps={props.carousel} errors={ctx.errors} />
            ) : (
              <ElementCollection
                layout={props.layout}
                carouselProps={props.carousel}
                data={ctx.data?.filter(postFilter) || []}
                renderElement={({ data: post, ElementComponent: PostElement, onClick }) => {
                  return (
                    <PostElement
                      editing={props.editing}
                      id={post.id}
                      title={post.title}
                      codeName={post.codeName}
                      coverUrl={post.coverUrl || ''}
                      videoUrl={post.videoUrl || ''}
                      categories={post.categories}
                      author={post.author}
                      publishedAt={post.publishedAt}
                      onClick={() => {
                        onClick?.()
                        !props.editing && history.push(`/post/${post.codeName || post.id}`)
                      }}
                    />
                  )
                }}
              />
            )}
          </div>
        )
      }}
    </ContextCollection>
  )
}

const collectCustomCollection = (options: ProductCustomSource) => {
  const PostElementCollection: PostContextCollection = ({ children }) => {
    const { data, loading, error } = useQuery<hasura.GET_POST_COLLECTION, hasura.GET_POST_COLLECTIONVariables>(
      getPostCollectionQuery(postFields),
      {
        variables: {
          limit: undefined,
          orderByClause: [],
          whereClause: {
            id: { _in: options.idList || [] },
            published_at: { _lt: 'now()' },
          },
        },
      },
    )
    const postCollectionData =
      data &&
      composeCollectionData({
        ...data,
        post: (options.idList || [])
          .filter(postId => data?.post.find(p => p.id === postId))
          .map(postId => data?.post.find(p => p.id === postId))
          .filter(notEmpty),
      })

    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: postCollectionData,
    })
  }
  return PostElementCollection
}

const collectPublishedAtCollection = (options: ProductPublishedAtSource) => {
  const PostElementCollection: PostContextCollection = ({ children }) => {
    const { data, loading, error } = useQuery<hasura.GET_POST_COLLECTION, hasura.GET_POST_COLLECTIONVariables>(
      getPostCollectionQuery(postFields),
      {
        variables: {
          limit: options.limit,
          orderByClause: [{ published_at: (options.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by }],
          whereClause: {
            is_deleted: { _eq: false },
            published_at: { _lt: 'now()' },
            post_categories: options.defaultCategoryIds?.length
              ? {
                  category_id: {
                    _in: options.defaultCategoryIds,
                  },
                }
              : undefined,
            post_tags: options.defaultTagNames?.length
              ? {
                  tag_name: {
                    _in: options.defaultTagNames,
                  },
                }
              : undefined,
          },
        },
      },
    )
    const composedData = data ? composeCollectionData(data) : []

    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: composedData,
    })
  }
  return PostElementCollection
}

const collectPopularCollection = (options: ProductPublishedAtSource<'popular'>) => {
  const PostElementCollection: PostContextCollection = ({ children }) => {
    const { data, loading, error } = useQuery<hasura.GET_POST_COLLECTION, hasura.GET_POST_COLLECTIONVariables>(
      getPostCollectionQuery(postFields),
      {
        variables: {
          limit: options.limit,
          orderByClause: [
            { views: (options.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by },
            { published_at: 'desc_nulls_last' as hasura.order_by },
          ],
          whereClause: {
            is_deleted: { _eq: false },
            published_at: { _lt: 'now()' },
            post_categories: options.defaultCategoryIds?.length
              ? {
                  category_id: {
                    _in: options.defaultCategoryIds,
                  },
                }
              : undefined,
            post_tags: options.defaultTagNames?.length
              ? {
                  tag_name: {
                    _in: options.defaultTagNames,
                  },
                }
              : undefined,
          },
        },
      },
    )
    const composedData = data ? composeCollectionData(data) : []

    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: composedData,
    })
  }
  return PostElementCollection
}

const composeCollectionData = (data: hasura.GET_POST_COLLECTION): PostData[] =>
  data.post.map(p => ({
    id: p.id,
    title: p.title,
    coverUrl: p.cover_url,
    videoUrl: p.video_url,
    publishedAt: p.published_at ? new Date(p.published_at) : null,
    views: Number(p.views),
    codeName: p.code_name,
    pinnedAt: p.pinned_at ? new Date(p.pinned_at) : null,
    author: {
      id: p.post_roles?.[0]?.id || '',
      memberId: p.post_roles?.[0].member?.id || '',
      name: p.post_roles?.[0].member?.name || '',
    },
    categories: p.post_categories.map(pc => ({
      id: pc.category.id,
      name: pc.category.name,
      position: pc.category.position,
    })),
  }))

const postFields = gql`
  fragment postFields on post {
    id
    title
    cover_url
    video_url
    published_at
    views
    code_name
    pinned_at
    post_roles(where: { name: { _eq: "author" } }, order_by: { position: desc }) {
      id
      member {
        id
        name
      }
    }
    post_categories(order_by: { position: asc }) {
      id
      category {
        id
        name
        position
      }
    }
  }
`

export default PostCollection
