import { pipe, prop, sortBy, uniqBy } from 'ramda'
import { useHistory } from 'react-router'
import { StringParam } from 'serialize-query-params'
import { useQueryParam } from 'use-query-params'
import { convertPathName } from '@lodestar/helpers'
import { ElementComponent } from '@lodestar/types/element'
import { PostCollectionCategory, PostCollectionItem } from '@lodestar/types/post'
import PostCard from '../cards/PostCard'
import { BaseCarouselProps } from '../common/BaseCarousel'
import CategorySelector from '../common/CategorySelector'
import Collection, { CollectionLayout } from './Collection'
import CollectionCarousel from './CollectionCarousel'

export type PostCollectionProps = {
  name?: string
  posts?: PostCollectionItem[]
  isFetching?: boolean
  fetchError?: Error
  defaultCategoryIds?: string[]
  layout?: CollectionLayout
  withSelector?: boolean
  withOrderSelector?: boolean
  collectionVariant?: 'grid' | 'carousel'
  carousel?: BaseCarouselProps
}

const PostCollection: ElementComponent<PostCollectionProps> = props => {
  const history = useHistory()
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)

  const {
    posts = [],
    isFetching,
    fetchError,
    defaultCategoryIds,
    children,
    loading: parentLoading,
    errors: parentErrors,
  } = props

  if (parentLoading || parentErrors) {
    return null
  }

  const collectionName = props.name || convertPathName(window.location.pathname)
  const EntityElement = PostCard
  const emptyText = ''

  const ElementCollection =
    props.collectionVariant === 'carousel'
      ? CollectionCarousel(collectionName, 'post', EntityElement)
      : Collection(collectionName, 'post', EntityElement, emptyText)

  const categories =
    isFetching || fetchError
      ? []
      : pipe(
          uniqBy((category: PostCollectionCategory) => category.id),
          sortBy(prop('position')),
        )(
          posts
            .flatMap(d => d.categories)
            .filter(category => !defaultCategoryIds || !defaultCategoryIds.includes(category.id)),
        )

  const postFilter = (d: PostCollectionItem) =>
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
      {isFetching ? (
        <ElementCollection layout={props.layout} carouselProps={props.carousel} loading />
      ) : fetchError ? (
        <ElementCollection layout={props.layout} carouselProps={props.carousel} errors={[fetchError]} />
      ) : (
        <ElementCollection
          layout={props.layout}
          carouselProps={props.carousel}
          data={posts.filter(postFilter)}
          renderElement={({ data: post, ElementComponent: PostElement, onClick }) => (
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
                !props.editing && history.push(`/posts/${post.codeName || post.id}`)
              }}
            />
          )}
        />
      )}
    </div>
  )
}

export default PostCollection
