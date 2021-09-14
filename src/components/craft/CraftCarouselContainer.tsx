import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { Collapse, Form, InputNumber } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React from 'react'
import { useIntl } from 'react-intl'
import { isFragment } from 'react-is'
import styled from 'styled-components'
import Carousel from '../../components/Carousel'
import { craftPageMessages } from '../../helpers/translation'
import { CraftMarginProps } from '../../types/craft'
import { AdminHeaderTitle, CraftRefBlock, StyledCollapsePanel } from '../common'
import { BREAK_POINT } from '../Responsive'
import CraftBoxModelInput, { formatBoxModelValue } from './CraftBoxModelInput'

const StyledInputNumber = styled(InputNumber)`
  width: 100% !important;
`

type CarouselProps = {
  margin: CraftMarginProps
  dots?: boolean
  arrows?: boolean
  draggable?: boolean
  swipeToSlide?: boolean
  infinite?: boolean
  autoplay?: boolean
  speed?: number
  slidesToShow?: number
  slidesToScroll?: number
  autoplaySpeed?: number
}

type FieldProps = {
  desktop: CarouselProps
  mobile: CarouselProps
}

type CraftCarouselProps = {
  desktop: CarouselProps
  mobile: CarouselProps
}

const CraftCarouselContainer: UserComponent<CraftCarouselProps> = ({ desktop, mobile, children }) => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const {
    connectors: { connect, drag },
    selected,
  } = useNode(node => ({
    selected: node.events.selected,
  }))

  let child = children

  // validate top level dom is only one fragment
  if (React.Children.count(children) === 1 && isFragment(children)) {
    const { children: fragmentChildren } = children.props
    child = fragmentChildren
  }

  return (
    <CraftRefBlock ref={ref => ref && connect(drag(ref))} selected={selected} enabled={enabled}>
      <Carousel
        dots
        infinite
        arrows={false}
        autoplay
        autoplaySpeed={5000}
        {...desktop}
        responsive={[
          {
            breakpoint: BREAK_POINT,
            settings: mobile,
          },
        ]}
        customStyle={{
          mobile: { margin: mobile.margin },
          desktop: { margin: desktop.margin },
        }}
      >
        {child}
      </Carousel>
    </CraftRefBlock>
  )
}

const CarouselSettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [form] = useForm<FieldProps>()

  const {
    actions: { setProp },
    props,
  } = useNode(node => ({
    props: node.data.props as CraftCarouselProps,
  }))

  return (
    <Form
      form={form}
      layout="vertical"
      colon={false}
      requiredMark={false}
      initialValues={{
        desktopMargin: `${props.desktop.margin?.mt || 0};${props.desktop.margin?.mr || 0};${
          props.desktop.margin?.mb || 0
        };${props.desktop.margin?.ml || 0}`,
        desktopColumnAmount: props.desktop.slidesToShow || 1,
        desktopScrollAmount: props.desktop.slidesToScroll || 1,
        mobileMargin: `${props.mobile.margin?.mt || 0};${props.mobile.margin?.mr || 0};${
          props.mobile.margin?.mb || 0
        };${props.mobile.margin?.ml || 0}`,
        mobileColumnAmount: props.mobile.slidesToShow || 1,
        mobileScrollAmount: props.mobile.slidesToScroll || 1,
      }}
    >
      <Collapse
        className="mt-2 p-0"
        bordered={false}
        expandIconPosition="right"
        ghost
        defaultActiveKey={['desktopCarouselComponent']}
      >
        <StyledCollapsePanel
          key="desktopCarouselComponent"
          header={
            <AdminHeaderTitle>{formatMessage(craftPageMessages.label.desktopCarouselComponent)}</AdminHeaderTitle>
          }
        >
          <Form.Item name="desktopMargin" label={formatMessage(craftPageMessages.label.margin)}>
            <CraftBoxModelInput
              onChange={v => {
                const margin = formatBoxModelValue(v)
                setProp(props => {
                  props.desktop.margin = {
                    mt: margin?.[0] || '0',
                    mr: margin?.[1] || '0',
                    mb: margin?.[2] || '0',
                    ml: margin?.[3] || '0',
                  }
                })
              }}
            />
          </Form.Item>
          <Form.Item name="desktopColumnAmount" label={formatMessage(craftPageMessages.label.columnAmount)}>
            <StyledInputNumber
              min="1"
              onChange={v =>
                setProp(props => {
                  props.desktop.slidesToShow = v
                })
              }
            />
          </Form.Item>
          <Form.Item name="desktopScrollAmount" label={formatMessage(craftPageMessages.label.scrollAmount)}>
            <StyledInputNumber
              min="1"
              onChange={v =>
                setProp(props => {
                  props.desktop.slidesToScroll = v
                })
              }
            />
          </Form.Item>
        </StyledCollapsePanel>
      </Collapse>

      <Collapse
        className="mt-2 p-0"
        bordered={false}
        expandIconPosition="right"
        ghost
        defaultActiveKey={['mobileCarouselComponent']}
      >
        <StyledCollapsePanel
          key="mobileCarouselComponent"
          header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.mobileCarouselComponent)}</AdminHeaderTitle>}
        >
          <Form.Item name="mobileMargin" label={formatMessage(craftPageMessages.label.margin)}>
            <CraftBoxModelInput
              onChange={v => {
                const margin = formatBoxModelValue(v)
                setProp(props => {
                  props.mobile.margin = {
                    mt: margin?.[0] || '0',
                    mr: margin?.[1] || '0',
                    mb: margin?.[2] || '0',
                    ml: margin?.[3] || '0',
                  }
                })
              }}
            />
          </Form.Item>
          <Form.Item name="mobileColumnAmount" label={formatMessage(craftPageMessages.label.columnAmount)}>
            <StyledInputNumber
              min="1"
              onChange={v =>
                setProp(props => {
                  props.mobile.slidesToShow = v
                })
              }
            />
          </Form.Item>
          <Form.Item name="mobileScrollAmount" label={formatMessage(craftPageMessages.label.scrollAmount)}>
            <StyledInputNumber
              min="1"
              onChange={v =>
                setProp(props => {
                  props.mobile.slidesToScroll = v
                })
              }
            />
          </Form.Item>
        </StyledCollapsePanel>
      </Collapse>
    </Form>
  )
}

CraftCarouselContainer.craft = {
  related: {
    settings: CarouselSettings,
  },
  custom: {
    button: {
      label: 'deleteAllBlock',
    },
  },
}

export default CraftCarouselContainer
