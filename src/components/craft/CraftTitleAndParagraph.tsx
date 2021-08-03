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
  titleStyle: Omit<CraftTextStyleProps, 'padding'> & { padding: string }
  paragraphContent: string
  paragraphStyle: Omit<CraftTextStyleProps, 'padding'> & { padding: string }
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
          pt: title.padding.pt,
          pr: title.padding.pr,
          pb: title.padding.pb,
          pl: title.padding.pl,
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
          pt: paragraph.padding.pt,
          pr: paragraph.padding.pr,
          pb: paragraph.padding.pb,
          pl: paragraph.padding.pl,
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
    const titlePadding = formatBoxModelValue(values.titleStyle.padding)
    const paragraphPadding = formatBoxModelValue(values.paragraphStyle.padding)

    setProp(props => {
      props.title.titleContent = values.titleContent
      props.title.fontSize = values.titleStyle.fontSize
      props.title.padding = {
        pt: titlePadding?.[0] || '0',
        pr: titlePadding?.[1] || '0',
        pb: titlePadding?.[2] || '0',
        pl: titlePadding?.[3] || '0',
      }
      props.title.textAlign = values.titleStyle.textAlign
      props.title.fontWeight = values.titleStyle.fontWeight
      props.title.color = values.titleStyle.color
      props.paragraph.paragraphContent = values.paragraphContent
      props.paragraph.fontSize = values.paragraphStyle.fontSize
      props.paragraph.lineHeight = values.paragraphStyle.lineHeight
      props.paragraph.padding = {
        pt: paragraphPadding?.[0] || '0',
        pr: paragraphPadding?.[1] || '0',
        pb: paragraphPadding?.[2] || '0',
        pl: paragraphPadding?.[3] || '0',
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
          padding: `${props.title.padding?.pt || 0};${props.title.padding?.pr || 0};${props.title.padding?.pb || 0};${
            props.title.padding?.pl || 0
          }`,
          textAlign: props.title.textAlign || 'left',
          fontWeight: props.title.fontWeight || 'normal',
          color: props.title.color || '#585858',
        },
        paragraphContent: props.paragraph.paragraphContent || '',
        paragraphStyle: {
          fontSize: props.paragraph.fontSize || 16,
          padding: `${props.paragraph.padding?.pt || 0};${props.paragraph.padding?.pr || 0};${
            props.paragraph.padding?.pb || 0
          };${props.paragraph.padding?.pl || 0}`,
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
