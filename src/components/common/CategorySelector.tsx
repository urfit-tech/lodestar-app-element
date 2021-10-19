import { Button } from '@chakra-ui/react'
import { useEditor, useNode } from '@craftjs/core'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { CraftRefBlock } from '.'
import { commonMessages } from '../../helpers/translation'
import { Category } from '../../types/data'

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
const CategorySelector: React.VFC<CategorySelectorProps> = ({ categories, activeCategoryId, onActive }) => {
  const { formatMessage } = useIntl()
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const {
    connectors: { connect },
    selected,
    hovered,
  } = useNode(node => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
  }))
  return (
    <CraftRefBlock
      className="mb-3"
      ref={ref => ref && connect(ref)}
      events={{ hovered, selected }}
      options={{ enabled }}
    >
      <StyledButton
        colorScheme="primary"
        variant={!activeCategoryId ? 'solid' : 'outline'}
        className="mb-2"
        onClick={(e: Event) => (enabled ? e.preventDefault() : onActive?.(null))}
      >
        {formatMessage(commonMessages.button.allCategory)}
      </StyledButton>
      {categories.map(category => (
        <StyledButton
          key={category.id}
          colorScheme="primary"
          variant={activeCategoryId === category.id ? 'solid' : 'outline'}
          className="ml-2 mb-2"
          onClick={(e: Event) => (enabled ? e.preventDefault() : onActive?.(category.id))}
        >
          {category.name}
        </StyledButton>
      ))}
    </CraftRefBlock>
  )
}

export default CategorySelector
