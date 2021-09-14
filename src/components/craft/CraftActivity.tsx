import { useApolloClient } from '@apollo/react-hooks'
import { useEditor, useNode, UserComponent } from '@craftjs/core'
import { Collapse, Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import gql from 'graphql-tag'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import ActivityCollectionSelector, { ActivityCollection } from '../../components/ActivityCollectionSelector'
import { useApp } from '../../contexts/AppContext'
import hasura from '../../hasura'
import { notEmpty } from '../../helpers'
import { craftPageMessages } from '../../helpers/translation'
import ActivityBlock from '../blocks/ActivityBlock'
import { AdminHeaderTitle, StyledCollapsePanel } from '../common'

const CraftActivity: UserComponent<{
  type: ActivityCollection['type']
  ids: ActivityCollection['ids']
}> = ({ type, ids }) => {
  const apolloClient = useApolloClient()
  const { id: appId } = useApp()
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const [activityIds, setActivityIds] = useState<string[]>([])
  useEffect(() => {
    if (type === 'newest') {
      apolloClient
        .query({
          query: gql`
            query GET_NEWEST_ACTIVITIES($appId: String!, $limit: Int) {
              activity(where: { app_id: { _eq: $appId }, published_at: { _is_null: false } }, limit: $limit) {
                id
              }
            }
          `,
          variables: {
            appId,
            limit: ids.length > 0 ? ids.length : undefined,
          },
        })
        .then(({ data }: { data?: hasura.GET_NEWEST_ACTIVITIES }) => {
          setActivityIds(data?.activity.map(v => v.id) || [])
        })
    } else {
      setActivityIds(ids.filter(notEmpty) || [])
    }
  }, [type, ids, apolloClient, appId])
  return <ActivityBlock activityIds={activityIds} craftEnabled={enabled} />
}

const ActivitySettings: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [form] = useForm<{ activityCollection: ActivityCollection }>()

  const {
    actions: { setProp },
    props,
  } = useNode(node => ({
    props: node.data.props,
    selected: node.events.selected,
  }))

  return (
    <Form
      form={form}
      layout="vertical"
      colon={false}
      requiredMark={false}
      initialValues={{ activityCollection: { type: props.type, ids: props.ids } }}
      onValuesChange={() => {
        form
          .validateFields()
          .then(values => {
            setProp(props => {
              props.type = values.activityCollection.type
              props.ids = values.activityCollection.ids
            })
          })
          .catch(() => {})
      }}
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
          <Form.Item name="activityCollection">
            <ActivityCollectionSelector />
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
