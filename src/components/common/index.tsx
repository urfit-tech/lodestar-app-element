import styled, { css } from 'styled-components'
import {
  BorderProps,
  CardProps,
  LayoutProps,
  MarginProps,
  PaddingProps,
  ParagraphProps,
  TitleProps,
} from '../../types/style'
import { BREAK_POINT } from '../common/Responsive'

const generateCustomTitleStyle = (props: { customStyle?: TitleProps }) =>
  props.customStyle &&
  css`
    text-align: ${props.customStyle.textAlign};
    font-size: ${props.customStyle.fontSize}px;
    font-weight: ${props.customStyle.fontWeight === 'bold'
      ? 800
      : props.customStyle.fontWeight === 'normal'
      ? 500
      : props.customStyle.fontWeight === 'lighter'
      ? 200
      : 500};
    color: ${props.customStyle.color};
    ${css`
      ${generateCustomMarginStyle}
    `}
    ${css`
      ${generateCustomPaddingStyle}
    `}
    ${css`
      ${generateCustomBorderStyle}
    `}
  `
const generateCustomParagraphStyle = (props: { customStyle?: ParagraphProps }) =>
  props.customStyle &&
  css`
    text-align: ${props.customStyle.textAlign};
    line-height: ${props.customStyle.lineHeight};
    font-size: ${props.customStyle.fontSize}px;
    font-weight: ${props.customStyle.fontWeight === 'bold'
      ? 800
      : props.customStyle.fontWeight === 'normal'
      ? 500
      : props.customStyle.fontWeight === 'lighter'
      ? 200
      : 500};
    letter-spacing: ${props.customStyle.letterSpacing}px;
    color: ${props.customStyle.color};
    ${css`
      ${generateCustomMarginStyle}
    `}
    ${css`
      ${generateCustomPaddingStyle}
    `}
    ${css`
      ${generateCustomBorderStyle}
    `}
  `
const generateCustomCardStyle = (props: { customStyle?: CardProps }) =>
  props.customStyle &&
  css`
    ${props.customStyle.bordered ? `border: 1px solid white;` : ''}
    ${props.customStyle.shadow ? `box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);` : ``}
    ${css`
      ${generateCustomPaddingStyle}
    `}
    ${css`
      ${generateCustomMarginStyle}
    `}
  `
const generateCustomMarginStyle = (props: { customStyle?: MarginProps }) =>
  props.customStyle &&
  css`
    ${props.customStyle.m && `margin: ${props.customStyle.m}${Number(props.customStyle.m) ? 'px' : ''};`}
    ${props.customStyle.mt && `margin-top: ${props.customStyle.mt}${Number(props.customStyle.mt) ? 'px' : ''};`}
    ${props.customStyle.mb && `margin-bottom: ${props.customStyle.mb}${Number(props.customStyle.mb) ? 'px' : ''};`}
    ${props.customStyle.mr && `margin-right: ${props.customStyle.mr}${Number(props.customStyle.mr) ? 'px' : ''};`}
    ${props.customStyle.ml && `margin-left: ${props.customStyle.ml}${Number(props.customStyle.ml) ? 'px' : ''};`}
  `
const generateCustomPaddingStyle = (props: { customStyle?: PaddingProps }) =>
  props.customStyle &&
  css`
    ${props.customStyle.p && `padding: ${props.customStyle.p}${Number(props.customStyle.p) ? 'px' : ''};`}
    ${props.customStyle.pt && `padding-top: ${props.customStyle.pt}${Number(props.customStyle.pt) ? 'px' : ''};`}
    ${props.customStyle.pb && `padding-bottom: ${props.customStyle.pb}${Number(props.customStyle.pb) ? 'px' : ''};`}
    ${props.customStyle.pr && `padding-right: ${props.customStyle.pr}${Number(props.customStyle.pr) ? 'px' : ''};`}
    ${props.customStyle.pl && `padding-left: ${props.customStyle.pl}${Number(props.customStyle.pl) ? 'px' : ''};`}
  `
const generateCustomLayoutStyle = (props: { customStyle?: LayoutProps }) =>
  props.customStyle &&
  css`
    ${props.customStyle.type && `display: ${props.customStyle.type};`}
    ${props.customStyle.type === 'grid' &&
    css`
      grid-template-columns: ${props.customStyle.mobile?.columnRatio?.reduce((a, v) => (a += v + 'fr '), '') ||
      (props.customStyle.mobile?.columnAmount &&
        `repeat(${props.customStyle.mobile.columnAmount},${12 / props.customStyle.mobile.columnAmount})fr`) ||
      '12fr'};
      grid-gap: 1.5rem;
      place-items: center;
      ${props.customStyle.mobile?.alignItems && `align-items:${props.customStyle.mobile.alignItems};`}
      ${props.customStyle.mobile?.justifyContent && `justify-content:${props.customStyle.mobile.justifyContent};`}

      @media (min-width: ${BREAK_POINT}px) {
        grid-gap: 30px;
        grid-template-columns: ${props.customStyle.desktop?.columnRatio?.reduce((a, v) => (a += v + 'fr '), '') ||
        (props.customStyle.desktop?.columnAmount &&
          `repeat(${props.customStyle.desktop.columnAmount},${12 / props.customStyle.desktop.columnAmount})fr`) ||
        'repeat(3,4fr)'};
        ${props.customStyle.desktop?.alignItems && `align-items:${props.customStyle.desktop.alignItems};`}
        ${props.customStyle.desktop?.justifyContent && `justify-content:${props.customStyle.desktop.justifyContent};`}
      }
    `}
    ${props.customStyle.mobile?.displayAmount &&
    css`
      @media (max-width: ${BREAK_POINT - 1}px) {
        & > :not(:nth-child(-n + ${props.customStyle.mobile.displayAmount})) {
          display: none;
        }
      }
    `}
    ${props.customStyle.desktop?.displayAmount &&
    css`
      @media (min-width: ${BREAK_POINT}px) {
        & > :not(:nth-child(-n + ${props.customStyle.desktop.displayAmount})) {
          display: none;
        }
      }
    `}
     ${generateCustomMarginStyle({ customStyle: props.customStyle.mobile?.margin })}
     @media (min-width: ${BREAK_POINT}px) {
      ${generateCustomMarginStyle({ customStyle: props.customStyle.desktop?.margin })}
    }
    ${generateCustomPaddingStyle({ customStyle: props.customStyle.mobile?.padding })}
    @media (min-width: ${BREAK_POINT}px) {
      ${generateCustomPaddingStyle({ customStyle: props.customStyle.desktop?.padding })}
    }
  `
const generateCustomBorderStyle = (props: { customStyle?: BorderProps }) =>
  props.customStyle &&
  css`
    ${props.customStyle.borderRadius && `border-radius: ${props.customStyle.borderRadius};`}
    ${props.customStyle.borderStyle && `border-style: ${props.customStyle.borderStyle};`}
    ${props.customStyle.borderWidth && `border-width: ${props.customStyle.borderWidth};`}
    ${props.customStyle.borderColor && `border-color: ${props.customStyle.borderColor};`}
    ${props.customStyle.borderTopStyle && `border-top-style: ${props.customStyle.borderTopStyle} ;`}
    ${props.customStyle.borderTopColor && `border-top-color: ${props.customStyle.borderTopColor} ;`}
    ${props.customStyle.borderTopWidth &&
    `border-top-width: ${props.customStyle.borderTopWidth}${Number(props.customStyle.borderTopWidth) ? 'px' : ''};`}
    ${props.customStyle.borderBottomStyle && `border-bottom-style:${props.customStyle.borderBottomStyle} ;`}
    ${props.customStyle.borderBottomColor && `border-bottom-color: ${props.customStyle.borderBottomColor} ;`}
    ${props.customStyle.borderBottomWidth &&
    `border-bottom-width: ${props.customStyle.borderBottomWidth}${
      Number(props.customStyle.borderBottomWidth) ? 'px' : ''
    };`}
    ${props.customStyle.borderLeftStyle && `border-left-style: ${props.customStyle.borderLeftStyle};`}
    ${props.customStyle.borderLeftColor && `border-left-color: ${props.customStyle.borderLeftColor} ;`}
    ${props.customStyle.borderLeftWidth &&
    `border-left-width: ${props.customStyle.borderLeftWidth}${Number(props.customStyle.borderLeftWidth) ? 'px' : ''} ;`}
    ${props.customStyle.borderRightStyle && `border-right-style: ${props.customStyle.borderRightStyle};`}
    ${props.customStyle.borderRightColor && `border-right-color: ${props.customStyle.borderRightColor};`}
    ${props.customStyle.borderRightWidth &&
    `border-right-width: ${props.customStyle.borderRightWidth}${
      Number(props.customStyle.borderRightWidth) ? 'px' : ''
    };`}
    ${props.customStyle.borderTopLeftRadius && `border-top-left-radius: ${props.customStyle.borderTopLeftRadius};`}
    ${props.customStyle.borderTopRightRadius && `border-top-right-radius: ${props.customStyle.borderTopRightRadius};`}
    ${props.customStyle.borderBottomLeftRadius &&
    `border-bottom-left-radius: ${props.customStyle.borderBottomLeftRadius};`}
    ${props.customStyle.borderBottomRightRadius &&
    `border-bottom-right-radius: ${props.customStyle.borderBottomRightRadius};`}
  `
const StyledTitle = styled.h3<{ customStyle: TitleProps }>`
  line-height: 1;
  && {
    ${generateCustomTitleStyle}
  }
`
const StyledParagraph = styled.p<{ customStyle: ParagraphProps }>`
  white-space: pre-line;
  margin-bottom: 0;
  && {
    ${generateCustomParagraphStyle}
  }
`

const AdminHeaderTitle = styled.div`
  flex-grow: 1;
  color: var(--gray-darker);
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
`

const StyledSettingButtonWrapper = styled.div`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
`
const StyledCraftSettingLabel = styled.span`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
  font-weight: 500;
`

export { StyledTitle, StyledParagraph, AdminHeaderTitle, StyledSettingButtonWrapper, StyledCraftSettingLabel }
export {
  generateCustomTitleStyle,
  generateCustomParagraphStyle,
  generateCustomCardStyle,
  generateCustomMarginStyle,
  generateCustomPaddingStyle,
  generateCustomLayoutStyle,
  generateCustomBorderStyle,
}
