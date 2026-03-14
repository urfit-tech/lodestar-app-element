import styled from 'styled-components'
import { ElementComponent } from '../../types/element'
import { StyledImage } from './Image'
import Paragraph from './Paragraph'

const StyledDigit = styled.div<{ isDark?: boolean }>`
  color: ${props => (props.isDark ? 'white' : props.theme['@primary-color'])};
  font-size: 40px;
  line-height: 0.75;
  letter-spacing: 1px;
`

const Stat: ElementComponent & {
  Image: typeof StyledImage
  Digit: typeof StyledDigit
  Content: typeof Paragraph
} = ({ children }) => <div className="d-flex flex-column align-items-center">{children}</div>

Stat.Image = StyledImage
Stat.Digit = StyledDigit
Stat.Content = Paragraph

export default Stat
