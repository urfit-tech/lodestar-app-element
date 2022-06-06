import BraftEditor from 'braft-editor'
import React, { useRef } from 'react'
import styled, { css } from 'styled-components'
import { isHTMLString } from '../../helpers'
import QuotationLeft from '../../images/quotation-left.png'
import QuotationRight from '../../images/quotation-right.png'

const OutputMixin = css`
  h1 {
    padding: 4px 20px;
    font-size: 24px;
    font-weight: bold;
  }
  h2 {
    padding: 4px 20px;
    font-size: 20px;
    font-weight: bold;
  }
  h3 {
    padding: 4px 16px;
    font-size: 16px;
    font-weight: bold;
  }
  h4 {
    padding: 4px 16px;
    font-size: 16px;
    font-weight: normal;
  }
  h5 {
    padding: 4px 14px;
    font-size: 14px;
    font-weight: bold;
  }
  h6 {
    padding: 4px 14px;
    font-size: 14px;
    font-weight: normal;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-bottom: 1.5rem;
    border-left: 4px solid ${props => props.theme['@primary-color']};
  }
  p {
    margin: 0;
    min-height: 1.5rem;
    color: #585858;
    line-height: 27px;
    letter-spacing: 0.2px;
    text-align: justify;
  }
  ol,
  ul {
    margin: 1.5rem 0;
    padding-left: 1.5rem;
  }
  ol:first-child,
  ul:first-child {
    margin-top: 0;
  }
  ol:last-child,
  ul:last-child {
    margin-bottom: 0;
  }
  li {
    font-size: 16px;
    line-height: 2;
  }
  img {
    width: 100%;
    height: auto !important;
    margin-bottom: 1.5rem;
  }
  iframe {
    width: 100%;
    max-width: 100%;
  }
  video {
    width: 100%;
  }
  blockquote {
    position: relative;
    left: 50%;
    margin-bottom: 2.5rem;
    padding: 20px 30px;
    border-left: solid 0px #ccc;
    background-color: #f7f8f8;
    color: #585858;
    font-weight: bold;
    font-style: initial;
    text-align: center !important;
    transform: translateX(-50%);

    @media (min-width: 768px) {
      padding: 40px 115px;
    }

    &::before {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 25px;
      height: 21px;
      background-image: url(${QuotationLeft});
      background-size: 100% 100%;
      content: '';

      @media (min-width: 768px) {
        top: auto;
        left: 40px;
      }
    }
    &::after {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 25px;
      height: 21px;
      background-image: url(${QuotationRight});
      background-size: 100% 100%;
      content: '';

      @media (min-width: 768px) {
        right: 40px;
        bottom: auto;
      }
    }
  }
`

const StyledBraftEditor = styled(BraftEditor)`
  .bf-dropdown .dropdown-content .menu-item.active {
    background-color: ${props => props.theme['@primary-color']};
    color: #fff;
  }

  .dropdown-content-inner ul.menu {
    li.menu-item:nth-child(1) {
      position: relative;
      ::before {
        content: '標題';
        position: absolute;
        width: 160px;
        height: 41px;
        color: #fff;
        font-size: 20px;
        padding: 4px 20px;
        border-left: 4px solid ${props => props.theme['@primary-color']};
      }
      h1 {
        visibility: hidden;
      }
    }
    li.menu-item:nth-child(5) {
      position: relative;
      ::before {
        content: '說明';
        position: absolute;
        width: 160px;
        height: 41px;
        color: #9b9b9b;
        font-size: 14px;
        letter-spacing: 0.4px;
      }
      h5 {
        visibility: hidden;
      }
    }
    li.menu-item:nth-child(7) {
      position: relative;
      color: rgba(255, 255, 255, 0);
      ::before {
        content: '內文';
        position: absolute;
        width: 160px;
        height: 41px;
        color: #fff;
      }
    }
  }

  .public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-listLTR:before {
    top: -4px;
  }

  .public-DraftEditor-content {
    ${OutputMixin}
  }
`

const StyledBraftContent = styled.div`
  ${OutputMixin}
`

export const BraftContent: React.FC<{ isEditable?: boolean; onEdit?: (content: string | null) => void }> = ({
  isEditable,
  onEdit,
  children,
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  return (
    <div className="d-flex align-items-center">
      <StyledBraftContent
        ref={ref}
        className="braft-output-content"
        contentEditable={isEditable}
        spellCheck={false}
        onBlur={e => onEdit?.(e.currentTarget.textContent)}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            e.preventDefault()
            ref.current?.blur()
          }
        }}
        dangerouslySetInnerHTML={{
          __html:
            typeof children === 'string' && isHTMLString(children)
              ? children
              : BraftEditor.createEditorState(children).toHTML(),
        }}
      />
    </div>
  )
}

export default StyledBraftEditor
