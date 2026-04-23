import { convertPathName } from '@lodestar/helpers'
import { MemberCollectionItem } from '@lodestar/types/member'
import { ElementComponent } from '@lodestar/types/element'
import MemberPrimaryCard from '../cards/MemberPrimaryCard'
import MemberSecondaryCard from '../cards/MemberSecondaryCard'
import { BaseCarouselProps } from '../common/BaseCarousel'
import Collection, { CollectionLayout } from './Collection'
import CollectionCarousel from './CollectionCarousel'

export type MemberCollectionProps = {
  name?: string
  members?: MemberCollectionItem[]
  isFetching?: boolean
  fetchError?: Error
  variant?: 'primary' | 'secondary'
  layout?: CollectionLayout
  withSelector?: boolean
  collectionVariant?: 'grid' | 'carousel'
  carousel?: BaseCarouselProps
}

const MemberCollection: ElementComponent<MemberCollectionProps> = (props) => {
  const { members = [], isFetching, fetchError, loading: parentLoading, errors: parentErrors } = props
  if (parentLoading || parentErrors) {
    return null
  }

  const collectionName = props.name || convertPathName(window.location.pathname)
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

  return (
    <div className={props.className}>
      {isFetching ? (
        <ElementCollection layout={props.layout} carouselProps={props.carousel} loading />
      ) : fetchError ? (
        <ElementCollection layout={props.layout} carouselProps={props.carousel} errors={[fetchError]} />
      ) : (
        <ElementCollection
          layout={props.layout}
          carouselProps={props.carousel}
          data={members}
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
}

export default MemberCollection
