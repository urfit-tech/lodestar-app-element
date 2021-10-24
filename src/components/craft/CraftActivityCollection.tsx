import { UserComponent } from '@craftjs/core'
import { uniqBy } from 'ramda'
import { useMemo, useState } from 'react'
import { StringParam } from 'serialize-query-params'
import { useQueryParam } from 'use-query-params'
import { Category } from '../../types/data'
import { CustomSourceOptions, PublishedAtSourceOptions } from '../../types/options'
import ActivityCard from '../cards/ActivityCard'
import {
  ActivityElementCollection,
  CustomActivityCollection,
  PublishedAtActivityCollection,
} from '../collections/ActivityCollection'
import { CollectionLayout } from '../collections/Collection'
import { Craftize } from '../common'
import CategorySelector from '../common/CategorySelector'

export type CraftActivityCollectionProps = {
  sourceOptions: CustomSourceOptions | PublishedAtSourceOptions
  variant?: 'card' | 'tile'
  layout?: CollectionLayout
  withSelector?: boolean
}

const CraftActivityCollection: UserComponent<CraftActivityCollectionProps> = ({
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
    const craftElement = Craftize(variant === 'card' ? ActivityCard : ActivityCard)

    let ElementCollection: ActivityElementCollection
    switch (sourceOptions.source) {
      case 'publishedAt':
        ElementCollection = PublishedAtActivityCollection(craftElement)(sourceOptions)
        break
      case 'custom':
        ElementCollection = CustomActivityCollection(craftElement)(sourceOptions)
        break
      default:
        ElementCollection = PublishedAtActivityCollection(craftElement)(sourceOptions)
        break
    }
    return (
      <ElementCollection
        layout={layout}
        transform={activities =>
          activities.filter(
            activity =>
              !withSelector ||
              !activeCategoryId ||
              activity.categories.map(category => category.id).includes(activeCategoryId),
          )
        }
        onLoad={activities =>
          setCategories(
            uniqBy((category: Category) => category.id)(
              activities
                .flatMap(activity => activity.categories)
                .filter(
                  category =>
                    sourceOptions.source === 'custom' || !sourceOptions.defaultCategoryIds?.includes(category.id),
                ),
            ),
          )
        }
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

export default CraftActivityCollection
