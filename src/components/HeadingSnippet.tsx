import React from 'react'
import styled, { css } from 'styled-components'
import { ParagraphProps, TitleProps } from '../types/style'

const StyledTitle = styled.h3<{ customStyle: TitleProps }>`
  font-family: NotoSansCJKtc;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 0.23px;
  color: #ffffff;
  text-align: center;

  && {
    ${props =>
      props.customStyle &&
      css`
        font-size: ${props.customStyle.fontSize}px;
        font-weight: ${props.customStyle.fontWeight};
        padding: ${props.customStyle.pt}px ${props.customStyle.pr}px ${props.customStyle.pb}px ${props.customStyle.pl}px;
        color: ${props.customStyle.color};

        @media (min-width: 768px) {
          text-align: ${props.customStyle.textAlign};
        }
      `}
  }
`

const StyledContent = styled.p<{ customStyle: ParagraphProps }>`
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.38;
  color: #ffffff;
  margin-top: 24px;
  text-align: center;

  && {
    ${props =>
      props.customStyle &&
      css`
        line-height: ${props.customStyle.lineHeight};
        font-size: ${props.customStyle.fontSize}px;
        font-weight: ${props.customStyle.fontWeight};
        padding: ${props.customStyle.pt}px ${props.customStyle.pr}px ${props.customStyle.pb}px ${props.customStyle.pl}px;
        color: ${props.customStyle.color};

        @media (min-width: 768px) {
          text-align: ${props.customStyle.textAlign};
        }
      `}
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
