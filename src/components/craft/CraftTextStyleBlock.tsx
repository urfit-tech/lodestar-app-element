import { Collapse, InputNumber, Radio, Space } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import { craftPageMessages } from '../../helpers/translation'
import { AdminHeaderTitle, StyledCollapsePanel, StyledCraftSettingLabel, StyledCraftSlider } from '../common'
import CraftBoxModelInput from './CraftBoxModelInput'
import CraftColorPickerBlock from './CraftColorPickerBlock'

const CraftTextStyleBlock: React.VFC<{
  type: 'title' | 'paragraph'
  title: string
  value?: {
    fontSize: number
    lineHeight?: number
    margin: string
    textAlign: 'left' | 'right' | 'center'
    fontWeight: 'lighter' | 'normal' | 'bold'
    color: string
  }
  onChange?: (value: {
    fontSize: number
    lineHeight?: number
    margin: string
    textAlign: 'left' | 'right' | 'center'
    fontWeight: 'lighter' | 'normal' | 'bold'
    color: string
  }) => void
}> = ({ type, title, value, onChange }) => {
  const { formatMessage } = useIntl()

  return (
    <Collapse
      className="mt-2 p-0"
      bordered={false}
      expandIconPosition="right"
      ghost
      defaultActiveKey={['contentStyle']}
    >
      {typeof value !== 'undefined' && (
        <StyledCollapsePanel key="contentStyle" header={<AdminHeaderTitle>{title}</AdminHeaderTitle>}>
          <>
            <StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.fontSize)}</StyledCraftSettingLabel>
            <div className="col-12 mb-2 p-0 d-flex justify-content-center align-items-center ">
              <div className="col-8 p-0">
                <StyledCraftSlider
                  value={typeof value.fontSize === 'number' ? value.fontSize : 0}
                  onChange={(v: number) => {
                    onChange?.({ ...value, fontSize: v })
                  }}
                />
              </div>
              <InputNumber
                className="col-4"
                min={0}
                value={value.fontSize}
                onChange={v => {
                  onChange?.({ ...value, fontSize: Number(v) })
                }}
              />
            </div>
          </>

          {type === 'paragraph' && (
            <>
              <StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.lineHeight)}</StyledCraftSettingLabel>
              <div className="col-12 mb-2 p-0 d-flex justify-content-center align-items-center ">
                <div className="col-8 p-0">
                  <StyledCraftSlider
                    value={typeof value.lineHeight === 'number' ? value?.lineHeight : 0}
                    onChange={(v: number) => onChange?.({ ...value, lineHeight: v })}
                  />
                </div>
                <InputNumber
                  className="col-4"
                  min={0}
                  value={value.lineHeight}
                  onChange={v => onChange?.({ ...value, lineHeight: Number(v) })}
                />
              </div>
            </>
          )}

          <CraftBoxModelInput
            title={formatMessage(craftPageMessages.label.margin)}
            value={value.margin}
            onChange={v => onChange?.({ ...value, margin: v })}
          />

          <div className="d-flex mb-3">
            <div>
              <StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.textAlign)}</StyledCraftSettingLabel>
              <div>
                <Radio.Group
                  className="mt-2"
                  value={value.textAlign}
                  onChange={e => onChange?.({ ...value, textAlign: e.target.value })}
                >
                  <Space direction="vertical">
                    <Radio value="left">{formatMessage(craftPageMessages.label.left)}</Radio>
                    <Radio value="center">{formatMessage(craftPageMessages.label.center)}</Radio>
                    <Radio value="right">{formatMessage(craftPageMessages.label.right)}</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
            <div className="ml-4">
              <StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.fontWeight)}</StyledCraftSettingLabel>
              <div>
                <Radio.Group
                  className="mt-2"
                  value={value.fontWeight}
                  onChange={e => onChange?.({ ...value, fontWeight: e.target.value })}
                >
                  <Space direction="vertical">
                    <Radio value="lighter">{formatMessage(craftPageMessages.label.lighter)}</Radio>
                    <Radio value="normal">{formatMessage(craftPageMessages.label.normal)}</Radio>
                    <Radio value="bold">{formatMessage(craftPageMessages.label.bold)}</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </div>
          <CraftColorPickerBlock value={value.color} onChange={v => onChange?.({ ...value, color: v })} />
        </StyledCollapsePanel>
      )}
    </Collapse>
  )
}

export default CraftTextStyleBlock
