import { useNode, UserComponent } from '@craftjs/core'
import { Button, Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React from 'react'
import { useIntl } from 'react-intl'
import { StyledParagraph } from '../../components/common'
import { commonMessages, craftPageMessages } from '../../helpers/translation'
import { CraftParagraphProps, CraftTextStyleProps } from '../../types/craft'
import { StyledSettingButtonWrapper } from '../common'
import { formatBoxModelValue } from './CraftBoxModelInput'
import CraftParagraphContentBlock from './CraftParagraphContentBlock'
import CraftTextStyleBlock from './CraftTextStyleBlock'

type FieldProps = {
  paragraphContent: string
  paragraphStyle: Pick<CraftTextStyleProps, 'fontSize' | 'lineHeight' | 'textAlign' | 'fontWeight' | 'color'> & {
    margin: string
  }
}

const CraftParagraph: UserComponent<CraftParagraphProps> = ({
  paragraphContent,
  fontSize,
  lineHeight,
  margin,
  textAlign,
  fontWeight,
  color,
  letterSpacing,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <StyledParagraph
      ref={ref => ref && connect(drag(ref))}
      customStyle={{
        fontSize,
        mt: margin.mt,
        mr: margin.mr,
        mb: margin.mb,
        ml: margin.ml,
        textAlign,
        fontWeight,
        color,
        lineHeight: lineHeight || 1,
        letterSpacing,
      }}
      style={{ cursor: 'pointer' }}
    >
      {paragraphContent}
    </StyledParagraph>
  )
}

const ParagraphSettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [form] = useForm<FieldProps>()

  const {
    actions: { setProp },
    props,
    selected,
  } = useNode(node => ({
    props: node.data.props as CraftParagraphProps,
    selected: node.events.selected,
  }))

  const handleSubmit = (values: FieldProps) => {
    const paragraphMargin = formatBoxModelValue(values.paragraphStyle.margin)

    setProp(props => {
      props.paragraphContent = values.paragraphContent
      props.fontSize = values.paragraphStyle.fontSize
      props.lineHeight = values.paragraphStyle.lineHeight
      props.margin = {
        mt: paragraphMargin?.[0] || '0',
        mr: paragraphMargin?.[1] || '0',
        mb: paragraphMargin?.[2] || '0',
        ml: paragraphMargin?.[3] || '0',
      }
      props.textAlign = values.paragraphStyle.textAlign
      props.fontWeight = values.paragraphStyle.fontWeight
      props.color = values.paragraphStyle.color
    })
  }

  return (
    <Form
      form={form}
      layout="vertical"
      colon={false}
      requiredMark={false}
      initialValues={{
        paragraphContent: props.paragraphContent || '',
        paragraphStyle: {
          fontSize: props.fontSize || 16,
          margin: `${props.margin?.mt || 0};${props.margin?.mr || 0};${props.margin?.mb || 0};${props.margin?.ml || 0}`,
          lineHeight: props?.lineHeight || 1,
          textAlign: props.textAlign || 'left',
          fontWeight: props.fontWeight || 'normal',
          color: props.color || '#585858',
        },
      }}
      onFinish={handleSubmit}
    >
      <Form.Item name="paragraphContent">
        <CraftParagraphContentBlock />
      </Form.Item>
      <Form.Item name="paragraphStyle">
        <CraftTextStyleBlock type="paragraph" title={formatMessage(craftPageMessages.label.paragraphStyle)} />
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

CraftParagraph.craft = {
  related: {
    settings: ParagraphSettings,
  },
}

export default CraftParagraph
