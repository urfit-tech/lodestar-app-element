import styled from 'styled-components'

const StyledDescriptionTitle = styled.h3`
  font-family: NotoSansCJKtc;
  letter-spacing: 0.2px;
  text-align: center;
`

const StyledTitle = styled.h3<{ highlight?: boolean }>`
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2px;
  color: ${props => (props.highlight ? props.theme['@primary-color'] : 'var(--gray-darker)')};

  ${({ highlight, theme }) =>
    highlight &&
    `
      padding-left: 8px;
      border-left: 3px solid ${theme['@primary-color']};
    `}
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
`

const Article: React.FC<{ className?: string }> & {
  Title: typeof StyledTitle
  DescriptionTitle: typeof StyledDescriptionTitle
  Content: typeof StyledParagraph
} = ({ className, children }) => {
  return <StyledArticle className={className}>{children}</StyledArticle>
}

Article.Title = StyledTitle
Article.DescriptionTitle = StyledDescriptionTitle
Article.Content = StyledParagraph

export default Article
