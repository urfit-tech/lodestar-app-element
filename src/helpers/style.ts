import { css } from 'styled-components'

const CommonTextMixin = css`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`
const CommonLargeTextMixin = css`
  font-size: 16px;
  letter-spacing: 0.2px;
  font-weight: 500;
  color: var(--gray-darker);
`
const CommonTitleMixin = css`
  font-size: 18px;
  letter-spacing: 0.8px;
  font-weight: bold;
  color: var(--gray-darker);
`
const CommonLargeTitleMixin = css`
  font-size: 24px;
  letter-spacing: 0.2px;
  font-weight: bold;
  color: var(--gray-darker);
`
const MultiLineTruncationMixin = css`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export { CommonTextMixin, CommonLargeTextMixin, CommonTitleMixin, CommonLargeTitleMixin, MultiLineTruncationMixin }
