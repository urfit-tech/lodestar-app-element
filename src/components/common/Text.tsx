import { ElementComponent, TextElementProps } from '../../types/element'

const Text: ElementComponent<TextElementProps> = props => {
  const { loading, errors } = props
  if (errors) {
    return <div>{JSON.stringify(errors)}</div>
  }
  if (loading) {
    return <div>---</div>
  }

  switch (props.as) {
    case 'h1':
      return <h1 className={props.className}>{props.children}</h1>
    case 'h2':
      return <h2 className={props.className}>{props.children}</h2>

    case 'h3':
      return <h3 className={props.className}>{props.children}</h3>

    case 'h4':
      return <h4 className={props.className}>{props.children}</h4>

    case 'h5':
      return <h5 className={props.className}>{props.children}</h5>

    case 'h6':
      return <h6 className={props.className}>{props.children}</h6>

    default:
      return <p className={props.className}>{props.children}</p>
  }
}

export default Text
