import { useNode, UserComponent } from '@craftjs/core'
import { Button, Collapse, Select } from 'antd'
import Form from 'antd/lib/form/'
import { useForm } from 'antd/lib/form/Form'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { commonMessages, craftPageMessages } from '../../helpers/translation'
import { AdminHeaderTitle, StyledCollapsePanel, StyledCraftSettingLabel, StyledSettingButtonWrapper } from '../common'

type FieldProps = {
  data?: string
}

const CraftDataSelector: UserComponent<{ setActiveKey: React.Dispatch<React.SetStateAction<string>> }> = ({
  children,
  setActiveKey,
}) => {
  const {
    connectors: { connect },
  } = useNode()

  return (
    <div
      ref={ref => ref && connect(ref)}
      style={{ padding: '20px', background: '#dfa', cursor: 'pointer' }}
      onClick={() => setActiveKey('settings')}
    >
      {children}
    </div>
  )
}

const DataSelectorSettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [form] = useForm<FieldProps>()
  const [selectedValue, setSelectedValue] = useState('')

  const {
    actions: { setProp },
    props,
    selected,
  } = useNode(node => ({
    props: node.data.props as FieldProps,
    selected: node.events.selected,
  }))

  const handleSubmit = (values: FieldProps) => {
    setProp(props => (props.data = values.data))
  }

  return (
    <Form
      form={form}
      layout="vertical"
      colon={false}
      requiredMark={false}
      initialValues={{
        data: undefined,
      }}
      onFinish={handleSubmit}
    >
      <Collapse
        className="mt-2 p-0"
        bordered={false}
        expandIconPosition="right"
        ghost
        defaultActiveKey={['imageSetting']}
      >
        <StyledCollapsePanel
          key="imageSetting"
          header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.specifyDisplayItem)}</AdminHeaderTitle>}
        >
          <Form.Item
            name="data"
            label={
              <StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.dataDisplay)}</StyledCraftSettingLabel>
            }
          >
            <Select
              showSearch
              allowClear
              placeholder={formatMessage(craftPageMessages.label.choiceData)}
              value={selectedValue}
              onChange={(v: string) => setSelectedValue(v)}
              filterOption={(input, option) =>
                option?.props?.children
                  ? (option.props.children as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                  : true
              }
            >
              <Select.Option key="program" value="program">
                {formatMessage(craftPageMessages.label.program)}
              </Select.Option>
              <Select.Option key="activity" value="activity">
                {formatMessage(craftPageMessages.label.activity)}
              </Select.Option>
              <Select.Option key="podcast" value="podcast">
                {formatMessage(craftPageMessages.label.podcast)}
              </Select.Option>
              <Select.Option key="lecturer" value="lecturer">
                {formatMessage(craftPageMessages.label.lecturer)}
              </Select.Option>
              <Select.Option key="fundraising" value="fundraising">
                {formatMessage(craftPageMessages.label.fundraising)}
              </Select.Option>
              <Select.Option key="preOrder" value="preOrder">
                {formatMessage(craftPageMessages.label.preOrder)}
              </Select.Option>
            </Select>
          </Form.Item>
        </StyledCollapsePanel>
      </Collapse>
      {selected && (
        <StyledSettingButtonWrapper>
          <Button className="mb-3" type="primary" block htmlType="submit">
            {formatMessage(commonMessages.ui.save)}
          </Button>
        </StyledSettingButtonWrapper>
      )}
    </Form>
  )
}

CraftDataSelector.craft = {
  related: {
    settings: DataSelectorSettings,
  },
}

export default CraftDataSelector
