import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { Button, Collapse } from 'antd'
import Form from 'antd/lib/form/'
import { useForm } from 'antd/lib/form/Form'
import React from 'react'
import { useIntl } from 'react-intl'
import { commonMessages, craftPageMessages } from '../../helpers/translation'
import InstructorBlock from '../blocks/InstructorBlock'
import { AdminHeaderTitle, StyledCollapsePanel, StyledSettingButtonWrapper } from '../common'
import ContentSelector from '../ContentSelector'

const CraftInstructor: UserComponent<{
  appId: string
  customContentIds?: string[]
}> = ({ appId, customContentIds }) => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  return <InstructorBlock appId={appId} customContentIds={customContentIds} craftEnabled={enabled} />
}
type FieldProps = {
  contentIds?: string[]
}

const InstructorSettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [form] = useForm<FieldProps>()

  const {
    actions: { setProp },
    props,
    selected,
  } = useNode(node => ({
    props: node.data.props,
    selected: node.events.selected,
  }))

  const handleSubmit = (values: FieldProps) => setProp(props => (props.customContentIds = values.contentIds))

  return (
    <Form
      form={form}
      layout="vertical"
      colon={false}
      requiredMark={false}
      initialValues={{ contentIds: props.customContentIds }}
      onFinish={handleSubmit}
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
            <ContentSelector contentType="creator" />
          </Form.Item>
        </StyledCollapsePanel>
      </Collapse>
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

CraftInstructor.craft = {
  related: {
    settings: InstructorSettings,
  },
}

export default CraftInstructor
