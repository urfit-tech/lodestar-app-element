import { ElementComponent } from '../../types/element'

const Paragraph: ElementComponent = props => {
  if (props.loading || props.errors) {
    return null
  }
  return <>{props.children}</>
}

export default Paragraph
