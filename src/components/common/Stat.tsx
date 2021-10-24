import styled from 'styled-components'
import { generateCustomTitleStyle, StyledParagraph } from '.'
import { ElementComponent } from '../../types/element'
import { TitleProps } from '../../types/style'
import { StyledImage } from './Image'

const StyledDigit = styled.div<{ isDark?: boolean; customStyle?: TitleProps }>`
  color: ${props => (props.isDark ? 'white' : props.theme['@primary-color'])};
  font-size: 40px;
  line-height: 0.75;
  letter-spacing: 1px;
  && {
    ${generateCustomTitleStyle}
  }
`

const Stat: ElementComponent & {
  Image: typeof StyledImage
  Digit: typeof StyledDigit
  Content: typeof StyledParagraph
} = ({ children }) => <div className="d-flex flex-column align-items-center">{children}</div>

Stat.Image = StyledImage
Stat.Digit = StyledDigit
Stat.Content = StyledParagraph

export default Stat
