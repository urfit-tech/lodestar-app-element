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
import CategorySelector from '../common/CategorySelector'

type CraftProgramCollectionProps = {
  variant: 'card' | 'tile'
  sourceOptions: CustomSourceOptions | PublishedAtSourceOptions | CurrentPriceSourceOptions
  layout?: CollectionLayout
  withSelector?: boolean
}

const CraftProgramCollection: UserComponent<CraftProgramCollectionProps> = ({
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
  const element = variant === 'card' ? ProgramCard : ProgramCard

  // options.source -> xxx collection
  const CraftCollection = useMemo(() => {
    let ElementCollection: ProgramElementCollection
    switch (sourceOptions.source) {
      case 'publishedAt':
        ElementCollection = PublishedAtProgramCollection(element)(sourceOptions)
        break
      case 'currentPrice':
        ElementCollection = CurrentPriceProgramCollection(element)(sourceOptions)
        break
      case 'custom':
        ElementCollection = CustomProgramCollection(element)(sourceOptions)
        break
      default:
        ElementCollection = PublishedAtProgramCollection(element)(sourceOptions)
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

export default CraftProgramCollection
