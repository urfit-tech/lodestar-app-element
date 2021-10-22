import { useEditor, UserComponent } from '@craftjs/core'
import { uniqBy } from 'ramda'
import { useMemo, useState } from 'react'
import { StringParam } from 'serialize-query-params'
import { useQueryParam } from 'use-query-params'
import { Category } from '../../types/data'
import { CurrentPriceSourceOptions, CustomSourceOptions, PublishedAtSourceOptions } from '../../types/options'
import ProgramCard from '../cards/ProgramCard'
import { CollectionLayout } from '../collections/Collection'
import {
  CurrentPriceProgramCollection,
  CustomProgramCollection,
  ProgramElementCollection,
  PublishedAtProgramCollection,
} from '../collections/ProgramCollection'
import { Craftize } from '../common'
import CategorySelector from '../common/CategorySelector'

export type CraftProgramCollectionProps = {
  sourceOptions: CustomSourceOptions | PublishedAtSourceOptions | CurrentPriceSourceOptions
  variant?: 'card' | 'tile'
  layout?: CollectionLayout
  withSelector?: boolean
}

const CraftProgramCollection: UserComponent<CraftProgramCollectionProps> = ({
  variant = 'card',
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

  // options.source -> xxx collection
  // variant -> card / tile
  const CraftCollection = useMemo(() => {
    const craftElement = Craftize(variant === 'card' ? ProgramCard : ProgramCard)
    let ElementCollection: ProgramElementCollection
    switch (sourceOptions.source) {
      case 'publishedAt':
        ElementCollection = PublishedAtProgramCollection(craftElement)(sourceOptions)
        break
      case 'currentPrice':
        ElementCollection = CurrentPriceProgramCollection(craftElement)(sourceOptions)
        break
      case 'custom':
        ElementCollection = CustomProgramCollection(craftElement)(sourceOptions)
        break
      default:
        ElementCollection = PublishedAtProgramCollection(craftElement)(sourceOptions)
    }
    return (
      <ElementCollection
        editing={editing}
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
  }, [activeCategoryId, editing, layout, sourceOptions, variant, withSelector])

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

export default CraftProgramCollection
