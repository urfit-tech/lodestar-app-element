import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { Collapse, Form, Input, InputNumber, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { replace } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { craftPageMessages } from '../../helpers/translation'
import { CraftLayoutProps } from '../../types/craft'
import { AdminHeaderTitle, CraftRefBlock, StyledCollapsePanel } from '../common'
import Layout from '../Layout'
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

type FieldProps = {
  desktopMargin: string
  desktopColumnAmount: number
  desktopColumnRatio: string
  desktopDisplayAmount: number
  mobileMargin: string
  mobileColumnAmount: number
  mobileColumnRatio: string
  mobileDisplayAmount: number
}

const CraftLayout: UserComponent<{
  desktop: CraftLayoutProps
  mobile: CraftLayoutProps
}> = ({ desktop, mobile, children }) => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const {
    connectors: { connect, drag },
    selected,
    hovered,
  } = useNode(node => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
  }))

  return (
    <CraftRefBlock ref={ref => ref && connect(drag(ref))} events={{ hovered, selected }} options={{ enabled }}>
      <Layout
        customStyle={{
          type: 'grid',
          mobile,
          desktop,
        }}
      >
        {children}
      </Layout>
    </CraftRefBlock>
  )
}

const LayoutSettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [form] = useForm<FieldProps>()

  const {
    actions: { setProp },
    props,
  } = useNode(node => ({
    props: node.data.props as { mobile: CraftLayoutProps; desktop: CraftLayoutProps },
  }))

  const handleChange = () => {
    form
      .validateFields()
      .then(values => {
        const desktopMargin = formatBoxModelValue(values.desktopMargin)
        const mobileMargin = formatBoxModelValue(values.mobileMargin)

        setProp(props => {
          props.desktop = {
            margin: {
              mt: desktopMargin?.[0] || '0',
              mr: desktopMargin?.[1] || '0',
              mb: desktopMargin?.[2] || '0',
              ml: desktopMargin?.[3] || '0',
            },
            columnAmount: values.desktopColumnAmount,
            columnRatio: values.desktopColumnRatio.split(':').map(Number),
            displayAmount: values.desktopDisplayAmount,
          }
          props.mobile = {
            margin: {
              mt: mobileMargin?.[0] || '0',
              mr: mobileMargin?.[1] || '0',
              mb: mobileMargin?.[2] || '0',
              ml: mobileMargin?.[3] || '0',
            },
            columnAmount: values.mobileColumnAmount,
            columnRatio: values.mobileColumnRatio.split(':').map(Number),
            displayAmount: values.mobileDisplayAmount,
          }
        })
      })
      .catch(() => {})
  }

  return (
    <Form
      form={form}
      layout="vertical"
      colon={false}
      requiredMark={false}
      initialValues={{
        desktopMargin: `${props.desktop.margin?.mt || 0};${props.desktop.margin?.mr || 0};${
          props.desktop.margin?.mb || 0
        };${props.desktop.margin?.ml || 0}`,
        desktopColumnAmount: props.desktop.columnAmount || 3,
        desktopColumnRatio: replace(/,/g, ':', props.desktop.columnRatio.toString() || '4,4,4') || [4, 4, 4],
        desktopDisplayAmount: props.desktop.displayAmount || 3,
        mobileMargin: `${props.mobile.margin?.mt || 0};${props.mobile.margin?.mr || 0};${
          props.mobile.margin?.mb || 0
        };${props.mobile.margin?.ml || 0}`,
        mobileColumnAmount: props.mobile.columnAmount || 3,
        mobileColumnRatio: replace(/,/g, ':', props.mobile.columnRatio.toString() || '12') || [12],
        mobileDisplayAmount: props.mobile.displayAmount || 3,
      }}
      onValuesChange={handleChange}
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
          <Form.Item name="desktopMargin" label={formatMessage(craftPageMessages.label.margin)}>
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
          <Form.Item name="mobileMargin" label={formatMessage(craftPageMessages.label.margin)}>
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
    </Form>
  )
}

CraftLayout.craft = {
  related: {
    settings: LayoutSettings,
  },
  custom: {
    button: {
      label: 'deleteAllBlock',
    },
  },
}

export default CraftLayout
