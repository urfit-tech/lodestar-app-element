import React from 'react'
import styled, { css } from 'styled-components'
import { ParagraphProps, TitleProps } from '../types/style'
import { generateCustomParagraphStyle, generateCustomTitleStyle } from './common'

const StyledTitle = styled.h3<{ row: boolean; customStyle: TitleProps }>`
  font-family: NotoSansCJKtc;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 0.23px;
  color: #ffffff;
  text-align: center;

  ${props =>
    props.row &&
    css`
      @media (min-width: 768px) {
        text-align: left;
      }
    `}

  && {
    ${generateCustomTitleStyle}
  }
`

const StyledContent = styled.p<{ row: boolean; customStyle: ParagraphProps }>`
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.38;
  color: #ffffff;
  margin-top: 24px;
  text-align: center;

  ${props =>
    props.row &&
    css`
      @media (min-width: 768px) {
        text-align: left;
      }
    `}

  && {
    ${generateCustomParagraphStyle}
  }
`

const StyledSnippet = styled.div<{ row: boolean }>`
  margin-bottom: 40px;

  ${props =>
    props.row &&
    css`
      @media (min-width: 768px) {
        margin-bottom: 0;
      }
    `}
`

const HeadingSnippet: React.FC<{ direction: 'row' | 'column' }> & {
  Title: typeof StyledTitle
  Content: typeof StyledContent
} = ({ direction, children }) => {
  return <StyledSnippet row={direction === 'row'}>{children}</StyledSnippet>
}

HeadingSnippet.Title = StyledTitle
HeadingSnippet.Content = StyledContent

export default HeadingSnippet
