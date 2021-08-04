import { useNode, UserComponent } from '@craftjs/core'
import { Button as AntdButton, Checkbox, Form, Input } from 'antd'
import Collapse, { CollapseProps } from 'antd/lib/collapse'
import { useForm } from 'antd/lib/form/Form'
import styled from 'styled-components'
import Button from '../../components/Button'
import { CraftButtonProps } from '../../types/craft'
import {
  AdminHeaderTitle,
  StyledCollapsePanel,
  StyledCraftSettingLabel,
  StyledSettingButtonWrapper,
  StyledUnderLineInput,
} from '../common'
import CraftColorPickerBlock from './CraftColorPickerBlock'

const StyledButtonWrapper = styled.div<{ block: boolean; variant: string }>`
  display: ${props => (props.block ? 'block' : 'inline-block')};
  background-color: ${props => (props.variant === 'solid' ? props.theme['@primary-color'] : '')};
  text-align: center;
`

type FieldProps = CraftButtonProps

const CraftButton: UserComponent<CraftButtonProps & { setActiveKey: React.Dispatch<React.SetStateAction<string>> }> = ({
  title,
  link,
  openNewTab,
  size,
  block,
  variant,
  color,
  setActiveKey,
  children,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <StyledButtonWrapper
      ref={ref => ref && connect(drag(ref))}
      block={block}
      variant={variant}
      style={{ cursor: 'pointer', background: `${color}` }}
      onClick={() => setActiveKey('settings')}
    >
      <Button size={size} block={block}>
        {title}
      </Button>
    </StyledButtonWrapper>
  )
}

const ButtonSetting: React.VFC<CollapseProps> = ({ ...collapseProps }) => {
  // const { formatMessage } = useIntl()
  const [form] = useForm<FieldProps>()
  const {
    actions: { setProp },
    props,
    selected,
  } = useNode(node => ({
    props: node.data.props as CraftButtonProps,
    selected: node.events.selected,
  }))

  const handleSubmit = (values: FieldProps) => {
    setProp((props: CraftButtonProps) => {
      props.title = values.title
      props.link = values.link
      props.openNewTab = values.openNewTab
      props.size = values.size
      props.block = values.block
      props.variant = values.variant
      props.color = values.color
    })
  }

  return (
    <Form
      form={form}
      layout="vertical"
      colon={false}
      requiredMark={false}
      initialValues={{
        title: props.title || '',
        link: props.link || '',
        openNewTab: props.openNewTab || false,
        size: props.size || 'md',
        block: props.block || false,
        variant: props.variant || 'solid',
        color: props.color || '#585858',
      }}
      onFinish={handleSubmit}
    >
      <Collapse
        {...collapseProps}
        className="mt-2 p-0"
        bordered={false}
        expandIconPosition="right"
        ghost
        defaultActiveKey={['buttonSetting']}
      >
        <StyledCollapsePanel
          key="buttonSetting"
          header={
            <AdminHeaderTitle>
              {/* {formatMessage(craftPageMessages.label.buttonSetting)} */}buttonSettings
            </AdminHeaderTitle>
          }
        >
          <Form.Item
            name="title"
            label={
              <StyledCraftSettingLabel>
                {/* {formatMessage(craftPageMessages.label.title)} */}title
              </StyledCraftSettingLabel>
            }
          >
            <Input className="mt-2" value={props.title} />
          </Form.Item>

          <Form.Item
            className="m-0"
            name="link"
            label={
              <StyledCraftSettingLabel>
                {/* {formatMessage(craftPageMessages.label.link)} */}link
              </StyledCraftSettingLabel>
            }
          >
            <StyledUnderLineInput className="mb-2" placeholder="https://" />
          </Form.Item>
          <Form.Item name="openNewTab" valuePropName="checked">
            <Checkbox>{/* {formatMessage(craftPageMessages.label.openNewTab)} */}openNewTab</Checkbox>
          </Form.Item>
        </StyledCollapsePanel>
      </Collapse>

      <Collapse
        {...collapseProps}
        className="mt-4 p-0"
        bordered={false}
        expandIconPosition="right"
        ghost
        defaultActiveKey={['buttonStyle']}
      >
        <StyledCollapsePanel
          key="buttonStyle"
          header={
            <AdminHeaderTitle>{/* {formatMessage(craftPageMessages.label.buttonStyle)} */}buttonStyle</AdminHeaderTitle>
          }
        >
          {/* <Form.Item
            name="size"
            label={
              <StyledCraftSettingLabel className="mb-2">
                {formatMessage(craftPageMessages.label.size)}
              </StyledCraftSettingLabel>
            }
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="lg">{formatMessage(craftPageMessages.label.large)}</Radio>
                <Radio value="md">{formatMessage(craftPageMessages.label.middle)}</Radio>
                <Radio value="sl">{formatMessage(craftPageMessages.label.small)}</Radio>
              </Space>
            </Radio.Group>
          </Form.Item> */}
          {/* <Form.Item
            name="block"
            valuePropName="checked"
            label={<StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.width)}</StyledCraftSettingLabel>}
          >
            <Checkbox
              onChange={e => {
                setProp((props: CraftButtonProps) => (props.openNewTab = e.target.checked))
              }}
            >
              {formatMessage(craftPageMessages.label.buttonBlock)}
            </Checkbox>
          </Form.Item> */}

          {/* 
          //TODO: not display in the version, tbd 
          <Form.Item
            name="variant"
            label={<StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.variant)}</StyledCraftSettingLabel>}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="text">{formatMessage(craftPageMessages.label.plainText)}</Radio>
                <Radio value="solid">{formatMessage(craftPageMessages.label.coloring)}</Radio>
                <Radio value="outline">{formatMessage(craftPageMessages.label.outline)}</Radio>
              </Space>
            </Radio.Group>
          </Form.Item> */}

          <Form.Item name="color">
            <CraftColorPickerBlock />
          </Form.Item>
        </StyledCollapsePanel>
      </Collapse>

      {selected && (
        <StyledSettingButtonWrapper>
          <AntdButton className="mb-3" type="primary" block htmlType="submit">
            {/* {formatMessage(commonMessages.ui.save)} */}save
          </AntdButton>
        </StyledSettingButtonWrapper>
      )}
    </Form>
  )
}

CraftButton.craft = {
  related: {
    settings: ButtonSetting,
  },
  custom: {
    button: {
      label: 'deleteBlock',
    },
  },
}

export default CraftButton
