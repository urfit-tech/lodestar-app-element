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
  paragraphStyle: Omit<CraftTextStyleProps, 'padding'> & { padding: string }
}

const CraftParagraph: UserComponent<
  CraftParagraphProps & { setActiveKey: React.Dispatch<React.SetStateAction<string>> }
> = ({ paragraphContent, fontSize, lineHeight, padding, textAlign, fontWeight, color, setActiveKey }) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <StyledParagraph
      ref={ref => ref && connect(drag(ref))}
      customStyle={{
        fontSize,
        pt: padding.pt,
        pr: padding.pr,
        pb: padding.pb,
        pl: padding.pl,
        textAlign,
        fontWeight,
        color,
        lineHeight: lineHeight || 1,
      }}
      style={{ cursor: 'pointer' }}
      onClick={() => setActiveKey('settings')}
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
    const paragraphPadding = formatBoxModelValue(values.paragraphStyle.padding)

    setProp(props => {
      props.paragraphContent = values.paragraphContent
      props.fontSize = values.paragraphStyle.fontSize
      props.lineHeight = values.paragraphStyle.lineHeight
      props.padding = {
        pt: paragraphPadding?.[0] || '0',
        pr: paragraphPadding?.[1] || '0',
        pb: paragraphPadding?.[2] || '0',
        pl: paragraphPadding?.[3] || '0',
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
          padding: `${props.padding?.pt || 0};${props.padding?.pr || 0};${props.padding?.pb || 0};${
            props.padding?.pl || 0
          }`,
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
