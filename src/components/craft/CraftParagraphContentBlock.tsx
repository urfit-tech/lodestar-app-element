import { Collapse, Input } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import { craftPageMessages } from '../../helpers/translation'
import { AdminHeaderTitle, StyledCollapsePanel, StyledCraftSettingLabel } from '../common'

const CraftParagraphContentBlock: React.VFC<{ value?: string; onChange?: (value?: string) => void }> = ({
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
      defaultActiveKey={['paragraphContent']}
    >
      <StyledCollapsePanel
        key="paragraphContent"
        header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.paragraphContent)}</AdminHeaderTitle>}
      >
        <div className="mb-2">
          <StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.content)}</StyledCraftSettingLabel>
          <Input.TextArea className="mt-2" rows={5} defaultValue={value} onChange={e => onChange?.(e.target.value)} />
        </div>
      </StyledCollapsePanel>
    </Collapse>
  )
}

export default CraftParagraphContentBlock
