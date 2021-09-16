import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { Collapse, Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React from 'react'
import { useIntl } from 'react-intl'
import { craftPageMessages } from '../../helpers/translation'
import { CraftMarginProps, CraftPaddingProps } from '../../types/craft'
import { AdminHeaderTitle, CraftRefBlock, StyledCollapsePanel } from '../common'
import CraftBoxModelInput, { formatBoxModelValue } from './CraftBoxModelInput'

type FieldProps = { margin: string; padding: string }

const CraftContainer: UserComponent<{
  margin: CraftMarginProps
  padding?: CraftPaddingProps
}> = ({ margin, padding, children }) => {
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
    <CraftRefBlock
      ref={ref => ref && connect(drag(ref))}
      style={{
        margin: `${margin.mt}px ${margin.mr}px ${margin.mb}px ${margin.ml}px`,
        padding: padding && `${padding.pt}px ${padding.pr}px ${padding.pb}px ${padding.pl}px`,
      }}
      events={{ hovered, selected }}
      options={{ enabled }}
    >
      {children}
    </CraftRefBlock>
  )
}

const ContainerSettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [form] = useForm<FieldProps>()

  const {
    actions: { setProp },
    props,
  } = useNode(node => ({
    props: node.data.props as { margin: CraftMarginProps; padding?: CraftPaddingProps },
    button: node.data.custom.button,
  }))

  const handleChange = () => {
    form
      .validateFields()
      .then(values => {
        const margin = formatBoxModelValue(values.margin)
        const padding = formatBoxModelValue(values.padding)

        setProp(props => {
          props.margin = {
            mt: margin?.[0] || '0',
            mr: margin?.[1] || '0',
            mb: margin?.[2] || '0',
            ml: margin?.[3] || '0',
          }
          props.padding = {
            pt: padding?.[0] || '0',
            pr: padding?.[1] || '0',
            pb: padding?.[2] || '0',
            pl: padding?.[3] || '0',
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
        margin: `${props.margin?.mt || 0};${props.margin?.mr || 0};${props.margin?.mb || 0};${props.margin?.ml || 0}`,
        padding: `${props.padding?.pt || 0};${props.padding?.pr || 0};${props.padding?.pb || 0};${
          props.padding?.pl || 0
        }`,
      }}
    >
      <Collapse className="mt-2 p-0" bordered={false} expandIconPosition="right" ghost defaultActiveKey={['container']}>
        <StyledCollapsePanel
          key="container"
          header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.containerComponent)}</AdminHeaderTitle>}
        >
          <Form.Item
            name="margin"
            label={formatMessage(craftPageMessages.label.margin)}
            rules={[
              {
                required: true,
                pattern: /^\d+;\d+;\d+;\d+$/,
                message: formatMessage(craftPageMessages.text.boxModelInputWarning),
              },
            ]}
          >
            <CraftBoxModelInput onChange={handleChange} />
          </Form.Item>
          <Form.Item
            name="padding"
            label={formatMessage(craftPageMessages.label.padding)}
            rules={[
              {
                required: true,
                pattern: /^\d+;\d+;\d+;\d+$/,
                message: formatMessage(craftPageMessages.text.boxModelInputWarning),
              },
            ]}
          >
            <CraftBoxModelInput onChange={handleChange} />
          </Form.Item>
        </StyledCollapsePanel>
      </Collapse>
    </Form>
  )
}

CraftContainer.craft = {
  related: {
    settings: ContainerSettings,
  },
  custom: {
    button: {
      label: 'deleteBlock',
    },
  },
}

export default CraftContainer
