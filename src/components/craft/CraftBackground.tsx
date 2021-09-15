import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { Button, Collapse, Radio } from 'antd'
import Form from 'antd/lib/form/'
import { useForm } from 'antd/lib/form/Form'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import { useApp } from '../../contexts/AppContext'
import { useAuth } from '../../contexts/AuthContext'
import { handleError, uploadFile } from '../../helpers/index'
import { commonMessages, craftPageMessages } from '../../helpers/translation'
import { CraftMarginProps, CraftPaddingProps } from '../../types/craft'
import BackgroundSection from '../BackgroundSection'
import { AdminHeaderTitle, CraftSelectedMixin, StyledCollapsePanel } from '../common'
import ImageUploader from '../common/ImageUploader'
import CraftBoxModelInput, { formatBoxModelValue } from './CraftBoxModelInput'
import CraftColorPickerBlock from './CraftColorPickerBlock'

const StyledSection = styled(BackgroundSection)<{ enabled?: boolean; selected?: boolean }>`
  && {
    ${props => props.enabled && `cursor: pointer;`}
    ${props => props.selected && CraftSelectedMixin}
  }
`

type CraftBackgroundProps = {
  backgroundType: 'none' | 'solidColor' | 'backgroundImage'
  solidColor?: string
  coverUrl?: string
  margin: CraftMarginProps
  padding: CraftPaddingProps
}

type FieldProps = Pick<CraftBackgroundProps, 'backgroundType' | 'solidColor' | 'coverUrl'> & {
  margin: string
  padding: string
}

const CraftBackground: UserComponent<CraftBackgroundProps> = ({
  backgroundType,
  solidColor,
  margin,
  padding,
  coverUrl,
  children,
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
    <StyledSection
      ref={ref => ref && connect(drag(ref))}
      customStyle={{
        mt: margin.mt,
        mr: margin.mr,
        mb: margin.mb,
        ml: margin.ml,
        pt: padding.pt,
        pr: padding.pr,
        pb: padding.pb,
        pl: padding.pl,
        backgroundImage: backgroundType === 'backgroundImage' ? coverUrl : undefined,
        backgroundColor: backgroundType === 'solidColor' ? solidColor : undefined,
      }}
      enabled={enabled}
      selected={selected}
    >
      {children}
    </StyledSection>
  )
}

const BackgroundSettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { authToken } = useAuth()
  const { id: appId } = useApp()
  const [form] = useForm<FieldProps>()
  const {
    actions: { setProp },
    props,
    selected,
  } = useNode(node => ({
    props: node.data.props as CraftBackgroundProps,
    selected: node.events.selected,
  }))

  const [loading, setLoading] = useState(false)
  const [isImageUploaded, setIsImageUploaded] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null)

  const handleChange = () => {
    form
      .validateFields()
      .then(values => {
        const margin = formatBoxModelValue(values.margin)
        const padding = formatBoxModelValue(values.padding)

        setProp(props => {
          props.backgroundType = values.backgroundType
          props.solidColor = values.solidColor
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
    if (backgroundImage) {
      const uniqId = uuid()
      setLoading(true)
      uploadFile(`images/${appId}/craft/${uniqId}`, backgroundImage, authToken)
        .then(() => {
          setProp(props => {
            props.coverUrl = `https://${process.env.REACT_APP_S3_BUCKET}/images/${appId}/craft/${uniqId}${
              backgroundImage.type.startsWith('image') ? '/1200' : ''
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
        backgroundType: props.backgroundType || 'none',
        solidColor: props.solidColor || '#cccccc',
        backgroundImage: props.coverUrl || '',
        margin: `${props.margin?.mt || 0};${props.margin?.mr || 0};${props.margin?.mb || 0};${props.margin?.ml || 0}`,
        padding: `${props.padding?.pt || 0};${props.padding?.pr || 0};${props.padding?.pb || 0};${
          props.padding?.pl || 0
        }`,
      }}
      onValuesChange={handleChange}
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
          header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.blockSetting)}</AdminHeaderTitle>}
        >
          <Form.Item name="backgroundType" label={formatMessage(craftPageMessages.label.background)}>
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="none">{formatMessage(craftPageMessages.ui.empty)}</Radio.Button>
              <Radio.Button value="solidColor">{formatMessage(craftPageMessages.ui.solidColor)}</Radio.Button>
              <Radio.Button value="backgroundImage">{formatMessage(craftPageMessages.ui.image)}</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="solidColor" noStyle={props.backgroundType !== 'solidColor'}>
            {props.backgroundType === 'solidColor' && <CraftColorPickerBlock />}
          </Form.Item>

          <Form.Item name="backgroundImage" noStyle={props.backgroundType !== 'backgroundImage'}>
            {props.backgroundType === 'backgroundImage' && (
              <div className="d-flex align-items-center">
                <ImageUploader
                  file={backgroundImage}
                  initialCoverUrl={props.coverUrl}
                  onChange={file => {
                    setIsImageUploaded(false)
                    setBackgroundImage(file)
                  }}
                />
                {selected && backgroundImage && !isImageUploaded && (
                  <Button loading={loading} className="ml-3 mb-3" type="primary" onClick={handleImageUpload}>
                    {formatMessage(commonMessages.ui.upload)}
                  </Button>
                )}
              </div>
            )}
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
            <CraftBoxModelInput onChange={handleChange} />
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
            <CraftBoxModelInput onChange={handleChange} />
          </Form.Item>
        </StyledCollapsePanel>
      </Collapse>
    </Form>
  )
}

CraftBackground.craft = {
  related: {
    settings: BackgroundSettings,
  },
  custom: {
    button: {
      label: 'deleteAllBlock',
    },
  },
}

export default CraftBackground
