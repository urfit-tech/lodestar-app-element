import { useNode, UserComponent } from '@craftjs/core'
import { Button, Collapse, Form, Input, Radio, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import { useApp } from '../../contexts/AppContext'
import { useAuth } from '../../contexts/AuthContext'
import { uploadFile } from '../../helpers/index'
import { commonMessages, craftPageMessages } from '../../helpers/translation'
import { CraftMarginProps, CraftPaddingProps, CraftTextStyleProps } from '../../types/craft'
import Card from '../Card'
import { AdminHeaderTitle, StyledCollapsePanel, StyledSettingButtonWrapper } from '../common'
import ImageUploader from '../common/ImageUploader'
import CraftBoxModelInput, { formatBoxModelValue } from './CraftBoxModelInput'
import CraftColorPickerBlock from './CraftColorPickerBlock'
import CraftParagraphContentBlock from './CraftParagraphContentBlock'
import CraftTextStyleBlock from './CraftTextStyleBlock'
import CraftTitleContentBlock from './CraftTitleContentBlock'

const StyledTriangle = styled.div`
  position: absolute;
  bottom: -49px;
  left: 0;
  width: 20%;
  height: 50px;
  clip-path: polygon(31% 0, 0 0, 0 38%);
  background-color: inherit;
  border-color: inherit;
  border: inherit;
`

type CraftCardProps = {
  type: 'feature' | 'featureWithParagraph' | 'referrer' | 'referrerReverse'
  imageType: 'none' | 'image'
  imageUrl: string
  imageMargin?: CraftMarginProps
  imagePadding?: CraftPaddingProps
  title: string
  titleStyle: CraftTextStyleProps
  paragraph?: string
  paragraphStyle?: CraftTextStyleProps
  cardMargin: CraftMarginProps
  cardPadding: CraftPaddingProps
  variant: 'backgroundColor' | 'outline' | 'none'
  outlineColor?: string
  backgroundType?: 'none' | 'solidColor' | 'backgroundImage'
  solidColor?: string
  backgroundImageUrl?: string
  avatarType?: 'none' | 'image'
  avatarImageUrl?: string
  avatarName?: string
  flexDirection?: 'row' | 'column'
}

type FieldProps = Pick<
  CraftCardProps,
  | 'imageType'
  | 'imageUrl'
  | 'title'
  | 'paragraph'
  | 'variant'
  | 'outlineColor'
  | 'backgroundType'
  | 'solidColor'
  | 'backgroundImageUrl'
  | 'avatarType'
  | 'avatarImageUrl'
  | 'avatarName'
> & {
  imageMargin?: string
  imagePadding?: string
  titleStyle: Pick<CraftTextStyleProps, 'fontSize' | 'textAlign' | 'fontWeight' | 'color'> & {
    margin: string
  }
  paragraphStyle?: Pick<CraftTextStyleProps, 'fontSize' | 'lineHeight' | 'textAlign' | 'fontWeight' | 'color'> & {
    margin: string
  }
  cardMargin: string
  cardPadding: string
}

const CraftCard: UserComponent<CraftCardProps> = ({
  type,
  imageType,
  imageUrl,
  imageMargin,
  imagePadding,
  cardMargin,
  cardPadding,
  variant,
  outlineColor,
  backgroundType,
  solidColor,
  backgroundImageUrl,
  avatarType,
  avatarImageUrl,
  avatarName,
  title,
  titleStyle,
  paragraph,
  paragraphStyle,
  flexDirection,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <div
      ref={ref => ref && connect(drag(ref))}
      style={{ cursor: 'pointer', padding: type === 'referrer' ? '10px' : undefined }}
    >
      <Card
        customStyle={{
          direction: flexDirection || 'column',
          bordered: variant === 'outline',
          borderColor: outlineColor,
          shadow: variant !== 'none',
          backgroundColor: backgroundType === 'solidColor' ? solidColor : undefined,
          backgroundImage: backgroundType === 'backgroundImage' ? backgroundImageUrl : undefined,
          ...cardMargin,
          ...cardPadding,
          ...(type === 'referrer' && variant === 'backgroundColor' && backgroundType === 'solidColor'
            ? { borderBottomLeftRadius: '0' }
            : {}),
          ...(type === 'referrer' ? { dropShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' } : {}),
        }}
      >
        {type === 'referrerReverse' && (
          <Card.Avatar
            direction="column"
            src={avatarImageUrl}
            name={avatarName}
            withAvatarImage={avatarType === 'image'}
            withName={!!avatarName}
          />
        )}
        <Card.Image
          src={imageType === 'image' ? imageUrl : undefined}
          customStyle={{
            ...imageMargin,
            ...imagePadding,
          }}
        />
        <Card.Title
          customStyle={{
            fontSize: titleStyle.fontSize || 14,
            textAlign: titleStyle.textAlign || 'center',
            fontWeight: titleStyle.fontWeight || 'normal',
            color: titleStyle.color || '#585858',
            ...(titleStyle?.margin || {}),
          }}
        >
          {title}
        </Card.Title>
        <Card.Content
          customStyle={{
            fontSize: paragraphStyle?.fontSize || 14,
            textAlign: paragraphStyle?.textAlign || 'center',
            fontWeight: paragraphStyle?.fontWeight || 'normal',
            color: paragraphStyle?.color || '#585858',
            lineHeight: paragraphStyle?.lineHeight || 1.5,
            ...(paragraphStyle?.margin || {}),
          }}
        >
          {paragraph}
        </Card.Content>
        {type === 'referrer' && variant === 'backgroundColor' && backgroundType === 'solidColor' && <StyledTriangle />}
      </Card>
      {type === 'referrer' && (
        <Card.Avatar
          src={avatarImageUrl}
          name={avatarName}
          withAvatarImage={avatarType === 'image'}
          withName={!!avatarName}
        />
      )}
    </div>
  )
}

const CardSettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { authToken } = useAuth()
  const { id: appId } = useApp()
  const [loading, setLoading] = useState(false)
  const [form] = useForm<FieldProps>()

  const {
    actions: { setProp },
    props,
    selected,
  } = useNode(node => ({
    props: node.data.props as CraftCardProps,
    selected: node.events.selected,
  }))

  const [image, setImage] = useState<File | null>(null)
  const [avatarImage, setAvatarImage] = useState<File | null>(null)
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null)

  const handleAsyncSubmit = async (values: FieldProps) => {
    const imageMargin = formatBoxModelValue(values.imageMargin)
    const imagePadding = formatBoxModelValue(values.imagePadding)
    const cardMargin = formatBoxModelValue(values.cardMargin)
    const cardPadding = formatBoxModelValue(values.cardPadding)
    const titleMargin = formatBoxModelValue(values.titleStyle?.margin)
    const paragraphMargin = formatBoxModelValue(values.paragraphStyle?.margin)

    setProp(props => {
      props.imageType = values.imageType
      props.imageMargin = {
        mt: imageMargin?.[0] || '0',
        mr: imageMargin?.[1] || '0',
        mb: imageMargin?.[2] || '0',
        ml: imageMargin?.[3] || '0',
      }
      props.imagePadding = {
        pt: imagePadding?.[0] || '0',
        pr: imagePadding?.[1] || '0',
        pb: imagePadding?.[2] || '0',
        pl: imagePadding?.[3] || '0',
      }
      props.avatarName = values.avatarName
      props.avatarType = values.avatarType
      props.cardMargin = {
        mt: cardMargin?.[0] || '0',
        mr: cardMargin?.[1] || '0',
        mb: cardMargin?.[2] || '0',
        ml: cardMargin?.[3] || '0',
      }
      props.cardPadding = {
        pt: cardPadding?.[0] || '0',
        pr: cardPadding?.[1] || '0',
        pb: cardPadding?.[2] || '0',
        pl: cardPadding?.[3] || '0',
      }
      props.variant = values.variant
      props.outlineColor = values.outlineColor
      props.solidColor = values.solidColor
      props.title = values.title
      props.titleStyle.fontSize = values.titleStyle.fontSize
      props.titleStyle.margin = {
        mt: titleMargin?.[0] || '0',
        mr: titleMargin?.[1] || '0',
        mb: titleMargin?.[2] || '0',
        ml: titleMargin?.[3] || '0',
      }
      props.titleStyle.textAlign = values.titleStyle.textAlign
      props.titleStyle.fontWeight = values.titleStyle.fontWeight
      props.titleStyle.color = values.titleStyle.color
      if (props.type !== 'feature' && props.paragraphStyle) {
        props.paragraph = values?.paragraph
        props.paragraphStyle.fontSize = values.paragraphStyle?.fontSize || 0
        props.paragraphStyle.lineHeight = values?.paragraphStyle?.lineHeight || 1
        props.paragraphStyle.margin = {
          mt: paragraphMargin?.[0] || '0',
          mr: paragraphMargin?.[1] || '0',
          mb: paragraphMargin?.[2] || '0',
          ml: paragraphMargin?.[3] || '0',
        }
        props.paragraphStyle.textAlign = values?.paragraphStyle?.textAlign || 'center'
        props.paragraphStyle.fontWeight = values?.paragraphStyle?.fontWeight || 'normal'
        props.paragraphStyle.color = values?.paragraphStyle?.color || '#585858'
      }
    })
    if (backgroundImage || image || avatarImage) {
      const backgroundImageId = uuid()
      const imageId = uuid()
      const avatarImageId = uuid()

      setLoading(true)
      backgroundImage &&
        (await uploadFile(`images/${appId}/craft/${backgroundImageId}`, backgroundImage, authToken).then(() => {
          setProp(props => {
            props.backgroundImageUrl = `https://${
              process.env.REACT_APP_S3_BUCKET
            }/images/${appId}/craft/${backgroundImageId}${backgroundImage.type.startsWith('image') ? '/300' : ''}`
          })
        }))
      image &&
        (await uploadFile(`images/${appId}/craft/${imageId}`, image, authToken).then(() => {
          setProp(props => {
            props.imageUrl = `https://${process.env.REACT_APP_S3_BUCKET}/images/${appId}/craft/${imageId}${
              image.type.startsWith('image') ? '/200' : ''
            }`
          })
        }))
      avatarImage &&
        (await uploadFile(`images/${appId}/craft/${avatarImageId}`, avatarImage, authToken).then(() => {
          setProp(props => {
            props.avatarImageUrl = `https://${process.env.REACT_APP_S3_BUCKET}/images/${appId}/craft/${avatarImageId}${
              avatarImage.type.startsWith('image') ? '/100' : ''
            }`
          })
        }))
      setLoading(false)
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      colon={false}
      requiredMark={false}
      initialValues={{
        imageType: props.imageType || 'image',
        coverImage: props.imageUrl || '',
        imageMargin: `${props.imageMargin?.mt || 0};${props.imageMargin?.mr || 0};${props.imageMargin?.mb || 0};${
          props.imageMargin?.ml || 0
        }`,
        imagePadding: `${props.imagePadding?.pt || 0};${props.imagePadding?.pr || 0};${props.imagePadding?.pb || 0};${
          props.imagePadding?.pl || 0
        }`,
        avatarType: props.avatarType || 'none',
        avatarImage: props.avatarImageUrl || '',
        avatarName: props.avatarName || '',
        cardMargin: `${props.cardMargin?.mt || 0};${props.cardMargin?.mr || 0};${props.cardMargin?.mb || 0};${
          props.cardMargin?.ml || 0
        }`,
        cardPadding: `${props.cardPadding?.pt || 0};${props.cardPadding?.pr || 0};${props.cardPadding?.pb || 0};${
          props.cardPadding?.pl || 0
        }`,
        variant: props.variant || 'none',
        outlineColor: props.outlineColor || '#585858',
        background: props.backgroundType || 'none',
        solidColor: props.solidColor || '#cccccc',
        backgroundImage: props.backgroundImageUrl || '',
        title: props.title || '',
        titleStyle: {
          fontSize: props.titleStyle.fontSize || 16,
          margin: `${props.titleStyle.margin?.mt || 0};${props.titleStyle.margin?.mr || 0};${
            props.titleStyle.margin?.mb || 0
          };${props.titleStyle.margin?.ml || 0}`,
          textAlign: props.titleStyle.textAlign || 'left',
          fontWeight: props.titleStyle.fontWeight || 'normal',
          color: props.titleStyle.color || '#585858',
        },
        paragraph: props?.paragraph || '',
        paragraphStyle: {
          fontSize: props.paragraphStyle?.fontSize || 16,
          margin: `${props.paragraphStyle?.margin?.mt || 0};${props.paragraphStyle?.margin?.mr || 0};${
            props.paragraphStyle?.margin?.mb || 0
          };${props.paragraphStyle?.margin?.ml || 0}`,
          textAlign: props.paragraphStyle?.textAlign || 'left',
          fontWeight: props.paragraphStyle?.fontWeight || 'normal',
          color: props.paragraphStyle?.color || '#585858',
          lineHeight: props.paragraphStyle?.lineHeight || 1,
        },
      }}
      onFinish={handleAsyncSubmit}
    >
      {(props.type === 'feature' || props.type === 'featureWithParagraph') && (
        <>
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
              <Form.Item name="imageType">
                <Radio.Group
                  buttonStyle="solid"
                  onChange={e => setProp((props: CraftCardProps) => (props.imageType = e.target.value))}
                >
                  <Radio.Button value="none">{formatMessage(craftPageMessages.ui.empty)}</Radio.Button>
                  <Radio.Button value="image">{formatMessage(craftPageMessages.ui.image)}</Radio.Button>
                </Radio.Group>
              </Form.Item>
              {props.imageType === 'image' && (
                <Form.Item name="image">
                  <ImageUploader
                    file={image}
                    initialCoverUrl={props?.imageUrl}
                    onChange={file => {
                      setImage(file)
                    }}
                  />
                </Form.Item>
              )}
            </StyledCollapsePanel>
          </Collapse>
          {props.imageType === 'image' && (
            <Collapse
              className="mt-2 p-0"
              bordered={false}
              expandIconPosition="right"
              ghost
              defaultActiveKey={['container']}
            >
              <StyledCollapsePanel
                key="container"
                header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.imageStyle)}</AdminHeaderTitle>}
              >
                <Form.Item
                  name="imageMargin"
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
                  name="imagePadding"
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
        </>
      )}

      {props.type === 'referrerReverse' && (
        <Collapse
          className="mt-2 p-0"
          bordered={false}
          expandIconPosition="right"
          ghost
          defaultActiveKey={['avatarSetting']}
        >
          <StyledCollapsePanel
            key="avatarSetting"
            header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.avatarSetting)}</AdminHeaderTitle>}
          >
            <Form.Item name="avatarType">
              <Radio.Group
                buttonStyle="solid"
                onChange={e => setProp((props: CraftCardProps) => (props.avatarType = e.target.value))}
              >
                <Radio.Button value="none">{formatMessage(craftPageMessages.ui.empty)}</Radio.Button>
                <Radio.Button value="image">{formatMessage(craftPageMessages.ui.image)}</Radio.Button>
              </Radio.Group>
            </Form.Item>
            {props.avatarType === 'image' && (
              <Form.Item name="avatarImageUrl">
                <ImageUploader
                  file={image}
                  initialCoverUrl={props.avatarImageUrl}
                  onChange={file => {
                    setImage(file)
                  }}
                />
              </Form.Item>
            )}
            <Form.Item name="avatarName" label={formatMessage(commonMessages.label.name)}>
              <Input />
            </Form.Item>
          </StyledCollapsePanel>
        </Collapse>
      )}
      <>
        <Form.Item name="title">
          <CraftTitleContentBlock />
        </Form.Item>
        <Form.Item name="titleStyle">
          <CraftTextStyleBlock type="title" title={formatMessage(craftPageMessages.label.titleStyle)} />
        </Form.Item>
      </>

      {(props.type === 'featureWithParagraph' || props.type === 'referrer' || props.type === 'referrerReverse') && (
        <>
          <Form.Item name="paragraph">
            <CraftParagraphContentBlock />
          </Form.Item>
          <Form.Item name="paragraphStyle">
            <CraftTextStyleBlock type="paragraph" title={formatMessage(craftPageMessages.label.paragraphStyle)} />
          </Form.Item>
        </>
      )}

      {props.type === 'referrer' && (
        <Collapse
          className="mt-2 p-0"
          bordered={false}
          expandIconPosition="right"
          ghost
          defaultActiveKey={['avatarSetting']}
        >
          <StyledCollapsePanel
            key="avatarSetting"
            header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.avatarSetting)}</AdminHeaderTitle>}
          >
            <Form.Item name="avatarType">
              <Radio.Group
                buttonStyle="solid"
                onChange={e => setProp((props: CraftCardProps) => (props.avatarType = e.target.value))}
              >
                <Radio.Button value="none">{formatMessage(craftPageMessages.ui.empty)}</Radio.Button>
                <Radio.Button value="image">{formatMessage(craftPageMessages.ui.image)}</Radio.Button>
              </Radio.Group>
            </Form.Item>
            {props.avatarType === 'image' && (
              <Form.Item name="avatarImageUrl">
                <ImageUploader
                  file={image}
                  initialCoverUrl={props.avatarImageUrl}
                  onChange={file => {
                    setAvatarImage(file)
                  }}
                />
              </Form.Item>
            )}
            <Form.Item name="avatarName" label={formatMessage(commonMessages.label.name)}>
              <Input />
            </Form.Item>
          </StyledCollapsePanel>
        </Collapse>
      )}

      <Collapse className="mt-2 p-0" bordered={false} expandIconPosition="right" ghost defaultActiveKey={['cardStyle']}>
        <StyledCollapsePanel
          key="cardStyle"
          header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.cardStyle)}</AdminHeaderTitle>}
        >
          <Form.Item
            name="cardMargin"
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
            name="cardPadding"
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

      <Form.Item name="variant" label={formatMessage(craftPageMessages.label.variant)}>
        <Radio.Group onChange={e => setProp((props: CraftCardProps) => (props.variant = e.target.value))}>
          <Space direction="vertical">
            <Radio value="none">{formatMessage(craftPageMessages.label.none)}</Radio>
            <Radio value="outline">{formatMessage(craftPageMessages.label.outline)}</Radio>
            <Radio value="backgroundColor">{formatMessage(craftPageMessages.label.backgroundColor)}</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      {props.variant === 'outline' && (
        <Form.Item name="outlineColor">
          <CraftColorPickerBlock />
        </Form.Item>
      )}

      {props.variant === 'backgroundColor' && (
        <Form.Item name="background" label={formatMessage(craftPageMessages.label.background)}>
          <Radio.Group
            buttonStyle="solid"
            onChange={e => setProp((props: CraftCardProps) => (props.backgroundType = e.target.value))}
          >
            <Radio.Button value="none">{formatMessage(craftPageMessages.ui.empty)}</Radio.Button>
            <Radio.Button value="solidColor">{formatMessage(craftPageMessages.ui.solidColor)}</Radio.Button>
            <Radio.Button value="backgroundImage">{formatMessage(craftPageMessages.ui.image)}</Radio.Button>
          </Radio.Group>
        </Form.Item>
      )}

      {props.variant === 'backgroundColor' && props.backgroundType === 'solidColor' && (
        <Form.Item name="solidColor">
          <CraftColorPickerBlock />
        </Form.Item>
      )}

      {props.variant === 'backgroundColor' && props.backgroundType === 'backgroundImage' && (
        <Form.Item name="backgroundImage">
          <ImageUploader
            file={backgroundImage}
            initialCoverUrl={props.backgroundImageUrl}
            onChange={file => {
              setBackgroundImage(file)
            }}
          />
        </Form.Item>
      )}
      {selected && (
        <StyledSettingButtonWrapper>
          <Button loading={loading} className="mb-3" type="primary" block htmlType="submit">
            {formatMessage(commonMessages.ui.save)}
          </Button>
        </StyledSettingButtonWrapper>
      )}
    </Form>
  )
}

CraftCard.craft = {
  related: {
    settings: CardSettings,
  },
  custom: {
    button: {
      label: 'deleteBlock',
    },
  },
}

export default CraftCard
