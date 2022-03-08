import classNames from 'classnames'
import { useHistory } from 'react-router'
import styled, { css } from 'styled-components'
import { useAuth } from '../../contexts/AuthContext'
import { ElementComponent } from '../../types/element'

export type SectionProps = {
  link?: string
  openTab?: boolean
  horizontal?: boolean
  darkMode?: boolean
  display?: 'normal' | 'hide' | 'appearAfterLogin' | 'disappearAfterLogin'
}

const StyledSection = styled.section<SectionProps>`
  width: 100%;
  position: relative;
  background-size: cover;
  background-position: center;
  flex-direction: ${props => (props.horizontal ? 'row' : 'column')};

  ${props =>
    props.darkMode
      ? css`
          color: white;
          &::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.4);
            z-index: -1;
          }
        `
      : css`
          &::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(256, 256, 256, 0.4);
            z-index: -1;
          }
        `};
`

const Section: ElementComponent<SectionProps> = props => {
  const history = useHistory()
  const { currentMemberId } = useAuth()

  if (props.loading || props.errors) {
    return null
  }
  return (
    <StyledSection
      {...props}
      style={{
        display:
          props.display === 'hide'
            ? 'none'
            : currentMemberId
            ? props.display === 'appearAfterLogin'
              ? 'flex'
              : props.display === 'disappearAfterLogin'
              ? 'none'
              : 'flex'
            : 'flex',
      }}
      className={classNames(props.className, { 'cursor-pointer': props.link })}
      onClick={e =>
        props.editing || !props.link
          ? e.preventDefault()
          : props.link.startsWith('http')
          ? props.openTab
            ? window.open(props.link)
            : window.location.assign(props.link)
          : props.openTab
          ? window.open(window.location.origin + props.link)
          : history.push(props.link)
      }
    >
      {props.children}
    </StyledSection>
  )
}

export default Section
