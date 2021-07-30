import styled, { css } from 'styled-components'
import { CardProps, LayoutProps, MarginProps, PaddingProps, ParagraphProps, TitleProps } from '../../types/style'
import { BREAK_POINT } from '../Responsive'

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
    padding: ${props.customStyle.pt}px ${props.customStyle.pr}px ${props.customStyle.pb}px ${props.customStyle.pl}px;
    color: ${props.customStyle.color};
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
    padding: ${props.customStyle.pt}px ${props.customStyle.pr}px ${props.customStyle.pb}px ${props.customStyle.pl}px;
    color: ${props.customStyle.color};
  `
const generateCustomCardStyle = (props: { customStyle?: CardProps }) =>
  props.customStyle &&
  css`
    ${props.customStyle.bordered ? `border: 1px solid white;` : ''}
    ${props.customStyle.shadow ? `box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);` : ``}
    margin: ${props.customStyle.mt}px ${props.customStyle.mr}px ${props.customStyle.mb}px ${props.customStyle.ml}px;
    padding: ${props.customStyle.pt}px ${props.customStyle.pr}px ${props.customStyle.pb}px ${props.customStyle.pl}px;
  `
const generateCustomMarginStyle = (props: { customStyle?: MarginProps }) =>
  props.customStyle &&
  css`
    ${props.customStyle.m && `margin: ${props.customStyle.m}px;`}
    ${props.customStyle.mt && `margin-top: ${props.customStyle.mt}px;`}
    ${props.customStyle.mb && `margin-bottom: ${props.customStyle.mb}px;`}
    ${props.customStyle.mr && `margin-right: ${props.customStyle.mr}px;`}
    ${props.customStyle.ml && `margin-left: ${props.customStyle.ml}px;`}
  `
const generateCustomPaddingStyle = (props: { customStyle?: PaddingProps }) =>
  props.customStyle &&
  css`
    ${props.customStyle.p && `padding: ${props.customStyle.p}px;`}
    ${props.customStyle.pt && `padding-top: ${props.customStyle.pt}px;`}
    ${props.customStyle.pb && `padding-bottom: ${props.customStyle.pb}px;`}
    ${props.customStyle.pr && `padding-right: ${props.customStyle.pr}px;`}
    ${props.customStyle.pl && `padding-left: ${props.customStyle.pl}px;`}
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

      @media (min-width: ${BREAK_POINT}px) {
        grid-gap: 30px;
        ${css`
          grid-template-columns: ${props.customStyle.desktop?.columnRatio?.reduce((a, v) => (a += v + 'fr '), '') ||
          (props.customStyle.desktop?.columnAmount &&
            `repeat(${props.customStyle.desktop.columnAmount},${12 / props.customStyle.desktop.columnAmount})fr`) ||
          'repeat(3,4fr)'};
        `}
      }
    `}
  `

const StyledTitle = styled.h3<{ customStyle: TitleProps }>`
  line-height: 1;
  && {
    ${generateCustomTitleStyle}
  }
`
const StyledParagraph = styled.p<{ customStyle: ParagraphProps }>`
  white-space: pre-line;
  && {
    ${generateCustomParagraphStyle}
  }
`

export { StyledTitle, StyledParagraph }
export {
  generateCustomTitleStyle,
  generateCustomParagraphStyle,
  generateCustomCardStyle,
  generateCustomMarginStyle,
  generateCustomPaddingStyle,
  generateCustomLayoutStyle,
}
