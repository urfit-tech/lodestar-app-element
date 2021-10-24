import styled from 'styled-components'
import { CraftBoxModelProps, CraftImageProps, CraftParagraphProps, CraftTitleProps } from '../../types/craft'
import { ElementComponent } from '../../types/element'
import Stat from './Stat'

const StatisticsWrapper = styled.div`
  width: fit-content;
  text-align: center;
`

export type StatisticsProps = CraftImageProps &
  CraftBoxModelProps & { title: CraftTitleProps; paragraph: CraftParagraphProps }

const Statistics: ElementComponent<StatisticsProps> = props => {
  if (props.loading || props.errors) {
    return null
  }
  return (
    <StatisticsWrapper>
      <Stat.Image
        style={{
          display: props.type === 'image' ? 'inline-block' : 'none',
        }}
        src={props.coverUrl}
      />
      <Stat.Digit
        customStyle={{
          textAlign: 'center',
          fontSize: '20',
          fontWeight: 'normal',
          color: '#585858',
        }}
      >
        {props.title.titleContent}
      </Stat.Digit>
      <Stat.Content
        customStyle={{
          textAlign: 'center',
          fontSize: '20',
          fontWeight: 'normal',
          lineHeight: 1,
          color: '#585858',
        }}
      >
        {props.paragraph.paragraphContent}
      </Stat.Content>
    </StatisticsWrapper>
  )
}

export default Statistics
