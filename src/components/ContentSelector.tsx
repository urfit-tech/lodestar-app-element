import { useQuery } from '@apollo/react-hooks'
import { Form, Select } from 'antd'
import gql from 'graphql-tag'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { craftPageMessages } from '../helpers/translation'
import { StyledCraftSettingLabel } from './common'

export type ContentType =
  | 'program'
  | 'activity'
  | 'podcast-program'
  | 'creator'
  | 'funding-project'
  | 'pre-order-project'

const ContentSelector: React.FC<{
  contentType: ContentType
  value?: string[] | undefined
  onChange?: (value: string[] | undefined) => void
}> = ({ contentType, value, onChange }) => {
  const { formatMessage } = useIntl()
  const { contents } = useContent(contentType)
  const [selectedValue, setSelectedValue] = useState<'newest' | 'custom'>(value ? 'custom' : 'newest')
  const defaultSelectorCount = contentType === 'podcast-program' ? 4 : contentType === 'creator' ? 9 : 3
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>(
    Object.assign(Array(defaultSelectorCount).fill(''), value),
  )

  return (
    <div>
      <Form.Item
        label={<StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.ruleOfSort)}</StyledCraftSettingLabel>}
      >
        <Select
          showSearch
          allowClear
          placeholder={formatMessage(craftPageMessages.label.choiceData)}
          value={selectedValue}
          onChange={value => {
            setSelectedValue(value)
            if (value === 'newest') {
              onChange?.(undefined)
            }
            if (value === 'custom') {
              onChange?.(selectedContentIds)
            }
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
      {selectedValue === 'custom' && (
        <Form.Item
          label={
            <StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.dataDisplay)}</StyledCraftSettingLabel>
          }
        >
          {selectedContentIds.map((_, i) => (
            <div className="my-2" key={i}>
              <ContentSelect
                value={selectedContentIds[i]}
                contents={contents.filter(content => !selectedContentIds.slice(0, i).includes(content.id))}
                onChange={value => {
                  const newContentIds = [...selectedContentIds]
                  newContentIds[i] = value

                  setSelectedContentIds(newContentIds)
                  onChange?.(newContentIds.filter(Boolean))
                }}
              />
            </div>
          ))}
        </Form.Item>
      )}
    </div>
  )
}

const ContentSelect: React.VFC<{
  contents: {
    id: string
    title: string
  }[]
  value?: string
  onChange?: (value: string) => void
}> = ({ value, contents, onChange }) => {
  const { formatMessage } = useIntl()
  const [searchText, setSearchText] = useState('')
  const searchContents = contents.filter(content => content.title.includes(searchText))

  return (
    <Select
      showSearch
      allowClear
      placeholder={formatMessage(craftPageMessages.label.choiceData)}
      value={value}
      onChange={onChange}
      onSearch={value => setSearchText(value)}
      filterOption={(input, option) =>
        option?.props?.children
          ? (option.props.children as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
          : true
      }
    >
      {searchContents.map(content => (
        <Select.Option key={content.id} value={content.id}>
          {content.title}
        </Select.Option>
      ))}
    </Select>
  )
}

const useContent: (variant: ContentType) => {
  status: 'loading' | 'error' | 'idle'
  contents: { id: string; title: string }[]
} = variant => {
  const query =
    variant === 'program'
      ? gql`
          query GET_PROGRAM {
            contents: program {
              id
              title
            }
          }
        `
      : variant === 'activity'
      ? gql`
          query GET_ACTIVITY {
            contents: activity {
              id
              title
            }
          }
        `
      : variant === 'podcast-program'
      ? gql`
          query GET_PODCAST_PROGRAM {
            contents: podcast_program {
              id
              title
            }
          }
        `
      : variant === 'creator'
      ? gql`
          query GET_CREATOR {
            contents: creator {
              id
              title: name
            }
          }
        `
      : variant === 'funding-project'
      ? gql`
          query GET_FUNDING_PROJECT {
            contents: project(where: { type: { _eq: "funding" } }) {
              id
              title
            }
          }
        `
      : gql`
          query GET_PRE_ORDER_PROJECT {
            contents: project(where: { type: { _eq: "pre-order" } }) {
              id
              title
            }
          }
        `

  const { loading, data, error } = useQuery<{ contents: { id: string; title: string }[] }>(query)
  const status = loading ? 'loading' : error ? 'error' : 'idle'
  const contents = data?.contents || []

  return {
    status,
    contents,
  }
}

export default ContentSelector
