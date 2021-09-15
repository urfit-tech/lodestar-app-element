import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { Checkbox, Form, Input, Radio, Space } from 'antd'
import Collapse, { CollapseProps } from 'antd/lib/collapse'
import { useForm } from 'antd/lib/form/Form'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import Button from '../../components/Button'
import { craftPageMessages } from '../../helpers/translation'
import { CraftButtonProps } from '../../types/craft'
import {
  AdminHeaderTitle,
  CraftSelectedMixin,
  StyledCollapsePanel,
  StyledCraftSettingLabel,
  StyledUnderLineInput,
} from '../common'
import CraftColorPickerBlock from './CraftColorPickerBlock'

const StyledButtonWrapper = styled.div<{ block: boolean; selected?: boolean }>`
  ${props => (props.block ? 'display:block; width:100%;' : 'display:inline-block;')}
  ${props => props.selected && CraftSelectedMixin}
  text-align: center;
`

type FieldProps = CraftButtonProps

const CraftButton: UserComponent<CraftButtonProps> = ({
  title,
  link,
  openNewTab,
  size,
  block,
  variant,
  color,
  outlineColor,
  backgroundColor,
  backgroundType,
}) => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const {
    connectors: { connect, drag },
    selected,
  } = useNode(node => ({
    selected: node.events.selected,
  }))

  return (
    <StyledButtonWrapper ref={ref => ref && connect(drag(ref))} block={block} selected={selected}>
      <Button
        variant={variant}
        color={color}
        outlineColor={outlineColor}
        backgroundColor={backgroundType === 'solidColor' ? backgroundColor : undefined}
        size={size}
        block={block}
        link={link}
        openNewTab={openNewTab}
        craftEnabled={enabled}
      >
        {title}
      </Button>
    </StyledButtonWrapper>
  )
}

const ButtonSetting: React.VFC<CollapseProps> = ({ ...collapseProps }) => {
  const { formatMessage } = useIntl()
  const [form] = useForm<FieldProps>()
  const {
    actions: { setProp },
    props,
    selected,
  } = useNode(node => ({
    props: node.data.props as CraftButtonProps,
    selected: node.events.selected,
  }))

  const handleChange = () => {
    form
      .validateFields()
      .then(values => {
        setProp((props: CraftButtonProps) => {
          props.title = values.title
          props.link = values.link
          props.openNewTab = values.openNewTab
          props.size = values.size
          props.block = values.block
          props.variant = values.variant
          props.color = values.color
          props.outlineColor = values.outlineColor
          props.backgroundColor = values.backgroundType === 'solidColor' ? values.backgroundColor : undefined
          props.backgroundType = values.backgroundType
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
        title: props.title || '',
        link: props.link || '',
        openNewTab: props.openNewTab || false,
        size: props.size || 'md',
        block: props.block || false,
        variant: props.variant || 'solid',
        color: props.color || '#585858',
        outlineColor: props.outlineColor,
        backgroundColor: props.backgroundColor,
        backgroundType: props.backgroundType || 'none',
      }}
      onValuesChange={handleChange}
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
          header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.buttonSetting)}</AdminHeaderTitle>}
        >
          <Form.Item
            name="title"
            label={<StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.title)}</StyledCraftSettingLabel>}
          >
            <Input className="mt-2" value={props.title} />
          </Form.Item>

          <Form.Item
            className="m-0"
            name="link"
            label={<StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.link)}</StyledCraftSettingLabel>}
          >
            <StyledUnderLineInput className="mb-2" placeholder="https://" />
          </Form.Item>
          <Form.Item name="openNewTab" valuePropName="checked">
            <Checkbox
              onChange={e => {
                setProp((props: CraftButtonProps) => (props.openNewTab = e.target.checked))
              }}
            >
              {formatMessage(craftPageMessages.label.openNewTab)}
            </Checkbox>
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
          header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.buttonStyle)}</AdminHeaderTitle>}
        >
          <Form.Item
            name="size"
            label={
              <StyledCraftSettingLabel className="mb-2">
                {formatMessage(craftPageMessages.label.size)}
              </StyledCraftSettingLabel>
            }
          >
            <Radio.Group onChange={e => setProp((props: CraftButtonProps) => (props.size = e.target.value))}>
              <Space direction="vertical">
                <Radio value="lg">{formatMessage(craftPageMessages.label.large)}</Radio>
                <Radio value="md">{formatMessage(craftPageMessages.label.middle)}</Radio>
                <Radio value="sm">{formatMessage(craftPageMessages.label.small)}</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="block"
            valuePropName="checked"
            label={<StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.width)}</StyledCraftSettingLabel>}
          >
            <Checkbox
              onChange={e => {
                setProp((props: CraftButtonProps) => (props.block = e.target.checked))
              }}
            >
              {formatMessage(craftPageMessages.label.buttonBlock)}
            </Checkbox>
          </Form.Item>

          <Form.Item
            name="variant"
            label={<StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.variant)}</StyledCraftSettingLabel>}
          >
            <Radio.Group onChange={e => setProp((props: CraftButtonProps) => (props.variant = e.target.value))}>
              <Space direction="vertical">
                <Radio value="text">{formatMessage(craftPageMessages.label.plainText)}</Radio>
                <Radio value="solid">{formatMessage(craftPageMessages.label.coloring)}</Radio>
                <Radio value="outline">{formatMessage(craftPageMessages.label.outline)}</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="color" noStyle={props.variant !== 'text'}>
            {props.variant === 'text' && <CraftColorPickerBlock />}
          </Form.Item>

          <Form.Item name="outlineColor" noStyle={props.variant !== 'outline'}>
            {props.variant === 'outline' && <CraftColorPickerBlock />}
          </Form.Item>
        </StyledCollapsePanel>
      </Collapse>
      <Form.Item
        name="backgroundType"
        label={formatMessage(craftPageMessages.label.background)}
        noStyle={props.variant !== 'solid'}
      >
        {props.variant === 'solid' && (
          <Radio.Group
            buttonStyle="solid"
            onChange={e => setProp((props: CraftButtonProps) => (props.backgroundType = e.target.value))}
          >
            <Radio.Button value="none">{formatMessage(craftPageMessages.ui.empty)}</Radio.Button>
            <Radio.Button value="solidColor">{formatMessage(craftPageMessages.ui.solidColor)}</Radio.Button>
          </Radio.Group>
        )}
      </Form.Item>
      <Form.Item name="backgroundColor" noStyle={props.variant !== 'solid' && props.backgroundType !== 'solidColor'}>
        {props.variant === 'solid' && props.backgroundType === 'solidColor' && <CraftColorPickerBlock />}
      </Form.Item>
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
