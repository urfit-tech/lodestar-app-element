import moment from 'moment'
import { pipe, prop, sortBy, uniqBy } from 'ramda'
import { useHistory } from 'react-router'
import { StringParam } from 'serialize-query-params'
import { useQueryParam } from 'use-query-params'
import { convertPathName } from '@lodestar/helpers'
import { ElementComponent } from '@lodestar/types/element'
import {
  ProductCurrentPriceSource,
  ProductCustomSource,
  ProductPublishedAtSource,
  ProductRecentWatchedSource,
} from '@lodestar/types/options'
import {
  ProgramCollectionCategory,
  ProgramCollectionItem,
} from '@lodestar/types/program'
import ProgramPrimaryCard from '../cards/ProgramPrimaryCard'
import ProgramSecondaryCard from '../cards/ProgramSecondaryCard'
import { BaseCarouselProps } from '../common/BaseCarousel'
import CategorySelector from '../common/CategorySelector'
import OrderSelector from '../common/OrderSelector'
import Collection, { CollectionLayout } from './Collection'
import CollectionCarousel from './CollectionCarousel'

// Mirrors the `sourceFrom` / `onChange` union of
// `common/OrderSelector.tsx`. The UI component is source-agnostic beyond
// "which ordering label the OrderSelector should render"; narrowing the
// string to the same literal union keeps the wrapper wiring TS-safe
// without taking a data-layer dependency on `ProgramCollectionSource`.
export type ProgramCollectionSourceFrom =
  | ProductCustomSource['from']
  | ProductPublishedAtSource['from']
  | ProductPublishedAtSource<'popular'>['from']
  | ProductCurrentPriceSource['from']
  | ProductRecentWatchedSource['from']

export type ProgramCollectionProps = {
  name?: string
  programs?: ProgramCollectionItem[]
  isFetching?: boolean
  fetchError?: Error
  defaultCategoryIds?: string[]
  variant?: 'primary' | 'secondary'
  layout?: CollectionLayout
  withSelector?: boolean
  collectionVariant?: 'grid' | 'carousel'
  carousel?: BaseCarouselProps
  withOrderSelector?: boolean
  sourceFrom?: ProgramCollectionSourceFrom
  onSourceFromChange?: (next: ProgramCollectionSourceFrom) => void
  emptyText?: string
}

const ProgramCollection: ElementComponent<ProgramCollectionProps> = props => {
  const history = useHistory()
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)
  const {
    programs = [],
    isFetching,
    fetchError,
    defaultCategoryIds,
    emptyText = '',
    sourceFrom,
    onSourceFromChange,
    loading: parentLoading,
    errors: parentErrors,
    children,
  } = props

  if (parentLoading || parentErrors) {
    return null
  }

  const collectionName = props.name || convertPathName(window.location.pathname)
  const EntityElement =
    props.variant === 'primary'
      ? ProgramPrimaryCard
      : props.variant === 'secondary'
      ? ProgramSecondaryCard
      : ProgramPrimaryCard
  const ElementCollection =
    props.collectionVariant === 'carousel'
      ? CollectionCarousel(collectionName, 'program', EntityElement)
      : Collection(collectionName, 'program', EntityElement, emptyText)

  const categories =
    isFetching || fetchError
      ? []
      : pipe(
          uniqBy((category: ProgramCollectionCategory) => category.id),
          sortBy(prop('position')),
        )(
          programs
            .flatMap(d => d.categories)
            .filter(category => !defaultCategoryIds?.includes(category.id)),
        )

  const programFilter = (d: ProgramCollectionItem) =>
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
        <div>
          {props.withOrderSelector && (
            <OrderSelector
              sourceFrom={sourceFrom ?? 'publishedAt'}
              withOrderSelector={props.withOrderSelector}
              onChange={next => onSourceFromChange?.(next)}
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
          data={programs.filter(programFilter)}
          renderElement={({ data: program, ElementComponent: ProgramElement, onClick }) => {
            const primaryProgramPlan = program.plans[0]
            return (
              <ProgramElement
                editing={props.editing}
                id={program.id}
                title={program.title}
                abstract={program.abstract || ''}
                totalDuration={program.totalDuration || 0}
                coverUrl={program.coverThumbnailUrl || program.coverMobileUrl || program.coverUrl}
                label={program.label}
                labelColorType={program.labelColorType}
                instructorIds={program.roles.map(programRole => programRole.member.id)}
                salePrice={
                  typeof primaryProgramPlan?.salePrice === 'number' &&
                  primaryProgramPlan?.soldAt &&
                  moment() < moment(primaryProgramPlan.soldAt)
                    ? primaryProgramPlan.salePrice
                    : undefined
                }
                listPrice={primaryProgramPlan?.listPrice ?? undefined}
                period={primaryProgramPlan?.period || undefined}
                isEnrolledCountVisible={program.isEnrolledCountVisible}
                categories={program.categories}
                roles={program.roles.map(role => ({
                  id: role.id,
                  name: role.name,
                  member: {
                    id: role.member.id,
                    name: role.member.name,
                    pictureUrl: role.member.pictureUrl,
                  },
                }))}
                onClick={() => {
                  onClick?.()
                  !props.editing && history.push(`/programs/${program.id}`)
                }}
                historicalProgramPlanBuyers={program.historicalProgramPlanBuyers}
                historicalProgramPackagePlanBuyers={program.historicalProgramPackagePlanBuyers}
                reviewCount={program.reviewCount}
                reviewAverageScore={program.reviewAverageScore}
              />
            )
          }}
        />
      )}
    </div>
  )
}

export default ProgramCollection
