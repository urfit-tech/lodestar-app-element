import { UserComponent } from '@craftjs/core'
import { uniqBy } from 'ramda'
import { useMemo, useState } from 'react'
import { StringParam } from 'serialize-query-params'
import { useQueryParam } from 'use-query-params'
import { Category } from '../../types/data'
import { CustomSourceOptions, PublishedAtSourceOptions } from '../../types/options'
import ProgramPackageCard from '../cards/ProgramPackageCard'
import { CollectionLayout } from '../collections/Collection'
import {
  CustomProgramPackageCollection,
  ProgramPackageElementCollection,
  PublishedAtProgramPackageCollection,
} from '../collections/ProgramPackageCollection'
import { Craftize } from '../common'
import CategorySelector from '../common/CategorySelector'

export type CraftProgramPackageCollectionProps = {
  sourceOptions: CustomSourceOptions | PublishedAtSourceOptions
  variant?: 'card' | 'tile'
  layout?: CollectionLayout
  withSelector?: boolean
}

const CraftProgramPackageCollection: UserComponent<CraftProgramPackageCollectionProps> = ({
  variant = 'card',
  layout,
  sourceOptions,
  withSelector = false,
  children,
}) => {
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)
  const [categories, setCategories] = useState<Category[]>([])

  // options.source -> xxx collection
  const CraftCollection = useMemo(() => {
    // variant -> card / tile
    const craftElement = Craftize(variant === 'card' ? ProgramPackageCard : ProgramPackageCard)
    let ElementCollection: ProgramPackageElementCollection
    switch (sourceOptions.source) {
      case 'publishedAt':
        ElementCollection = PublishedAtProgramPackageCollection(craftElement)(sourceOptions)
        break
      case 'custom':
        ElementCollection = CustomProgramPackageCollection(craftElement)(sourceOptions)
        break
      default:
        ElementCollection = PublishedAtProgramPackageCollection(craftElement)(sourceOptions)
    }
    return (
      <ElementCollection
        layout={layout}
        transform={data =>
          data.filter(
            d =>
              !withSelector ||
              !activeCategoryId ||
              d.categories.map(category => category.id).includes(activeCategoryId),
          )
        }
        onLoad={data => {
          setCategories(
            uniqBy((category: Category) => category.id)(
              data
                .flatMap(d => d.categories)
                .filter(
                  category =>
                    sourceOptions.source === 'custom' || !sourceOptions.defaultCategoryIds?.includes(category.id),
                ),
            ),
          )
        }}
      />
    )
  }, [activeCategoryId, variant, layout, sourceOptions, withSelector])

  return (
    <div>
      {withSelector && (
        <CategorySelector
          categories={categories}
          activeCategoryId={activeCategoryId || null}
          onActive={categoryId => setActive(categoryId)}
        />
      )}
      {children}
      {CraftCollection}
    </div>
  )
}

export default CraftProgramPackageCollection
