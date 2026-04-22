import { ElementComponent } from '@lodestar/types/element'
import { ProgramContentCollectionItem } from '@lodestar/types/programContent'
import ProgramContentCard from '../cards/ProgramContentCard'
import { BaseCarouselProps } from '../common/BaseCarousel'
import Collection, { CollectionLayout } from './Collection'
import CollectionCarousel from './CollectionCarousel'

export type ProgramContentCollectionProps = {
  name?: string
  programContents?: ProgramContentCollectionItem[]
  isFetching?: boolean
  fetchError?: Error
  defaultCategoryIds?: string[]
  variant?: 'card' | 'tile'
  layout?: CollectionLayout
  withSelector?: boolean
  collectionVariant?: 'grid' | 'carousel'
  carousel?: BaseCarouselProps
}

const ProgramContentCollection: ElementComponent<ProgramContentCollectionProps> = props => {
  const {
    programContents = [],
    isFetching,
    fetchError,
    loading: parentLoading,
    errors: parentErrors,
  } = props

  if (parentLoading || parentErrors) {
    return null
  }

  const collectionName = props.name || window.location.pathname
  const EntityElement = props.variant === 'card' ? ProgramContentCard : ProgramContentCard
  const ElementCollection =
    props.collectionVariant === 'carousel'
      ? CollectionCarousel(collectionName, 'program_content', EntityElement)
      : Collection(collectionName, 'program_content', EntityElement)

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
          data={programContents}
          renderElement={({ data: programContent, ElementComponent: ProgramContentElement }) => (
            <ProgramContentElement
              editing={props.editing}
              title={programContent.title}
              link={`/programs/${programContent.contentSection.program.id}/contents/${programContent.id}`}
              coverUrl={
                programContent.contentSection.program.coverThumbnailUrl ||
                programContent.contentSection.program.coverUrl ||
                programContent.contentSection.program.coverMobileUrl
              }
              type={programContent.videos.length > 0 ? ('video' as const) : ('text' as const)}
              duration={programContent.duration}
              progress={programContent.progress}
            />
          )}
        />
      )}
    </div>
  )
}

export default ProgramContentCollection
