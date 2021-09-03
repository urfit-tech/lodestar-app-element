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
  titleStyle: Pick<CraftTextStyleProps, 'fontSize' | 'textAlign' | 'fontWeight' | 'color'> & {
    margin: string
  }
}

const CraftTitle: UserComponent<CraftTitleProps> = ({
  titleContent,
  fontSize,
  margin,
  textAlign,
  fontWeight,
  color,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <StyledTitle
      ref={ref => ref && connect(drag(ref))}
      customStyle={{
        fontSize,
        mt: margin.mt,
        mr: margin.mr,
        mb: margin.mb,
        ml: margin.ml,
        textAlign: textAlign,
        fontWeight: fontWeight,
        color: color,
      }}
      style={{ cursor: 'pointer' }}
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
    const titleMargin = formatBoxModelValue(values.titleStyle.margin)

    setProp(prop => {
      prop.titleContent = values.titleContent
      prop.fontSize = values.titleStyle.fontSize
      prop.margin = {
        mt: titleMargin?.[0] || '0',
        mr: titleMargin?.[1] || '0',
        mb: titleMargin?.[2] || '0',
        ml: titleMargin?.[3] || '0',
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
          margin: `${props.margin?.mt || 0};${props.margin?.mr || 0};${props.margin?.mb || 0};${props.margin?.ml || 0}`,
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
