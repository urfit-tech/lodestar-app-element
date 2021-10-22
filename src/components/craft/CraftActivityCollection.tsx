import { useEditor } from '@craftjs/core'
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
import CategorySelector from '../common/CategorySelector'

type CraftActivityCollectionProps = {
  variant: 'card' | 'tile'
  sourceOptions: CustomSourceOptions | PublishedAtSourceOptions
  layout?: CollectionLayout
  withSelector?: boolean
}

const CraftActivityCollection: React.FC<CraftActivityCollectionProps> = ({
  variant,
  layout,
  sourceOptions,
  withSelector = false,
  children,
}) => {
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)
  const [categories, setCategories] = useState<Category[]>([])
  const { editing } = useEditor(state => ({
    editing: state.options.enabled,
  }))

  // variant -> card / tile
  const element = variant === 'card' ? ActivityCard : ActivityCard

  // options.source -> xxx collection
  const CraftCollection = useMemo(() => {
    let ElementCollection: ActivityElementCollection
    switch (sourceOptions.source) {
      case 'publishedAt':
        ElementCollection = PublishedAtActivityCollection(element)(sourceOptions)
        break
      case 'custom':
        ElementCollection = CustomActivityCollection(element)(sourceOptions)
        break
      default:
        ElementCollection = PublishedAtActivityCollection(element)(sourceOptions)
        break
    }
    return (
      <ElementCollection
        editing={editing}
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
  }, [activeCategoryId, editing, element, layout, sourceOptions, withSelector])

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
