import { useNode, UserComponent } from '@craftjs/core'
import { Button, Collapse, Radio } from 'antd'
import Form from 'antd/lib/form/'
import { useForm } from 'antd/lib/form/Form'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuid } from 'uuid'
import { useApp } from '../../contexts/AppContext'
import { useAuth } from '../../contexts/AuthContext'
import { uploadFile } from '../../helpers/index'
import { commonMessages, craftPageMessages } from '../../helpers/translation'
import { CraftMarginProps, CraftPaddingProps } from '../../types/craft'
import StyledSection from '../BackgroundSection'
import { AdminHeaderTitle, StyledCollapsePanel, StyledSettingButtonWrapper } from '../common'
import ImageUploader from '../common/ImageUploader'
import CraftBoxModelInput, { formatBoxModelValue } from './CraftBoxModelInput'
import CraftColorPickerBlock from './CraftColorPickerBlock'

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
  const {
    connectors: { connect, drag },
  } = useNode()

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
      style={{ cursor: 'pointer' }}
    >
      {children}
    </StyledSection>
  )
}

const BackgroundSettings: React.VFC = () => {
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
    props: node.data.props as CraftBackgroundProps,
    selected: node.events.selected,
  }))
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null)

  const handleSubmit = (values: FieldProps) => {
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
        })
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
          header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.blockSetting)}</AdminHeaderTitle>}
        >
          <Form.Item name="backgroundType" label={formatMessage(craftPageMessages.label.background)}>
            <Radio.Group buttonStyle="solid">
              <Radio.Button
                value="none"
                onChange={() =>
                  setProp((props: FieldProps) => {
                    props.backgroundType = 'none'
                  })
                }
              >
                {formatMessage(craftPageMessages.ui.empty)}
              </Radio.Button>
              <Radio.Button
                value="solidColor"
                onChange={() =>
                  setProp((props: FieldProps) => {
                    props.backgroundType = 'solidColor'
                  })
                }
              >
                {formatMessage(craftPageMessages.ui.solidColor)}
              </Radio.Button>
              <Radio.Button
                value="backgroundImage"
                onChange={() =>
                  setProp((props: FieldProps) => {
                    props.backgroundType = 'backgroundImage'
                  })
                }
              >
                {formatMessage(craftPageMessages.ui.image)}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {props.backgroundType === 'solidColor' && (
            <Form.Item name="solidColor">
              <CraftColorPickerBlock />
            </Form.Item>
          )}

          {props.backgroundType === 'backgroundImage' && (
            <Form.Item name="backgroundImage">
              <ImageUploader
                file={backgroundImage}
                initialCoverUrl={props.coverUrl}
                onChange={file => {
                  setBackgroundImage(file)
                }}
              />
            </Form.Item>
          )}
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
