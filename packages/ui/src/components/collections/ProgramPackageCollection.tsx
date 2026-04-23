import moment from 'moment'
import { sum, uniqBy } from 'ramda'
import { useHistory } from 'react-router'
import { StringParam } from 'serialize-query-params'
import { useQueryParam } from 'use-query-params'
import { convertPathName, findPrimaryPlan } from '@lodestar/helpers'
import { Category, ProductPlan } from '@lodestar/types/data'
import { ElementComponent } from '@lodestar/types/element'
import { ProgramPackageCollectionCategory, ProgramPackageCollectionItem } from '@lodestar/types/programPackage'
import ProgramPackageCard from '../cards/ProgramPackageCard'
import { BaseCarouselProps } from '../common/BaseCarousel'
import CategorySelector from '../common/CategorySelector'
import Collection, { CollectionLayout } from './Collection'
import CollectionCarousel from './CollectionCarousel'

export type ProgramPackageCollectionProps = {
  name?: string
  programPackages?: ProgramPackageCollectionItem[]
  isFetching?: boolean
  fetchError?: Error
  defaultCategoryIds?: string[]
  variant?: 'card' | 'tile'
  layout?: CollectionLayout
  withSelector?: boolean
  collectionVariant?: 'grid' | 'carousel'
  carousel?: BaseCarouselProps
}

const ProgramPackageCollection: ElementComponent<ProgramPackageCollectionProps> = (props) => {
  const history = useHistory()
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)

  const {
    programPackages = [],
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
  const EntityElement = props.variant === 'card' ? ProgramPackageCard : ProgramPackageCard
  const ElementCollection =
    props.collectionVariant === 'carousel'
      ? CollectionCarousel(collectionName, 'program_package', EntityElement)
      : Collection(collectionName, 'program_package', EntityElement)

  const categories: Category[] =
    isFetching || fetchError
      ? []
      : uniqBy((category: ProgramPackageCollectionCategory) => category.id)(
          programPackages
            .flatMap((d) => d.categories)
            .filter((category) => !defaultCategoryIds || !defaultCategoryIds.includes(category.id)),
        )

  const filterByActiveCategory = (d: ProgramPackageCollectionItem) =>
    !props.withSelector || !activeCategoryId || d.categories.map((category) => category.id).includes(activeCategoryId)

  return (
    <div className={props.className}>
      {props.withSelector && (
        <CategorySelector
          categories={categories}
          activeCategoryId={activeCategoryId || null}
          onActive={(categoryId) => setActive(categoryId)}
        />
      )}
      {children}
      {isFetching ? (
        <ElementCollection layout={props.layout} carouselProps={props.carousel} loading />
      ) : fetchError ? (
        <ElementCollection layout={props.layout} carouselProps={props.carousel} errors={[fetchError]} />
      ) : (
        <ElementCollection
          layout={props.layout}
          carouselProps={props.carousel}
          data={programPackages.filter(filterByActiveCategory)}
          renderElement={({ data: programPackage, ElementComponent: ProgramPackageElement, onClick }) => {
            const primaryPlan = findPrimaryPlan(programPackage.plans as Partial<ProductPlan>[])
            return (
              <ProgramPackageElement
                editing={props.editing}
                coverUrl={programPackage.coverUrl || undefined}
                title={programPackage.title}
                link={`/program-packages/${programPackage.id}`}
                totalPrograms={programPackage.programs.length}
                totalDuration={sum(programPackage.programs.map((program) => program.totalDuration))}
                salePrice={
                  typeof primaryPlan?.salePrice === 'number' &&
                  primaryPlan?.soldAt &&
                  moment() < moment(primaryPlan.soldAt as Date)
                    ? primaryPlan.salePrice
                    : undefined
                }
                listPrice={primaryPlan?.listPrice}
                onClick={() => {
                  onClick?.()
                  !props.editing && history.push(`/program-packages/${programPackage.id}`)
                }}
              />
            )
          }}
        />
      )}
    </div>
  )
}

export default ProgramPackageCollection
