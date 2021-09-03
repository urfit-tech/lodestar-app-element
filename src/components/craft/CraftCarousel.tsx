import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { Button, Checkbox, Collapse, Form, Input } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { Fragment, useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import Carousel from '../../components/Carousel'
import { useApp } from '../../contexts/AppContext'
import { useAuth } from '../../contexts/AuthContext'
import { handleError, uploadFile } from '../../helpers/index'
import { commonMessages, craftPageMessages } from '../../helpers/translation'
import { ReactComponent as PlusIcon } from '../../images/icons/plus.svg'
import { ReactComponent as TrashOIcon } from '../../images/icons/trash-o.svg'
import { CraftTextStyleProps } from '../../types/craft'
import {
  AdminHeaderTitle,
  StyledCollapsePanel,
  StyledCraftSettingLabel,
  StyledSettingButtonWrapper,
  StyledUnderLineInput,
} from '../common'
import ImageUploader from '../common/ImageUploader'
import { formatBoxModelValue } from './CraftBoxModelInput'
import CraftTextStyleBlock from './CraftTextStyleBlock'

const StyledDeleteButton = styled(Button)`
  width: 25px;
  height: 25px;
  svg {
    font-size: 16px;
  }
`
const StyledAddButton = styled(Button)`
  width: 25px;
  height: 25px;
  svg {
    font-size: 16px;
  }
`
const StyledLinkFormItem = styled(Form.Item)`
  .ant-form-item-label {
    padding-bottom: 0px;
  }
`

type FieldProps = {
  type: 'normal' | 'simply'
  covers: {
    title?: string
    paragraph?: string
    desktopCoverUrl: string
    mobileCoverUrl: string
    link: string
    openNewTab: boolean
  }[]
  titleStyle?: Pick<CraftTextStyleProps, 'fontSize' | 'textAlign' | 'fontWeight' | 'color'> & {
    margin: string
  }
  paragraphStyle?: Pick<CraftTextStyleProps, 'fontSize' | 'lineHeight' | 'textAlign' | 'fontWeight' | 'color'> & {
    margin: string
  }
}

type CraftCarouselProps = {
  type: 'normal' | 'simply'
  covers: {
    title?: string
    paragraph?: string
    desktopCoverUrl: string
    mobileCoverUrl: string
    link: string
    openNewTab: boolean
  }[]
  titleStyle?: CraftTextStyleProps
  paragraphStyle?: CraftTextStyleProps
}

const CraftCarousel: UserComponent<CraftCarouselProps> = ({ type, covers, titleStyle, paragraphStyle, children }) => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const {
    connectors: { connect, drag },
  } = useNode()
  const history = useHistory()

  return (
    <div ref={ref => ref && connect(drag(ref))} style={{ cursor: 'pointer' }}>
      <Carousel dots infinite arrows={false} autoplay autoplaySpeed={5000} variant="cover">
        {covers.map(cover => (
          <Carousel.Slide
            key={cover.title}
            srcDesktop={cover.desktopCoverUrl}
            srcMobile={cover.mobileCoverUrl}
            title={cover.title}
            subtitle={cover.paragraph}
            onClick={() => {
              if (enabled || !cover.link) {
                return
              }
              cover.openNewTab
                ? window.open(cover.link)
                : cover.link.includes('http')
                ? window.location.assign(cover.link)
                : history.push(cover.link)
            }}
            customStyle={
              type === 'normal'
                ? {
                    title: {
                      fontSize: titleStyle?.fontSize || '',
                      textAlign: titleStyle?.textAlign || 'center',
                      fontWeight: titleStyle?.fontWeight || 'bold',
                      color: titleStyle?.color || '',
                      mt: titleStyle?.margin.mt || '',
                      mr: titleStyle?.margin.mr || '',
                      mb: titleStyle?.margin.mb || '',
                      ml: titleStyle?.margin.ml || '',
                    },
                    paragraph: {
                      fontSize: paragraphStyle?.fontSize || '',
                      textAlign: paragraphStyle?.textAlign || 'center',
                      fontWeight: paragraphStyle?.fontWeight || 'normal',
                      color: paragraphStyle?.color || '',
                      lineHeight: paragraphStyle?.lineHeight || 1,
                      mt: paragraphStyle?.margin.mt || '',
                      mr: paragraphStyle?.margin.mr || '',
                      mb: paragraphStyle?.margin.mb || '',
                      ml: paragraphStyle?.margin.ml || '',
                    },
                  }
                : {}
            }
          />
        ))}
      </Carousel>
    </div>
  )
}

const CarouselSettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [loading, setLoading] = useState(false)
  const [form] = useForm<FieldProps>()
  const { authToken } = useAuth()
  const { id: appId } = useApp()

  const {
    actions: { setProp },
    props,
    selected,
  } = useNode(node => ({
    props: node.data.props as CraftCarouselProps,
    selected: node.events.selected,
  }))

  const [desktopCover, setDesktopCover] = useState<File[]>([])
  const [mobileCover, setMobileCover] = useState<File[]>([])

  const handleAsyncSubmit = async (values: FieldProps) => {
    const titleMargin = formatBoxModelValue(values.titleStyle?.margin)
    const paragraphMargin = formatBoxModelValue(values.paragraphStyle?.margin)

    setProp(props => {
      props.covers = values.covers
      props.titleStyle = {
        fontSize: values.titleStyle?.fontSize,
        margin: {
          mt: titleMargin?.[0] || '0',
          mr: titleMargin?.[1] || '0',
          mb: titleMargin?.[2] || '0',
          ml: titleMargin?.[3] || '0',
        },
        textAlign: values.titleStyle?.textAlign,
        fontWeight: values.titleStyle?.fontWeight,
        color: values.titleStyle?.color,
      }
      props.paragraphStyle = {
        fontSize: values.paragraphStyle?.fontSize,
        lineHeight: values.paragraphStyle?.lineHeight,
        margin: {
          mt: paragraphMargin?.[0] || '0',
          mr: paragraphMargin?.[1] || '0',
          mb: paragraphMargin?.[2] || '0',
          ml: paragraphMargin?.[3] || '0',
        },
        textAlign: values.paragraphStyle?.textAlign,
        fontWeight: values.paragraphStyle?.fontWeight,
        color: values.paragraphStyle?.color,
      }
    })

    if (desktopCover.length || mobileCover.length) {
      setLoading(true)
      try {
        for (let i = 0; i < desktopCover.length; i++) {
          const file = desktopCover[i]
          if (!file) {
            continue
          }
          const uniqId = uuid()

          await uploadFile(`images/${appId}/craft/${uniqId}`, file, authToken)
          setProp(props => {
            props.covers[i].desktopCoverUrl = `https://${
              process.env.REACT_APP_S3_BUCKET
            }/images/${appId}/craft/${uniqId}${file.type.startsWith('image') ? '/1200' : ''}`
          })
        }
        for (let i = 0; i < mobileCover.length; i++) {
          const file = mobileCover[i]
          if (!file) {
            continue
          }
          const uniqId = uuid()

          await uploadFile(`images/${appId}/craft/${uniqId}`, file, authToken)
          setProp(props => {
            props.covers[i].mobileCoverUrl = `https://${
              process.env.REACT_APP_S3_BUCKET
            }/images/${appId}/craft/${uniqId}${file.type.startsWith('image') ? '/1200' : ''}`
          })
        }
      } catch (error) {
        handleError(error)
      }
      setLoading(false)
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        covers: props.covers.map(cover => ({
          title: cover.title || '',
          paragraph: cover.paragraph || '',
          desktopCoverUrl: cover.desktopCoverUrl || '',
          mobileCoverUrl: cover.mobileCoverUrl || '',
          link: cover.link || '',
          openNewTab: cover.openNewTab || false,
        })),
        titleStyle: {
          fontSize: props.titleStyle?.fontSize || 16,
          margin: `${props.titleStyle?.margin?.mt || 0};${props.titleStyle?.margin?.mr || 0};${
            props.titleStyle?.margin?.mb || 0
          };${props.titleStyle?.margin?.ml || 0}`,
          textAlign: props.titleStyle?.textAlign || 'center',
          fontWeight: props.titleStyle?.fontWeight || 'bold',
          color: props.titleStyle?.color || '#585858',
        },
        paragraphStyle: {
          fontSize: props.paragraphStyle?.fontSize || 16,
          margin: `${props.paragraphStyle?.margin?.mt || 0};${props.paragraphStyle?.margin?.mr || 0};${
            props.paragraphStyle?.margin?.mb || 0
          };${props.paragraphStyle?.margin?.ml || 0}`,
          lineHeight: props.paragraphStyle?.lineHeight || 1,
          textAlign: props.paragraphStyle?.textAlign || 'center',
          fontWeight: props.paragraphStyle?.fontWeight || 'bold',
          color: props.paragraphStyle?.color || '#585858',
        },
      }}
      colon={false}
      onFinish={handleAsyncSubmit}
    >
      <Form.List name="covers">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Fragment key={field.fieldKey}>
                <Collapse
                  className="mt-2 p-0"
                  bordered={false}
                  expandIconPosition="right"
                  ghost
                  defaultActiveKey={['carousel']}
                >
                  <StyledCollapsePanel
                    key="carousel"
                    header={
                      <div className="d-flex">
                        <AdminHeaderTitle>{formatMessage(craftPageMessages.label.carouselSetting)}</AdminHeaderTitle>
                        <StyledAddButton type="link" icon={<PlusIcon />} className="p-0 mr-1" onClick={() => add()} />
                        <StyledDeleteButton
                          type="link"
                          icon={<TrashOIcon />}
                          className="p-0"
                          onClick={() => remove(field.name)}
                        />
                      </div>
                    }
                  >
                    {props.type === 'normal' && (
                      <>
                        <Form.Item
                          className="mb-3"
                          name={[field.name, 'title']}
                          fieldKey={[field.fieldKey, 'title']}
                          label={
                            <StyledCraftSettingLabel>
                              {formatMessage(craftPageMessages.label.title)}
                            </StyledCraftSettingLabel>
                          }
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          className="mb-3"
                          name={[field.name, 'paragraph']}
                          fieldKey={[field.fieldKey, 'paragraph']}
                          label={
                            <StyledCraftSettingLabel>
                              {formatMessage(craftPageMessages.label.content)}
                            </StyledCraftSettingLabel>
                          }
                        >
                          <Input.TextArea rows={5} />
                        </Form.Item>
                      </>
                    )}

                    <Form.Item
                      className="mb-3"
                      name={[field.name, 'desktopCover']}
                      fieldKey={[field.fieldKey, 'desktopCover']}
                      label={
                        <StyledCraftSettingLabel>
                          {formatMessage(craftPageMessages.label.desktopDisplay)}
                        </StyledCraftSettingLabel>
                      }
                    >
                      <ImageUploader
                        file={desktopCover ? desktopCover[index] : null}
                        initialCoverUrl={props.covers[index]?.desktopCoverUrl || ''}
                        onChange={file => {
                          setDesktopCover(cover => {
                            const coverClone = cover.slice()
                            coverClone[index] = file
                            return coverClone
                          })
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      className="mb-3"
                      name={[field.name, 'mobileCover']}
                      fieldKey={[field.fieldKey, 'mobileCover']}
                      label={
                        <StyledCraftSettingLabel>
                          {formatMessage(craftPageMessages.label.mobileDisplay)}
                        </StyledCraftSettingLabel>
                      }
                    >
                      <ImageUploader
                        file={mobileCover ? mobileCover[index] : null}
                        initialCoverUrl={props.covers[index]?.mobileCoverUrl || ''}
                        onChange={file => {
                          setMobileCover(cover => {
                            const coverClone = cover.slice()
                            coverClone[index] = file
                            return coverClone
                          })
                        }}
                      />
                    </Form.Item>

                    <StyledLinkFormItem
                      className="mb-2"
                      name={[field.name, 'link']}
                      fieldKey={[field.fieldKey, 'link']}
                      label={
                        <StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.link)}</StyledCraftSettingLabel>
                      }
                    >
                      <StyledUnderLineInput placeholder="https://" />
                    </StyledLinkFormItem>

                    <Form.Item
                      className="mb-1"
                      name={[field.name, 'openNewTab']}
                      fieldKey={[field.fieldKey, 'openNewTab']}
                      valuePropName="checked"
                    >
                      <Checkbox>{formatMessage(craftPageMessages.label.openNewTab)}</Checkbox>
                    </Form.Item>
                  </StyledCollapsePanel>
                </Collapse>
              </Fragment>
            ))}
          </>
        )}
      </Form.List>
      {props.type === 'normal' && (
        <>
          <Form.Item name="titleStyle">
            <CraftTextStyleBlock type="title" title={formatMessage(craftPageMessages.label.titleStyle)} />
          </Form.Item>
          <Form.Item name="paragraphStyle">
            <CraftTextStyleBlock type="paragraph" title={formatMessage(craftPageMessages.label.paragraphStyle)} />
          </Form.Item>
        </>
      )}
      {selected && (
        <StyledSettingButtonWrapper>
          <Button loading={loading} className="mb-3" type="primary" htmlType="submit" block>
            {formatMessage(commonMessages.ui.save)}
          </Button>
        </StyledSettingButtonWrapper>
      )}
    </Form>
  )
}

CraftCarousel.craft = {
  related: {
    settings: CarouselSettings,
  },
  custom: {
    button: {
      label: 'deleteAllBlock',
    },
  },
}

export default CraftCarousel
