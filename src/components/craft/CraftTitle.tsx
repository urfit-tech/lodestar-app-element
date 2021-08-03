import { useNode, UserComponent } from '@craftjs/core'
import { Button, Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React from 'react'
import { useIntl } from 'react-intl'
import { StyledTitle } from '../../components/common'
import { commonMessages, craftPageMessages } from '../../helpers/translation'
import { CraftTextStyleProps, CraftTitleProps } from '../../types/craft'
import { StyledSettingButtonWrapper } from '../common'
import { formatBoxModelValue } from './CraftBoxModelInput'
import CraftTextStyleBlock from './CraftTextStyleBlock'
import CraftTitleContentBlock from './CraftTitleContentBlock'

type FieldProps = {
  titleContent: string
  titleStyle: Omit<CraftTextStyleProps, 'padding'> & { padding: string }
}

const CraftTitle: UserComponent<CraftTitleProps & { setActiveKey: React.Dispatch<React.SetStateAction<string>> }> = ({
  titleContent,
  fontSize,
  padding,
  textAlign,
  fontWeight,
  color,
  setActiveKey,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <StyledTitle
      ref={ref => ref && connect(drag(ref))}
      customStyle={{
        fontSize,
        pt: padding.pt,
        pr: padding.pr,
        pb: padding.pb,
        pl: padding.pl,
        textAlign: textAlign,
        fontWeight: fontWeight,
        color: color,
      }}
      style={{ cursor: 'pointer' }}
      onClick={() => setActiveKey('settings')}
    >
      {titleContent}
    </StyledTitle>
  )
}

const TitleSettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [form] = useForm<FieldProps>()
  const {
    actions: { setProp },
    props,
    selected,
  } = useNode(node => ({
    props: node.data.props as CraftTitleProps,
    selected: node.events.selected,
  }))

  const handleSubmit = (values: FieldProps) => {
    const titlePadding = formatBoxModelValue(values.titleStyle.padding)

    setProp(prop => {
      prop.titleContent = values.titleContent
      prop.fontSize = values.titleStyle.fontSize
      prop.padding = {
        pt: titlePadding?.[0] || '0',
        pr: titlePadding?.[1] || '0',
        pb: titlePadding?.[2] || '0',
        pl: titlePadding?.[3] || '0',
      }
      prop.textAlign = values.titleStyle.textAlign
      prop.fontWeight = values.titleStyle.fontWeight
      prop.color = values.titleStyle.color
    })
  }

  return (
    <Form
      form={form}
      layout="vertical"
      colon={false}
      requiredMark={false}
      initialValues={{
        titleContent: props.titleContent || '',
        titleStyle: {
          fontSize: props.fontSize || 16,
          padding: `${props.padding?.pt || 0};${props.padding?.pr || 0};${props.padding?.pb || 0};${
            props.padding?.pl || 0
          }`,
          textAlign: props.textAlign || 'left',
          fontWeight: props.fontWeight || 'normal',
          color: props.color || '#585858',
        },
      }}
      onFinish={handleSubmit}
    >
      <Form.Item name="titleContent">
        <CraftTitleContentBlock />
      </Form.Item>
      <Form.Item name="titleStyle">
        <CraftTextStyleBlock type="title" title={formatMessage(craftPageMessages.label.titleStyle)} />
      </Form.Item>
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

CraftTitle.craft = {
  related: {
    settings: TitleSettings,
  },
}

export default CraftTitle
