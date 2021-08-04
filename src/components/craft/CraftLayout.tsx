import { useNode, UserComponent } from '@craftjs/core'
import { Button, Collapse, Form, Input, InputNumber, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { replace } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages, craftPageMessages } from '../../helpers/translation'
import { CraftLayoutProps } from '../../types/craft'
import { AdminHeaderTitle, StyledCollapsePanel, StyledSettingButtonWrapper } from '../common'
import { BREAK_POINT } from '../Responsive'
import CraftBoxModelInput, { formatBoxModelValue } from './CraftBoxModelInput'

const StyledFullWidthSelect = styled(Select)`
  && {
    width: 100%;
  }

  .ant-select-selection-selected-value {
    margin-right: 0.5rem;
  }
`
const StyledInputNumber = styled(InputNumber)`
  width: 100% !important;
`
const StyledContainer = styled.div<{ mobile: CraftLayoutProps; desktop: CraftLayoutProps }>`
  padding: ${props =>
    `${props.mobile.padding.pt}px ${props.mobile.padding.pr}px ${props.mobile.padding.pb}px ${props.mobile.padding.pl}px`};
  @media (min-width: ${BREAK_POINT}px) {
    padding: ${props =>
      `${props.desktop.padding.pt}px ${props.desktop.padding.pr}px ${props.desktop.padding.pb}px ${props.desktop.padding.pl}px`};
  }
`

type FieldProps = {
  desktopPadding: string
  desktopColumnAmount: number
  desktopColumnRatio: number[]
  desktopDisplayAmount: number
  mobilePadding: string
  mobileColumnAmount: number
  mobileColumnRatio: number[]
  mobileDisplayAmount: number
}

const CraftLayout: UserComponent<{
  desktop: CraftLayoutProps
  mobile: CraftLayoutProps
  setActiveKey: React.Dispatch<React.SetStateAction<string>>
}> = ({ desktop, mobile, setActiveKey }) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <StyledContainer
      ref={ref => ref && connect(drag(ref))}
      desktop={desktop}
      mobile={mobile}
      style={{ cursor: 'pointer' }}
      onClick={() => setActiveKey('settings')}
    >
      layout
    </StyledContainer>
  )
}

const LayoutSettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [form] = useForm<FieldProps>()

  const {
    actions: { setProp },
    props,
    selected,
  } = useNode(node => ({
    props: node.data.props as { mobile: CraftLayoutProps; desktop: CraftLayoutProps },
    selected: node.events.selected,
  }))

  const handleSubmit = (values: FieldProps) => {
    const desktopPadding = formatBoxModelValue(values.desktopPadding)
    const mobilePadding = formatBoxModelValue(values.mobilePadding)

    setProp(props => {
      props.desktop = {
        padding: {
          pt: desktopPadding?.[0] || '0',
          pr: desktopPadding?.[1] || '0',
          pb: desktopPadding?.[2] || '0',
          pl: desktopPadding?.[3] || '0',
        },
        columnAmount: values.desktopColumnAmount,
        columnRatio: values.desktopColumnRatio,
        displayAmount: values.desktopDisplayAmount,
      }
      props.mobile = {
        padding: {
          pt: mobilePadding?.[0] || '0',
          pr: mobilePadding?.[1] || '0',
          pb: mobilePadding?.[2] || '0',
          pl: mobilePadding?.[3] || '0',
        },
        columnAmount: values.mobileColumnAmount,
        columnRatio: values.mobileColumnRatio,
        displayAmount: values.mobileDisplayAmount,
      }
    })
  }

  return (
    <Form
      form={form}
      layout="vertical"
      colon={false}
      requiredMark={false}
      initialValues={{
        desktopPadding: `${props.desktop.padding?.pt || 0};${props.desktop.padding?.pr || 0};${
          props.desktop.padding?.pb || 0
        };${props.desktop.padding?.pl || 0}`,
        desktopColumnAmount: props.desktop.columnAmount || 3,
        desktopColumnRatio: replace(/,/g, ':', props.desktop.columnRatio.toString() || '3,3,3') || [3, 3, 3],
        desktopDisplayAmount: props.desktop.displayAmount || 3,
        mobilePadding: `${props.mobile.padding?.pt || 0};${props.mobile.padding?.pr || 0};${
          props.mobile.padding?.pb || 0
        };${props.mobile.padding?.pl || 0}`,
        mobileColumnAmount: props.mobile.columnAmount || 3,
        mobileColumnRatio: props.mobile.columnRatio || [3, 3, 3],
        mobileDisplayAmount: props.mobile.displayAmount || 3,
      }}
      onFinish={handleSubmit}
    >
      <Collapse
        className="mt-2 p-0"
        bordered={false}
        expandIconPosition="right"
        ghost
        defaultActiveKey={['desktopLayoutComponent']}
      >
        <StyledCollapsePanel
          key="desktopLayoutComponent"
          header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.desktopLayoutComponent)}</AdminHeaderTitle>}
        >
          <Form.Item name="desktopPadding" label={formatMessage(craftPageMessages.label.boundary)}>
            <CraftBoxModelInput />
          </Form.Item>
          <Form.Item name="desktopColumnAmount" label={formatMessage(craftPageMessages.label.columnAmount)}>
            <StyledFullWidthSelect>
              <Select.Option key="1" value="1">
                1
              </Select.Option>
              <Select.Option key="2" value="2">
                2
              </Select.Option>
              <Select.Option key="3" value="3">
                3
              </Select.Option>
              <Select.Option key="4" value="4">
                4
              </Select.Option>
              <Select.Option key="6" value="6">
                6
              </Select.Option>
              <Select.Option key="12" value="12">
                12
              </Select.Option>
            </StyledFullWidthSelect>
          </Form.Item>
          <Form.Item name="desktopColumnRatio" label={formatMessage(craftPageMessages.label.ratio)}>
            <Input />
          </Form.Item>
          <Form.Item name="desktopDisplayAmount" label={formatMessage(craftPageMessages.label.displayAmount)}>
            <StyledInputNumber />
          </Form.Item>
        </StyledCollapsePanel>
      </Collapse>

      <Collapse
        className="mt-2 p-0"
        bordered={false}
        expandIconPosition="right"
        ghost
        defaultActiveKey={['mobileLayoutComponent']}
      >
        <StyledCollapsePanel
          key="mobileLayoutComponent"
          header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.mobileLayoutComponent)}</AdminHeaderTitle>}
        >
          <Form.Item name="mobilePadding" label={formatMessage(craftPageMessages.label.boundary)}>
            <CraftBoxModelInput />
          </Form.Item>
          <Form.Item name="mobileColumnAmount" label={formatMessage(craftPageMessages.label.columnAmount)}>
            <StyledFullWidthSelect>
              <Select.Option key="1" value="1">
                1
              </Select.Option>
              <Select.Option key="2" value="2">
                2
              </Select.Option>
              <Select.Option key="3" value="3">
                3
              </Select.Option>
              <Select.Option key="4" value="4">
                4
              </Select.Option>
              <Select.Option key="6" value="6">
                6
              </Select.Option>
              <Select.Option key="12" value="12">
                12
              </Select.Option>
            </StyledFullWidthSelect>
          </Form.Item>
          <Form.Item name="mobileColumnRatio" label={formatMessage(craftPageMessages.label.ratio)}>
            <Input />
          </Form.Item>
          <Form.Item name="mobileDisplayAmount" label={formatMessage(craftPageMessages.label.displayAmount)}>
            <StyledInputNumber />
          </Form.Item>
        </StyledCollapsePanel>
      </Collapse>

      {selected && (
        <StyledSettingButtonWrapper>
          <Button type="primary" block htmlType="submit">
            {formatMessage(commonMessages.ui.save)}
          </Button>
        </StyledSettingButtonWrapper>
      )}
    </Form>
  )
}

CraftLayout.craft = {
  related: {
    settings: LayoutSettings,
  },
}

export default CraftLayout