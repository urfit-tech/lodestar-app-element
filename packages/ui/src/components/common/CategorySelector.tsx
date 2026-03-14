import { Button } from '@chakra-ui/react'
import { useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'
import { Category } from '../../types/data'
import { ElementComponent } from '../../types/element'

type CategorySelectorProps = {
  categories: Category[]
  activeCategoryId: string | null
  onActive?: (categoryId: string | null) => void
}
const CategorySelector: ElementComponent<CategorySelectorProps> = props => {
  const { loading, errors, editing } = props
  const { formatMessage } = useIntl()
  if (errors) {
    return <div>Cannot read the data.</div>
  }
  return (
    <div className="category__button__group">
      {loading ? (
        <Button loading className="category__button" />
      ) : (
        <Button
          h="2.75rem"
          borderRadius="2rem"
          paddingLeft="1.5rem"
          paddingRight="1.5rem"
          colorScheme="primary"
          variant={!props.activeCategoryId ? 'solid' : 'outline'}
          className="mb-2 category__button"
          onClick={e => (editing ? e.preventDefault() : props.onActive?.(null))}
        >
          {formatMessage(commonMessages.button.allCategory)}
        </Button>
      )}
      {!loading &&
        props.categories.map(category => (
          <Button
            h="2.75rem"
            borderRadius="2rem"
            paddingLeft="1.5rem"
            paddingRight="1.5rem"
            key={category.id}
            colorScheme="primary"
            variant={props.activeCategoryId === category.id ? 'solid' : 'outline'}
            className="ml-2 mb-2 category__button"
            onClick={e => (editing ? e.preventDefault() : props.onActive?.(category.id))}
          >
            {category.name}
          </Button>
        ))}
    </div>
  )
}

export default CategorySelector
