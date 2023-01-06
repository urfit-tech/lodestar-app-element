import { Select, Form } from 'antd'
import { ElementComponent } from '../../types/element'
import { useIntl } from 'react-intl'
import {
  ProductCustomSource,
  ProductPublishedAtSource,
  ProductCurrentPriceSource,
  ProductRecentWatchedSource,
} from '../../types/options'
import { craftPageMessages } from '../../helpers/translation'

type OrderSelectorProps = {
  sourceFrom:
    | ProductCustomSource['from']
    | ProductPublishedAtSource['from']
    | ProductPublishedAtSource<'popular'>['from']
    | ProductCurrentPriceSource['from']
    | ProductRecentWatchedSource['from']
  withOrderSelector: boolean
  onChange?: (
    value:
      | ProductCustomSource['from']
      | ProductPublishedAtSource['from']
      | ProductPublishedAtSource<'popular'>['from']
      | ProductCurrentPriceSource['from']
      | ProductRecentWatchedSource['from'],
  ) => void
}

const OrderSelector: ElementComponent<OrderSelectorProps> = props => {
  const { loading, errors, sourceFrom, withOrderSelector, onChange } = props
  const { formatMessage } = useIntl()
  if (errors) {
    return <div>Cannot read the data.</div>
  }
  return loading ? (
    <Form>
      <Form.Item label="a">
        <Select loading className="order__selector" />
      </Form.Item>
    </Form>
  ) : (
    <Form>
      <Form.Item>
        <Select
          className="order__selector"
          value={sourceFrom}
          onChange={(
            sourceFrom:
              | ProductCustomSource['from']
              | ProductPublishedAtSource['from']
              | ProductPublishedAtSource<'popular'>['from']
              | ProductCurrentPriceSource['from']
              | ProductRecentWatchedSource['from'],
          ) => {
            onChange?.(sourceFrom)
          }}
        >
          <Select.Option key="popular" value="popular">
            {formatMessage(craftPageMessages.label.popular)}
          </Select.Option>
          <Select.Option key="publishedAt" value="publishedAt">
            {formatMessage(craftPageMessages.label.publishedAt)}
          </Select.Option>
          <Select.Option key="currentPrice" value="currentPrice">
            {formatMessage(craftPageMessages.label.currentPrice)}
          </Select.Option>
          {!withOrderSelector && (
            <Select.Option key="recentWatched" value="recentWatched">
              {formatMessage(craftPageMessages.label.recentWatched)}
            </Select.Option>
          )}
          {!withOrderSelector && (
            <Select.Option key="custom" value="custom">
              {formatMessage(craftPageMessages.label.custom)}
            </Select.Option>
          )}
        </Select>
      </Form.Item>
    </Form>
  )
}

export default OrderSelector
