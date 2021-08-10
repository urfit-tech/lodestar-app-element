import { useNode, UserComponent } from '@craftjs/core'
import { Button, Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React from 'react'
import { useIntl } from 'react-intl'
import { StyledParagraph, StyledTitle } from '../../components/common'
import { commonMessages, craftPageMessages } from '../../helpers/translation'
import { CraftParagraphProps, CraftTextStyleProps, CraftTitleProps } from '../../types/craft'
import { StyledSettingButtonWrapper } from '../common'
import { formatBoxModelValue } from './CraftBoxModelInput'
import CraftParagraphContentBlock from './CraftParagraphContentBlock'
import CraftTextStyleBlock from './CraftTextStyleBlock'
import CraftTitleContentBlock from './CraftTitleContentBlock'

type FieldProps = {
  titleContent: string
  titleStyle: Pick<CraftTextStyleProps, 'fontSize' | 'textAlign' | 'fontWeight' | 'color'> & {
    margin: string
  }
  paragraphContent: string
  paragraphStyle: Pick<CraftTextStyleProps, 'fontSize' | 'lineHeight' | 'textAlign' | 'fontWeight' | 'color'> & {
    margin: string
  }
}

const CraftTitleAndParagraph: UserComponent<
  { title: CraftTitleProps; paragraph: CraftParagraphProps } & {
    setActiveKey: React.Dispatch<React.SetStateAction<string>>
  }
> = ({ title, paragraph, setActiveKey }) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <div ref={ref => ref && connect(drag(ref))} style={{ cursor: 'pointer' }} onClick={() => setActiveKey('settings')}>
      <StyledTitle
        customStyle={{
          fontSize: title.fontSize,
          mt: title.margin.mt,
          mr: title.margin.mr,
          mb: title.margin.mb,
          ml: title.margin.ml,
          textAlign: title.textAlign,
          fontWeight: title.fontWeight,
          color: title.color,
        }}
      >
        {title.titleContent}
      </StyledTitle>
      <StyledParagraph
        customStyle={{
          fontSize: paragraph.fontSize,
          mt: paragraph.margin.mt,
          mr: paragraph.margin.mr,
          mb: paragraph.margin.mb,
          ml: paragraph.margin.ml,
          textAlign: paragraph.textAlign,
          fontWeight: paragraph.fontWeight,
          color: paragraph.color,
          lineHeight: paragraph.lineHeight || 1,
        }}
      >
        {paragraph.paragraphContent}
      </StyledParagraph>
    </div>
  )
}

const TitleAndParagraphSettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [form] = useForm<FieldProps>()

  const {
    actions: { setProp },
    props,
    selected,
  } = useNode(node => ({
    props: {
      title: node.data.props.title as CraftTitleProps,
      paragraph: node.data.props.paragraph as CraftParagraphProps,
    },
    selected: node.events.selected,
  }))

  const handleSubmit = (values: FieldProps) => {
    const titleMargin = formatBoxModelValue(values.titleStyle.margin)
    const paragraphMargin = formatBoxModelValue(values.paragraphStyle.margin)

    setProp(props => {
      props.title.titleContent = values.titleContent
      props.title.fontSize = values.titleStyle.fontSize
      props.title.margin = {
        mt: titleMargin?.[0] || '0',
        mr: titleMargin?.[1] || '0',
        mb: titleMargin?.[2] || '0',
        ml: titleMargin?.[3] || '0',
      }
      props.title.textAlign = values.titleStyle.textAlign
      props.title.fontWeight = values.titleStyle.fontWeight
      props.title.color = values.titleStyle.color
      props.paragraph.paragraphContent = values.paragraphContent
      props.paragraph.fontSize = values.paragraphStyle.fontSize
      props.paragraph.lineHeight = values.paragraphStyle.lineHeight
      props.paragraph.margin = {
        mt: paragraphMargin?.[0] || '0',
        mr: paragraphMargin?.[1] || '0',
        mb: paragraphMargin?.[2] || '0',
        ml: paragraphMargin?.[3] || '0',
      }
      props.paragraph.textAlign = values.paragraphStyle.textAlign
      props.paragraph.fontWeight = values.paragraphStyle.fontWeight
      props.paragraph.color = values.paragraphStyle.color
    })
  }

  return (
    <Form
      form={form}
      layout="vertical"
      colon={false}
      requiredMark={false}
      initialValues={{
        titleContent: props.title.titleContent || '',
        titleStyle: {
          fontSize: props.title.fontSize || 16,
          margin: `${props.title.margin?.mt || 0};${props.title.margin?.mr || 0};${props.title.margin?.mb || 0};${
            props.title.margin?.ml || 0
          }`,
          textAlign: props.title.textAlign || 'left',
          fontWeight: props.title.fontWeight || 'normal',
          color: props.title.color || '#585858',
        },
        paragraphContent: props.paragraph.paragraphContent || '',
        paragraphStyle: {
          fontSize: props.paragraph.fontSize || 16,
          margin: `${props.paragraph.margin?.mt || 0};${props.paragraph.margin?.mr || 0};${
            props.paragraph.margin?.mb || 0
          };${props.paragraph.margin?.ml || 0}`,
          textAlign: props.paragraph.textAlign || 'left',
          fontWeight: props.paragraph.fontWeight || 'normal',
          color: props.paragraph.color || '#585858',
          lineHeight: props.paragraph?.lineHeight || 1,
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
      <Form.Item name="paragraphContent">
        <CraftParagraphContentBlock />
      </Form.Item>
      <Form.Item name="paragraphStyle">
        <CraftTextStyleBlock type="paragraph" title={formatMessage(craftPageMessages.label.paragraphStyle)} />
      </Form.Item>
      {selected && (
        <StyledSettingButtonWrapper>
          <Button className="mb-3" type="primary" block htmlType="submit">
            {formatMessage(commonMessages.ui.save)}
          </Button>
        </StyledSettingButtonWrapper>
      )}
    </Form>
  )
}

CraftTitleAndParagraph.craft = {
  related: {
    settings: TitleAndParagraphSettings,
  },
  custom: {
    button: {
      label: 'deleteBlock',
    },
  },
}

export default CraftTitleAndParagraph
