import { useEditor, useNode, UserComponent } from '@craftjs/core'
import React from 'react'
import styled from 'styled-components'
import { CraftBoxModelProps, CraftImageProps, CraftParagraphProps, CraftTitleProps } from '../../types/craft'
import { CraftRefBlock } from '../common'
import Stat from '../Stat'

const StatisticsWrapper = styled.div`
  width: fit-content;
  text-align: center;
`

export type CraftStatisticsProps = CraftImageProps &
  CraftBoxModelProps & { title: CraftTitleProps; paragraph: CraftParagraphProps }

const CraftStatistics: UserComponent<CraftStatisticsProps> = ({
  type,
  title,
  paragraph,
  padding,
  margin,
  coverUrl,
}) => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const {
    connectors: { connect, drag },
    selected,
    hovered,
  } = useNode(node => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
  }))

  return (
    <CraftRefBlock ref={ref => ref && connect(drag(ref))} options={{ enabled }} events={{ hovered, selected }}>
      <StatisticsWrapper>
        <Stat.Image
          style={{
            display: type === 'image' ? 'inline-block' : 'none',
          }}
          src={coverUrl}
          customStyle={{
            ...padding,
            ...margin,
          }}
        />
        <Stat.Digit
          customStyle={{
            textAlign: title.textAlign || 'center',
            fontSize: title.fontSize || '20',
            fontWeight: title.fontWeight || 'normal',
            color: title.color || '#585858',
            mb: '16',
            ...title.margin,
          }}
        >
          {title.titleContent}
        </Stat.Digit>
        <Stat.Content
          customStyle={{
            textAlign: paragraph.textAlign || 'center',
            fontSize: paragraph.fontSize || '20',
            fontWeight: paragraph.fontWeight || 'normal',
            lineHeight: paragraph.lineHeight || 1,
            color: paragraph.color || '#585858',
            ...paragraph.margin,
          }}
        >
          {paragraph.paragraphContent}
        </Stat.Content>
      </StatisticsWrapper>
    </CraftRefBlock>
  )
}

export default CraftStatistics
