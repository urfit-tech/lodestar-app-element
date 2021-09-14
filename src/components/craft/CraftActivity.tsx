import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { Collapse } from 'antd'
import Form from 'antd/lib/form/'
import { useForm } from 'antd/lib/form/Form'
import React from 'react'
import { useIntl } from 'react-intl'
import { craftPageMessages } from '../../helpers/translation'
import ActivityBlock from '../blocks/ActivityBlock'
import { AdminHeaderTitle, StyledCollapsePanel } from '../common'
import ContentSelector from '../ContentSelector'

const CraftActivity: UserComponent<{
  customContentIds?: string[]
}> = ({ customContentIds }) => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  return <ActivityBlock customContentIds={customContentIds} craftEnabled={enabled} />
}
type FieldProps = {
  contentIds?: string[]
}

const ActivitySettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [form] = useForm<FieldProps>()

  const {
    actions: { setProp },
    props,
  } = useNode(node => ({
    props: node.data.props,
    selected: node.events.selected,
  }))

  const handleChange = (values: FieldProps) => setProp(props => (props.customContentIds = values.contentIds))

  return (
    <Form
      form={form}
      layout="vertical"
      colon={false}
      requiredMark={false}
      initialValues={{ contentIds: props.customContentIds }}
      onValuesChange={handleChange}
    >
      <Collapse
        className="mt-2 p-0"
        bordered={false}
        expandIconPosition="right"
        ghost
        defaultActiveKey={['displayItem']}
      >
        <StyledCollapsePanel
          key="displayItem"
          header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.specifyDisplayItem)}</AdminHeaderTitle>}
        >
          <Form.Item name="contentIds">
            <ContentSelector contentType="activity" />
          </Form.Item>
        </StyledCollapsePanel>
      </Collapse>
    </Form>
  )
}

CraftActivity.craft = {
  related: {
    settings: ActivitySettings,
  },
}

export default CraftActivity