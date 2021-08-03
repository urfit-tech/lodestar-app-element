import { Collapse, Input } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import { craftPageMessages } from '../../helpers/translation'
import { AdminHeaderTitle, StyledCollapsePanel, StyledCraftSettingLabel } from '../common'

const CraftTitleContentBlock: React.VFC<{ value?: string; onChange?: (value?: string) => void }> = ({
  value,
  onChange,
}) => {
  const { formatMessage } = useIntl()

  return (
    <Collapse
      className="mt-2 p-0"
      bordered={false}
      expandIconPosition="right"
      ghost
      defaultActiveKey={['titleContent']}
    >
      <StyledCollapsePanel
        key="titleContent"
        header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.titleContent)}</AdminHeaderTitle>}
      >
        <div className="mb-2">
          <StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.title)}</StyledCraftSettingLabel>
          <Input className="mt-2" value={value} onChange={e => onChange?.(e.target.value)} />
        </div>
      </StyledCollapsePanel>
    </Collapse>
  )
}

export default CraftTitleContentBlock
