import { useNode, UserComponent } from '@craftjs/core'
import { Button, Collapse, Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React from 'react'
import { useIntl } from 'react-intl'
import { commonMessages, craftPageMessages } from '../../helpers/translation'
import { CraftPaddingProps } from '../../types/craft'
import { AdminHeaderTitle, StyledCollapsePanel, StyledSettingButtonWrapper } from '../common'
import CraftBoxModelInput, { formatBoxModelValue } from './CraftBoxModelInput'

type FieldProps = { padding: string }

const CraftContainer: UserComponent<{
  padding: CraftPaddingProps
  setActiveKey: React.Dispatch<React.SetStateAction<string>>
}> = ({ padding, setActiveKey, children }) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <div
      ref={ref => ref && connect(drag(ref))}
      style={{
        padding: `${padding.pt}px ${padding.pr}px ${padding.pb}px ${padding.pl}px`,
        cursor: 'pointer',
      }}
      onClick={() => setActiveKey('settings')}
    >
      {children}
    </div>
  )
}

const ContainerSettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [form] = useForm<FieldProps>()

  const {
    actions: { setProp },
    props,
    selected,
  } = useNode(node => ({
    props: node.data.props as { padding: CraftPaddingProps },
    button: node.data.custom.button,
    selected: node.events.selected,
  }))

  const handleSubmit = (values: FieldProps) => {
    const padding = formatBoxModelValue(values.padding)

    setProp(props => {
      props.padding = {
        pt: padding?.[0] || '0',
        pr: padding?.[1] || '0',
        pb: padding?.[2] || '0',
        pl: padding?.[3] || '0',
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
        padding: `${props.padding?.pt || 0};${props.padding?.pr || 0};${props.padding?.pb || 0};${
          props.padding?.pl || 0
        }`,
      }}
      onFinish={handleSubmit}
    >
      <Collapse className="mt-2 p-0" bordered={false} expandIconPosition="right" ghost defaultActiveKey={['container']}>
        <StyledCollapsePanel
          key="container"
          header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.containerComponent)}</AdminHeaderTitle>}
        >
          <Form.Item
            name="padding"
            label={formatMessage(craftPageMessages.label.boundary)}
            rules={[
              {
                required: true,
                pattern: /^\d+;\d+;\d+;\d+$/,
                message: formatMessage(craftPageMessages.text.boxModelInputWarning),
              },
            ]}
          >
            <CraftBoxModelInput />
          </Form.Item>
        </StyledCollapsePanel>
      </Collapse>

      {selected && (
        <StyledSettingButtonWrapper>
          <Button className="mb-3" type="primary" htmlType="submit" block>
            {formatMessage(commonMessages.ui.save)}
          </Button>
        </StyledSettingButtonWrapper>
      )}
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
