import styled, { css } from 'styled-components'

const StyledTitle = styled.h3`
  font-family: NotoSansCJKtc;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 0.23px;
  color: #ffffff;
  text-align: center;
`

const StyledContent = styled.p`
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.38;
  color: #ffffff;
  margin-top: 24px;
  text-align: center;
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
