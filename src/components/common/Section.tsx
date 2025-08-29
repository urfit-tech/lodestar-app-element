import classNames from 'classnames'
import { useHistory } from 'react-router'
import styled, { css } from 'styled-components'
import { useAuth } from '../../contexts/AuthContext'
import { ElementComponent } from '../../types/element'
import { DESKTOP_BREAK_POINT, TABLET_BREAK_POINT } from './Responsive'

export type SectionProps = {
  id?: string
  link?: string
  openTab?: boolean
  horizontal?: boolean
  darkMode?: boolean
  display?: 'normal' | 'hide' | 'appearAfterLogin' | 'disappearAfterLogin'
  backgroundImages?: {
    mobile?: string | null
    tablet?: string | null
    desktop?: string | null
  }
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

  const getBackgroundImage = () => {
    const width = window.innerWidth
    const extractUrl = (bg?: string) => bg?.replace(/^url\(["']?/, '').replace(/["']?\)$/, '')

    if (width >= DESKTOP_BREAK_POINT) return extractUrl(props?.backgroundImages?.desktop || '')
    if (width >= TABLET_BREAK_POINT) return extractUrl(props?.backgroundImages?.tablet || '')
    return extractUrl(props?.backgroundImages?.mobile || '')
  }

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
            : props.display === 'appearAfterLogin' && !currentMemberId
            ? 'none'
            : props.display === 'disappearAfterLogin' && currentMemberId
            ? 'none'
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
      {props.backgroundImages && getBackgroundImage() && (
        <img
          src={getBackgroundImage()}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
      {props.children}
    </StyledSection>
  )
}

export default Section
