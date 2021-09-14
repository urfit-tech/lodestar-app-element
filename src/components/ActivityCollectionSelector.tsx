import { useApolloClient } from '@apollo/react-hooks'
import { Button, Form, InputNumber, Select } from 'antd'
import gql from 'graphql-tag'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { StyledCraftSettingLabel } from '../components/common'
import { useApp } from '../contexts/AppContext'
import hasura from '../hasura'
import { craftPageMessages } from '../helpers/translation'

export type ActivityCollection = {
  type: 'newest' | 'custom'
  ids: (string | null)[]
}
const ActivityCollectionSelector: React.FC<{
  value?: ActivityCollection
  onChange?: (value: ActivityCollection) => void
}> = ({ value, onChange }) => {
  const { formatMessage } = useIntl()
  return (
    <div>
      <Form.Item
        label={<StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.ruleOfSort)}</StyledCraftSettingLabel>}
      >
        <Select<ActivityCollection['type']>
          placeholder={formatMessage(craftPageMessages.label.choiceData)}
          value={value?.type}
          onChange={type => {
            onChange?.({ type, ids: [] })
          }}
          filterOption={(input, option) =>
            option?.props?.children
              ? (option.props.children as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
              : true
          }
        >
          <Select.Option key="newest" value="newest">
            {formatMessage(craftPageMessages.label.newest)}
          </Select.Option>
          <Select.Option key="custom" value="custom">
            {formatMessage(craftPageMessages.label.custom)}
          </Select.Option>
        </Select>
      </Form.Item>
      {value?.type === 'newest' && (
        <Form.Item
          label={
            <StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.displayAmount)}</StyledCraftSettingLabel>
          }
        >
          <InputNumber
            value={value.ids.length}
            onChange={limit => onChange?.({ type: value.type, ids: new Array(limit).fill(null) })}
          />
        </Form.Item>
      )}
      {value?.type === 'custom' && (
        <Form.Item
          label={
            <StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.dataDisplay)}</StyledCraftSettingLabel>
          }
        >
          {value.ids.map((activityId, idx) => (
            <div className="my-2" key={activityId}>
              <ActivitySelect
                value={activityId}
                onChange={selectedActivityId => {
                  onChange?.({
                    type: value.type,
                    ids: [...value.ids.slice(0, idx), selectedActivityId, ...value.ids.slice(idx + 1)],
                  })
                }}
                onRemove={() =>
                  onChange?.({ type: value.type, ids: [...value.ids.slice(0, idx), ...value.ids.slice(idx + 1)] })
                }
              />
            </div>
          ))}
          <Button type="link" onClick={() => onChange?.({ type: value.type, ids: [...value.ids, null] })}>
            {formatMessage(craftPageMessages.label.addItem)}
          </Button>
        </Form.Item>
      )}
    </div>
  )
}

const ActivitySelect: React.VFC<{
  value?: string | null
  onChange?: (value: string | null) => void
  onRemove?: () => void
}> = ({ value, onChange, onRemove }) => {
  const { formatMessage } = useIntl()
  const [searchValue, setSearchValue] = useState('')
  const { id: appId } = useApp()
  const apolloClient = useApolloClient()
  const [searchedActivities, setSearchedActivities] = useState<{ id: string; title: string }[]>([])

  useEffect(() => {
    apolloClient
      .query<hasura.SEARCH_ACTIVITY, hasura.SEARCH_ACTIVITYVariables>({
        query: gql`
          query SEARCH_ACTIVITY($appId: String!, $searchText: String!) {
            activity(
              limit: 20
              where: { app_id: { _eq: $appId }, title: { _like: $searchText }, published_at: { _is_null: false } }
            ) {
              id
              title
            }
          }
        `,
        variables: {
          appId,
          searchText: `%${searchValue}%`,
        },
      })
      .then(({ data }: { data?: hasura.SEARCH_ACTIVITY }) => {
        setSearchedActivities(data?.activity.map(v => ({ id: v.id, title: v.title })) || [])
      })
  }, [searchValue, apolloClient, appId])
  return (
    <Select
      showSearch
      allowClear
      placeholder={formatMessage(craftPageMessages.label.choiceData)}
      value={value || undefined}
      searchValue={searchValue}
      onChange={onChange}
      onSearch={value => setSearchValue(value)}
      onClear={onRemove}
      filterOption={(input, option) =>
        option?.props?.children
          ? (option.props.children as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
          : true
      }
    >
      {searchedActivities.map(activity => (
        <Select.Option key={activity.id} value={activity.id}>
          {activity.title}
        </Select.Option>
      ))}
    </Select>
  )
}

export default ActivityCollectionSelector
