import BraftEditor from 'braft-editor'
import React from 'react'
import styled, { css } from 'styled-components'
import QuotationLeft from '../../images/quotation-left.png'
import QuotationRight from '../../images/quotation-right.png'

const OutputMixin = css`
  h1 {
    margin-bottom: 1.5rem;
    padding: 4px 20px;
    font-size: 20px;
    font-weight: bold;
    border-left: 4px solid ${props => props.theme['@primary-color']};
  }
  h5 {
    margin-bottom: 1.5rem;
    color: #9b9b9b;
    font-size: 14px;
    letter-spacing: 0.4px;
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
    li.menu-item:nth-child(2),
    li.menu-item:nth-child(3),
    li.menu-item:nth-child(4),
    li.menu-item:nth-child(6) {
      display: none;
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

export const BraftContent: React.FC = ({ children }) => {
  return (
    <StyledBraftContent
      className="braft-output-content"
      dangerouslySetInnerHTML={{
        __html: BraftEditor.createEditorState(children).toHTML(),
      }}
    />
  )
}

export default StyledBraftEditor
