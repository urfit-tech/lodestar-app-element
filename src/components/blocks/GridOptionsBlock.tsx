import { Grid, GridItem } from '@chakra-ui/react'
import React, { useState } from 'react'
import styled from 'styled-components'
import { QuestionOption } from '../../types/questionLibrary'

const GridOption = styled.div<{ font: string; selected: boolean }>`
  @font-face {
    font-family: 'BpmfGenSenRounded';
    src: url('../../fonts/BpmfGenSenRounded/BpmfGenSenRounded-R.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'BpmfGenSenRounded';
    src: url('../../fonts/BpmfGenSenRounded/BpmfGenSenRounded-B.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  outline: ${props => (props.selected ? `2px solid ${props.theme['@primary-color']}` : '1px solid var(--gray)')};
  border-radius: 4px;
  padding: 20px;
  font-family: ${props => (props.font === 'zhuyin' ? 'BpmfGenSenRounded' : 'inherit')};
  font-size: ${props => (props.font === 'zhuyin' ? '32px' : '16px')};
  img {
    object-fit: contain;
    aspect-ratio: 1;
  }
`

const GridOptionsBlock: React.FC<{ optionList?: QuestionOption[]; questionFontType?: string }> = ({
  optionList,
  questionFontType = 'auto',
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>('')
  return (
    (optionList && (
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        {optionList?.map(option => (
          <GridItem key={option.id} colSpan={1} w="100%">
            <GridOption
              dangerouslySetInnerHTML={{ __html: option.value }}
              font={questionFontType}
              selected={selectedOptionId === option.id ? true : false}
              onClick={() => setSelectedOptionId(option.id)}
            />
          </GridItem>
        ))}
      </Grid>
    )) ||
    null
  )
}

export default GridOptionsBlock
