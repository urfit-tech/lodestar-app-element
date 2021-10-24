import { Button } from '@chakra-ui/react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import { Category } from '../../types/data'
import { ElementComponent } from '../../types/element'

const StyledButton = styled(Button)`
  && {
    height: 2.75rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    border-radius: 2rem;
  }
`

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
    <div>
      {loading ? (
        <Button loading />
      ) : (
        <StyledButton
          colorScheme="primary"
          variant={!props.activeCategoryId ? 'solid' : 'outline'}
          className="mb-2"
          onClick={(e: Event) => (editing ? e.preventDefault() : props.onActive?.(null))}
        >
          {formatMessage(commonMessages.button.allCategory)}
        </StyledButton>
      )}
      {!loading &&
        props.categories.map(category => (
          <StyledButton
            key={category.id}
            colorScheme="primary"
            variant={props.activeCategoryId === category.id ? 'solid' : 'outline'}
            className="ml-2 mb-2"
            onClick={(e: Event) => (editing ? e.preventDefault() : props.onActive?.(category.id))}
          >
            {category.name}
          </StyledButton>
        ))}
    </div>
  )
}

export default CategorySelector
