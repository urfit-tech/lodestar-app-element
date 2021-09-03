import { useNode, UserComponent } from '@craftjs/core'
import { Button, Collapse } from 'antd'
import Form from 'antd/lib/form/'
import { useForm } from 'antd/lib/form/Form'
import React from 'react'
import { useIntl } from 'react-intl'
import { commonMessages, craftPageMessages } from '../../helpers/translation'
import ActivityBlock from '../blocks/ActivityBlock'
import InstructorBlock from '../blocks/InstructorBlock'
import PodcastProgramBlock from '../blocks/PodcastProgramBlock'
import ProgramBlock from '../blocks/ProgramBlock'
import ProjectBlock from '../blocks/ProjectBlock'
import { AdminHeaderTitle, StyledCollapsePanel, StyledSettingButtonWrapper } from '../common'
import ContentSelector, { ContentType } from '../ContentSelector'

const CraftDataSelector: UserComponent<{
  appId?: string
  contentType: ContentType
  customContentIds?: string[]
}> = ({ appId, contentType, customContentIds }) => {
  const {
    connectors: { connect },
  } = useNode()

  return (
    <div ref={ref => ref && connect(ref)} style={{ padding: '20px', cursor: 'pointer' }}>
      {contentType === 'program' && <ProgramBlock customContentIds={customContentIds} />}
      {contentType === 'activity' && <ActivityBlock customContentIds={customContentIds} />}
      {contentType === 'podcast-program' && <PodcastProgramBlock customContentIds={customContentIds} />}
      {contentType === 'creator' && appId && <InstructorBlock appId={appId} customContentIds={customContentIds} />}
      {contentType === 'funding-project' && <ProjectBlock projectType="funding" customContentIds={customContentIds} />}
      {contentType === 'pre-order-project' && (
        <ProjectBlock projectType="pre-order" customContentIds={customContentIds} />
      )}
    </div>
  )
}
type FieldProps = {
  contentIds?: string[]
}

const DataSelectorSettings: React.VFC = () => {
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
        defaultActiveKey={['imageSetting']}
      >
        <StyledCollapsePanel
          key="imageSetting"
          header={<AdminHeaderTitle>{formatMessage(craftPageMessages.label.specifyDisplayItem)}</AdminHeaderTitle>}
        >
          <Form.Item name="contentIds">
            <ContentSelector contentType={props.contentType} />
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

CraftDataSelector.craft = {
  related: {
    settings: DataSelectorSettings,
  },
}

export default CraftDataSelector
