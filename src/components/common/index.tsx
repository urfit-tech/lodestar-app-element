import styled, { css } from 'styled-components'

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
const CommonLargeTextMixin = css`
  font-size: 16px;
  letter-spacing: 0.2px;
  font-weight: 500;
  color: var(--gray-darker);
`
const CommonTextMixin = css`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`
const CommonTitleMixin = css`
  font-size: 18px;
  letter-spacing: 0.8px;
  font-weight: bold;
  color: var(--gray-darker);
`
export {
  AdminHeaderTitle,
  StyledSettingButtonWrapper,
  StyledCraftSettingLabel,
  CommonLargeTextMixin,
  CommonTextMixin,
  CommonTitleMixin,
}
