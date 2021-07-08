import styled, { css } from 'styled-components'
import { CardProps, ParagraphProps, TitleProps } from '../../types/style'

const generateCustomTitleStyle = (props: { customStyle?: TitleProps }) =>
  props.customStyle &&
  css`
    text-align: ${props.customStyle.textAlign};
    font-size: ${props.customStyle.fontSize}px;
    font-weight: ${props.customStyle.fontWeight};
    padding: ${props.customStyle.pt}px ${props.customStyle.pr}px ${props.customStyle.pb}px ${props.customStyle.pl}px;
    color: ${props.customStyle.color};
  `

const generateCustomParagraphStyle = (props: { customStyle?: ParagraphProps }) =>
  props.customStyle &&
  css`
    text-align: ${props.customStyle.textAlign};
    line-height: ${props.customStyle.lineHeight};
    font-size: ${props.customStyle.fontSize}px;
    font-weight: ${props.customStyle.fontWeight};
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

const StyledTitle = styled.h3<{ customStyle: TitleProps }>`
  line-height: 1;
  && {
    ${generateCustomTitleStyle}
  }
`

const StyledParagraph = styled.p<{ customStyle: ParagraphProps }>`
  && {
    ${generateCustomParagraphStyle}
  }
`

export { StyledTitle, StyledParagraph }
export { generateCustomTitleStyle, generateCustomParagraphStyle, generateCustomCardStyle }
