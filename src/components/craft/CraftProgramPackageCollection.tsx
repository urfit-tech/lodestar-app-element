import { useEditor, UserComponent } from '@craftjs/core'
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
  const { editing } = useEditor(state => ({
    editing: state.options.enabled,
  }))

  // variant -> card / tile
  const element = variant === 'card' ? ProgramPackageCard : ProgramPackageCard

  // options.source -> xxx collection
  const CraftCollection = useMemo(() => {
    let ElementCollection: ProgramPackageElementCollection
    switch (sourceOptions.source) {
      case 'publishedAt':
        ElementCollection = PublishedAtProgramPackageCollection(element)(sourceOptions)
        break
      case 'custom':
        ElementCollection = CustomProgramPackageCollection(element)(sourceOptions)
        break
      default:
        ElementCollection = PublishedAtProgramPackageCollection(element)(sourceOptions)
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

export default CraftProgramPackageCollection
