import React from 'react'
import styled from 'styled-components'

const StyledTitle = styled.h3<{ highlight?: boolean; color?: string }>`
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: ${props => props.theme['@primary-color']};

  ${({ highlight, color, theme }) =>
    highlight &&
    `
      padding-left: 8px;
      border-left: 3px solid ${color || theme['@primary-color']};
    `}

  color: ${props => props.color};
`

const StyledParagraph = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.69;
  letter-spacing: 0.2px;
  text-align: justify;
  color: var(--gray-darker);
`
const StyledArticle = styled.article`
  display: inline-block;
  width: 100%;

  @media (min-width: 768px) {
    max-width: 328px;
  }
`

const Article: React.FC<{ className?: string }> & {
  Title: typeof StyledTitle
  Content: typeof StyledParagraph
} = ({ className, children }) => {
  return <StyledArticle className={className}>{children}</StyledArticle>
}

Article.Title = StyledTitle
Article.Content = StyledParagraph

export default Article
