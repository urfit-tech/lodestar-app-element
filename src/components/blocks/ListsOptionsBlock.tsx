import React, { useState } from 'react'
import styled from 'styled-components'
import checkIconSrc from '../../images/icons/check.svg'
import { QuestionOption } from '../../types/questionLibrary'

const ListsOption = styled.div<{ font: string; selected: boolean }>`
  position: relative;
  padding: 20px;
  margin-bottom: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: #585858;
  border: 1px solid ${props => (props.selected ? props.theme['@primary-color'] : 'var(--gray)')};
  border-radius: 4px;
  font-family: ${props => (props.font === 'zhuyin' ? 'BpmfGenSenRounded' : 'inherit')};
  font-size: ${props => (props.font === 'zhuyin' ? '32px' : '16px')};
  img {
    object-fit: contain;
    aspect-ratio: 1;
  }
  &:after {
    content: '';
    display: ${props => (props.selected ? 'block' : 'none')};
    position: absolute;
    width: 20px;
    height: 20px;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    mask: url(${checkIconSrc}) no-repeat center;
    mask-size: contain;
    background-color: ${props => props.theme['@primary-color']};
  }
`

const ListsOptionsBlock: React.VFC<{ optionList?: QuestionOption[]; questionFontType?: string }> = ({
  optionList,
  questionFontType = 'auto',
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>('')
  return (
    (optionList && (
      <>
        {optionList?.map(option => (
          <ListsOption
            key={option.id}
            dangerouslySetInnerHTML={{ __html: option.value }}
            font={questionFontType}
            selected={selectedOptionId === option.id ? true : false}
            onClick={() => setSelectedOptionId(option.id)}
          />
        ))}
      </>
    )) ||
    null
  )
}

export default ListsOptionsBlock
