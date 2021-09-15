import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { Button, Collapse } from 'antd'
import Form from 'antd/lib/form/'
import { useForm } from 'antd/lib/form/Form'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuid } from 'uuid'
import StyledImage from '../../components/Image'
import { useApp } from '../../contexts/AppContext'
import { useAuth } from '../../contexts/AuthContext'
import { handleError, uploadFile } from '../../helpers/index'
import { commonMessages, craftPageMessages } from '../../helpers/translation'
import { CraftBoxModelProps, CraftImageProps } from '../../types/craft'
import { AdminHeaderTitle, CraftRefBlock, StyledCollapsePanel, StyledSettingButtonWrapper } from '../common'
import ImageUploader from '../common/ImageUploader'
import CraftBoxModelInput, { formatBoxModelValue } from './CraftBoxModelInput'

type FieldProps = CraftImageProps & { margin: string; padding: string }

const CraftImage: UserComponent<CraftImageProps & CraftBoxModelProps & { coverUrl: string }> = ({
  coverUrl,
  width,
  margin,
  padding,
}) => {
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
    <CraftRefBlock ref={ref => ref && connect(drag(ref))} hovered={hovered} enabled={enabled} selected={selected}>
      <StyledImage
        customStyle={{
          width,
          mt: margin?.mt,
          mr: margin?.mr,
          mb: margin?.mb,
          ml: margin?.ml,
          pt: padding?.pt,
          pr: padding?.pr,
          pb: padding?.pb,
          pl: padding?.pl,
        }}
        src={coverUrl}
      />
    </CraftRefBlock>
  )
}

const ImageSettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [form] = useForm<FieldProps>()
  const { authToken } = useAuth()
  const { id: appId } = useApp()
  const {
    actions: { setProp },
    props,
    selected,
  } = useNode(node => ({
    props: node.data.props as CraftImageProps & CraftBoxModelProps,
    selected: node.events.selected,
  }))
  const [loading, setLoading] = useState(false)
  const [isImageUploaded, setIsImageUploaded] = useState(false)
  const [coverImage, setCoverImage] = useState<File | null>(null)

  const handleChange = () => {
    form
      .validateFields()
      .then(values => {
        const margin = formatBoxModelValue(values.margin)
        const padding = formatBoxModelValue(values.padding)

        setProp(props => {
          props.margin = {
            mt: margin?.[0] || '0',
            mr: margin?.[1] || '0',
            mb: margin?.[2] || '0',
            ml: margin?.[3] || '0',
          }
          props.padding = {
            pt: padding?.[0] || '0',
            pr: padding?.[1] || '0',
            pb: padding?.[2] || '0',
            pl: padding?.[3] || '0',
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
              coverImage.type.startsWith('image') ? '/1200' : ''
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
        coverImage: props.coverUrl,
        margin: `${props.margin?.mt || 0};${props.margin?.mr || 0};${props.margin?.mb || 0};${props.margin?.ml || 0}`,
        padding: `${props.padding?.pt || 0};${props.padding?.pr || 0};${props.padding?.pb || 0};${
          props.padding?.pl || 0
        }`,
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
        </StyledCollapsePanel>
      </Collapse>
      <Collapse className="mt-2 p-0" bordered={false} expandIconPosition="right" ghost defaultActiveKey={['container']}>
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

CraftImage.craft = {
  related: {
    settings: ImageSettings,
  },
  custom: {
    button: {
      label: 'deleteBlock',
    },
  },
}

export default CraftImage
