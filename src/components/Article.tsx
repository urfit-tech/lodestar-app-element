import styled from 'styled-components'
import { ParagraphProps, TitleProps } from '../types/style'
import { generateCustomParagraphStyle, generateCustomTitleStyle } from './common'
import { BREAK_POINT } from './Responsive'

const StyledDescriptionTitle = styled.h3<{ customStyle: TitleProps }>`
  font-family: NotoSansCJKtc;
  font-weight: ${props =>
    props.customStyle.fontWeight === 'bold'
      ? 800
      : props.customStyle.fontWeight === 'normal'
      ? 500
      : props.customStyle.fontWeight === 'lighter'
      ? 200
      : 500};
  letter-spacing: 0.2px;
  text-align: center;
  font-size: ${props => props.customStyle.fontSize}px;

  @media (min-width: ${BREAK_POINT}px) {
    && {
      ${generateCustomTitleStyle}
    }
  }
`

const StyledTitle = styled.h3<{ highlight?: boolean; customStyle: TitleProps }>`
  font-family: NotoSansCJKtc;
  font-size: ${props => props.customStyle.fontSize || 16}px;
  font-weight: ${props =>
    props.customStyle.fontWeight === 'bold'
      ? 800
      : props.customStyle.fontWeight === 'normal'
      ? 500
      : props.customStyle.fontWeight === 'lighter'
      ? 200
      : 500};
  letter-spacing: 0.2px;
  color: ${props => (props.highlight ? props.theme['@primary-color'] : 'var(--gray-darker)')};

  ${({ highlight, customStyle, theme }) =>
    highlight &&
    `
      padding-left: 8px;
      border-left: 3px solid ${customStyle.color || theme['@primary-color']};
    `}

  && {
    ${generateCustomTitleStyle}
  }
`

const StyledParagraph = styled.p<{ customStyle: ParagraphProps }>`
  font-size: 16px;
  font-weight: ${props =>
    props.customStyle.fontWeight === 'bold'
      ? 800
      : props.customStyle.fontWeight === 'normal'
      ? 500
      : props.customStyle.fontWeight === 'lighter'
      ? 200
      : 500};
  line-height: 1.69;
  letter-spacing: 0.2px;
  text-align: justify;
  color: var(--gray-darker);

  && {
    ${generateCustomParagraphStyle}
  }
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
