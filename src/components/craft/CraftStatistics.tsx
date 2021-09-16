import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { Button, Collapse, Form, Radio } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { v4 as uuid } from 'uuid'
import { useApp } from '../../contexts/AppContext'
import { useAuth } from '../../contexts/AuthContext'
import { handleError, uploadFile } from '../../helpers/index'
import { commonMessages, craftPageMessages } from '../../helpers/translation'
import {
  CraftBoxModelProps,
  CraftImageProps,
  CraftParagraphProps,
  CraftTextStyleProps,
  CraftTitleProps,
} from '../../types/craft'
import { MarginProps, PaddingProps } from '../../types/style'
import {
  AdminHeaderTitle,
  CraftHoveredMixin,
  CraftSelectedMixin,
  generateCustomMarginStyle,
  generateCustomPaddingStyle,
  StyledCollapsePanel,
  StyledSettingButtonWrapper,
} from '../common'
import ImageUploader from '../common/ImageUploader'
import Stat from '../Stat'
import CraftBoxModelInput, { formatBoxModelValue } from './CraftBoxModelInput'
import CraftParagraphContentBlock from './CraftParagraphContentBlock'
import CraftTextStyleBlock from './CraftTextStyleBlock'
import CraftTitleContentBlock from './CraftTitleContentBlock'

const StatisticsWrapper = styled.div<{
  customStyle: MarginProps & PaddingProps
  craftEvents?: {
    hovered?: boolean
    selected?: boolean
  }
}>`
  ${props =>
    css`
      cursor: pointer;
      ${props?.craftEvents?.hovered && CraftHoveredMixin}
      ${props?.craftEvents?.selected && CraftSelectedMixin}
    `}
  width: fit-content;
  text-align: center;
  ${generateCustomMarginStyle}
  ${generateCustomPaddingStyle}
`

type CraftStatisticsProps = CraftImageProps &
  CraftBoxModelProps & { title: CraftTitleProps; paragraph: CraftParagraphProps }

type FieldProps = {
  type: string
  padding: string
  margin: string
  titleContent: string
  titleStyle: Pick<CraftTextStyleProps, 'fontSize' | 'textAlign' | 'fontWeight' | 'color'> & {
    margin: string
  }
  paragraphContent: string
  paragraphStyle: Pick<CraftTextStyleProps, 'fontSize' | 'lineHeight' | 'textAlign' | 'fontWeight' | 'color'> & {
    margin: string
  }
}

const CraftStatistics: UserComponent<CraftStatisticsProps> = ({ title, paragraph, padding, margin, coverUrl }) => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const {
    connectors: { connect, drag },
    selected,
    hovered,
  } = useNode(node => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
  }))

  return (
    <StatisticsWrapper
      ref={ref => ref && connect(drag(ref))}
      customStyle={{
        ...padding,
        ...margin,
      }}
      craftEvents={enabled ? { hovered, selected } : {}}
    >
      <Stat.Image
        style={{
          display: 'inline-block',
        }}
        src={coverUrl}
        customStyle={{
          mt: '0',
          mb: '24',
          mr: '0',
          ml: '0',
          pt: '0',
          pb: '0',
          pr: '0',
          pl: '0',
        }}
      />
      <Stat.Digit
        customStyle={{
          textAlign: title.textAlign || 'center',
          fontSize: title.fontSize || '20',
          fontWeight: title.fontWeight || 'normal',
          color: title.color || '#585858',
          mb: '16',
          ...title.margin,
        }}
      >
        {title.titleContent}
      </Stat.Digit>
      <Stat.Content
        customStyle={{
          textAlign: paragraph.textAlign || 'center',
          fontSize: paragraph.fontSize || '20',
          fontWeight: paragraph.fontWeight || 'normal',
          lineHeight: paragraph.lineHeight || 1,
          color: paragraph.color || '#585858',
          ...paragraph.margin,
        }}
      >
        {paragraph.paragraphContent}
      </Stat.Content>
    </StatisticsWrapper>
  )
}

const StatisticsSettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [loading, setLoading] = useState(false)
  const { authToken } = useAuth()
  const { id: appId } = useApp()
  const [form] = useForm<FieldProps>()

  const {
    actions: { setProp },
    props,
    selected,
  } = useNode(node => ({
    props: node.data.props as CraftBoxModelProps & CraftStatisticsProps,
    selected: node.events.selected,
  }))
  const [isImageUploaded, setIsImageUploaded] = useState(false)
  const [coverImage, setCoverImage] = useState<File | null>(null)

  const handleChange = () => {
    form
      .validateFields()
      .then(values => {
        const padding = formatBoxModelValue(values.padding)
        const margin = formatBoxModelValue(values.margin)
        const titleMargin = formatBoxModelValue(values.titleStyle.margin)
        const paragraphMargin = formatBoxModelValue(values.paragraphStyle.margin)

        setProp(props => {
          props.type = values.type
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
            margin: {
              mt: titleMargin?.[0] || '0',
              mr: titleMargin?.[1] || '0',
              mb: titleMargin?.[2] || '0',
              ml: titleMargin?.[3] || '0',
            },
            textAlign: values.titleStyle.textAlign,
            fontWeight: values.titleStyle.fontWeight,
            color: values.titleStyle.color,
          }
          props.paragraph = {
            paragraphContent: values.paragraphContent,
            fontSize: values.paragraphStyle.fontSize,
            margin: {
              mt: paragraphMargin?.[0] || '0',
              mr: paragraphMargin?.[1] || '0',
              mb: paragraphMargin?.[2] || '0',
              ml: paragraphMargin?.[3] || '0',
            },
            textAlign: values.paragraphStyle.textAlign,
            fontWeight: values.paragraphStyle.fontWeight,
            color: values.paragraphStyle.color,
          }
        })
      })
      .catch(() => {})
  }

  const handleImageUpload = () => {
    if (coverImage) {
      const uniqId = uuid()
      setLoading(true)
      uploadFile(`images/${appId}/craft/${uniqId}`, coverImage, authToken)
        .then(() => {
          setProp(props => {
            props.coverUrl = `https://${process.env.REACT_APP_S3_BUCKET}/images/${appId}/craft/${uniqId}${
              coverImage.type.startsWith('image') ? '/100' : ''
            }`
          })
          setIsImageUploaded(true)
        })
        .catch(handleError)
        .finally(() => setLoading(false))
    }
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
          lineHeight: props.paragraph.lineHeight || 1,
          margin: `${props.paragraph.margin?.mt || 0};${props.paragraph.margin?.mr || 0};${
            props.paragraph.margin?.mb || 0
          };${props.paragraph.margin?.ml || 0}`,
          textAlign: props.paragraph.textAlign || 'left',
          fontWeight: props.paragraph.fontWeight || 'normal',
          color: props.paragraph.color || '#585858',
        },
      }}
      onChange={handleChange}
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
              <Radio.Button value="empty">{formatMessage(craftPageMessages.ui.empty)}</Radio.Button>
              <Radio.Button value="image">{formatMessage(craftPageMessages.ui.image)}</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {props.type === 'image' && (
            <Form.Item name="coverImage">
              <ImageUploader
                file={coverImage}
                initialCoverUrl={props.coverUrl}
                onChange={file => {
                  setIsImageUploaded(false)
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
              name="margin"
              label={formatMessage(craftPageMessages.label.margin)}
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
            <Form.Item
              name="padding"
              label={formatMessage(craftPageMessages.label.padding)}
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
      )}
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
      {selected && coverImage && !isImageUploaded && (
        <StyledSettingButtonWrapper>
          <Button loading={loading} className="mb-3" type="primary" block onClick={handleImageUpload}>
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
