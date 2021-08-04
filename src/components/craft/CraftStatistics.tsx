import { useNode, UserComponent } from '@craftjs/core'
import { Button, Collapse, Form, Radio } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { commonMessages, craftPageMessages } from '../../helpers/translation'
import {
  CraftBoxModelProps,
  CraftImageProps,
  CraftParagraphProps,
  CraftTextStyleProps,
  CraftTitleProps,
} from '../../types/craft'
import { AdminHeaderTitle, StyledCollapsePanel, StyledSettingButtonWrapper } from '../common'
import ImageUploader from '../common/ImageUploader'
import CraftBoxModelInput, { formatBoxModelValue } from './CraftBoxModelInput'
import CraftTextStyleBlock from './CraftTextStyleBlock'
import CraftTitleContentBlock from './CraftTitleContentBlock'

type CraftStatisticsProps = CraftImageProps &
  CraftBoxModelProps & { title: CraftTitleProps; paragraph: CraftParagraphProps }

type FieldProps = {
  type: string
  padding: string
  margin: string
  titleContent: string
  titleStyle: Omit<CraftTextStyleProps, 'padding'> & { padding: string }
  paragraphContent: string
  paragraphStyle: Omit<CraftTextStyleProps, 'padding'> & { padding: string }
}

const CraftStatistics: UserComponent<
  CraftStatisticsProps & { setActiveKey: React.Dispatch<React.SetStateAction<string>> }
> = ({ title, paragraph, padding, margin, coverUrl, setActiveKey, children }) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <div
      ref={ref => ref && connect(drag(ref))}
      style={{
        padding: `${padding?.pt}px ${padding?.pr}px ${padding?.pb}px ${padding?.pl}px`,
        margin: `${margin?.mt}px ${margin?.mr}px ${margin?.mb}px ${margin?.ml}px`,
        cursor: 'pointer',
      }}
      onClick={() => setActiveKey('settings')}
    >
      <div>{title.titleContent}</div>
    </div>
  )
}

const StatisticsSettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [form] = useForm<FieldProps>()

  const {
    actions: { setProp },
    props,
    selected,
  } = useNode(node => ({
    props: node.data.props as CraftBoxModelProps & CraftStatisticsProps,
    selected: node.events.selected,
  }))
  const [coverImage, setCoverImage] = useState<File | null>(null)

  const handleSubmit = (values: FieldProps) => {
    const padding = formatBoxModelValue(values.padding)
    const margin = formatBoxModelValue(values.margin)
    const titlePadding = formatBoxModelValue(values.titleStyle.padding)
    const paragraphPadding = formatBoxModelValue(values.paragraphStyle.padding)

    setProp(props => {
      props.type = values.type
      props.coverImage = coverImage
      props.padding = {
        pt: padding?.[0] || '0',
        pr: padding?.[1] || '0',
        pb: padding?.[2] || '0',
        pl: padding?.[3] || '0',
      }
      props.margin = {
        mt: margin?.[0] || '0',
        mr: margin?.[1] || '0',
        mb: margin?.[2] || '0',
        ml: margin?.[3] || '0',
      }
      props.title = {
        titleContent: values.titleContent,
        fontSize: values.titleStyle.fontSize,
        padding: {
          pt: titlePadding?.[0] || '0',
          pr: titlePadding?.[1] || '0',
          pb: titlePadding?.[2] || '0',
          pl: titlePadding?.[3] || '0',
        },
        textAlign: values.titleStyle.textAlign,
        fontWeight: values.titleStyle.fontWeight,
        color: values.titleStyle.color,
      }
      props.paragraph = {
        content: values.paragraphContent,
        fontSize: values.paragraphStyle.fontSize,
        padding: {
          pt: paragraphPadding?.[0] || '0',
          pr: paragraphPadding?.[1] || '0',
          pb: paragraphPadding?.[2] || '0',
          pl: paragraphPadding?.[3] || '0',
        },
        textAlign: values.paragraphStyle.textAlign,
        fontWeight: values.paragraphStyle.fontWeight,
        color: values.paragraphStyle.color,
      }
    })
    //TODO: upload image
  }

  return (
    <Form
      form={form}
      layout="vertical"
      colon={false}
      requiredMark={false}
      initialValues={{
        type: props.type || 'image',
        coverImage: props.coverUrl,
        padding: `${props.padding?.pt || 0};${props.padding?.pr || 0};${props.padding?.pb || 0};${
          props.padding?.pl || 0
        }`,
        margin: `${props.margin?.mt || 0};${props.margin?.mr || 0};${props.margin?.mb || 0};${props.margin?.ml || 0}`,
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
          lineHeight: props.paragraph.lineHeight || 1,
          padding: `${props.paragraph.padding?.pt || 0};${props.paragraph.padding?.pr || 0};${
            props.paragraph.padding?.pb || 0
          };${props.paragraph.padding?.pl || 0}`,
          textAlign: props.paragraph.textAlign || 'left',
          fontWeight: props.paragraph.fontWeight || 'normal',
          color: props.paragraph.color || '#585858',
        },
      }}
      onFinish={handleSubmit}
    >
      <Collapse
        className="mt-2 p-0"
        bordered={false}
        expandIconPosition="right"
        ghost
        defaultActiveKey={['imageSetting']}
      >
        <StyledCollapsePanel
          key="imageSetting"
          header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.imageSetting)}</AdminHeaderTitle>}
        >
          <Form.Item name="type">
            <Radio.Group buttonStyle="solid">
              <Radio.Button
                value="empty"
                onChange={() =>
                  setProp((props: CraftStatisticsProps) => {
                    props.type = 'empty'
                  })
                }
              >
                {formatMessage(craftPageMessages.ui.empty)}
              </Radio.Button>
              <Radio.Button
                value="image"
                onChange={() =>
                  setProp((props: CraftStatisticsProps) => {
                    props.type = 'image'
                  })
                }
              >
                {formatMessage(craftPageMessages.ui.image)}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          {props.type === 'image' && (
            <Form.Item name="coverImage">
              <ImageUploader
                file={coverImage}
                initialCoverUrl={props.coverUrl}
                onChange={file => {
                  setCoverImage(file)
                }}
              />
            </Form.Item>
          )}
        </StyledCollapsePanel>
      </Collapse>
      {props.type === 'image' && (
        <Collapse
          className="mt-2 p-0"
          bordered={false}
          expandIconPosition="right"
          ghost
          defaultActiveKey={['container']}
        >
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
                  pattern: /^\d+;\d+;\d+;\d+;$/,
                  message: formatMessage(craftPageMessages.text.boxModelInputWarning),
                },
              ]}
            >
              <CraftBoxModelInput />
            </Form.Item>
            <Form.Item
              name="margin"
              label={formatMessage(craftPageMessages.label.borderSpacing)}
              rules={[
                {
                  required: true,
                  pattern: /^\d+;\d+;\d+;\d+;$/,
                  message: formatMessage(craftPageMessages.text.boxModelInputWarning),
                },
              ]}
            >
              <CraftBoxModelInput />
            </Form.Item>
          </StyledCollapsePanel>
        </Collapse>
      )}
      <Form.Item name="titleContent">
        <CraftTitleContentBlock />
      </Form.Item>
      <Form.Item name="titleStyle">
        <CraftTextStyleBlock type="title" title={formatMessage(craftPageMessages.label.titleStyle)} />
      </Form.Item>
      <Form.Item name="paragraphContent">
        <CraftTitleContentBlock />
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

CraftStatistics.craft = {
  related: {
    settings: StatisticsSettings,
  },
}

export default CraftStatistics