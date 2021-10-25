import styled from 'styled-components'
import { CraftBoxModelProps, CraftImageProps, CraftParagraphProps, CraftTitleProps } from '../../types/craft'
import { ElementComponent } from '../../types/element'
import Stat from './Stat'

const StatisticsWrapper = styled.div`
  width: fit-content;
  text-align: center;
`
const StyledDigit = styled(Stat.Digit)`
  text-align: center;
  font-size: 20;
  font-weight: normal;
  color: #585858;
`
const StyledContent = styled(Stat.Content)`
  text-align: center;
  font-size: 20;
  font-weight: normal;
  line-height: 1;
  color: #585858;
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
      <StyledDigit>{props.title.titleContent}</StyledDigit>
      <StyledContent>{props.paragraph.paragraphContent}</StyledContent>
    </StatisticsWrapper>
  )
}

export default Statistics
