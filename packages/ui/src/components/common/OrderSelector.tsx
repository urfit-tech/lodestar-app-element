import { ElementComponent } from '../../types/element'
import { useIntl } from 'react-intl'
import {
  ProductCustomSource,
  ProductPublishedAtSource,
  ProductCurrentPriceSource,
  ProductRecentWatchedSource,
} from '../../types/options'
import { craftPageMessages } from '../../helpers/translation'
import { Select, Spinner } from '@chakra-ui/react'

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
    <Select icon={<Spinner />} className="order__selector" />
  ) : (
    <Select
      className="order__selector"
      value={sourceFrom}
      onChange={e => {
        onChange?.(
          e.target.value as
            | ProductCustomSource['from']
            | ProductPublishedAtSource['from']
            | ProductPublishedAtSource<'popular'>['from']
            | ProductCurrentPriceSource['from']
            | ProductRecentWatchedSource['from'],
        )
      }}
    >
      <option key="popular" value="popular">
        {formatMessage(craftPageMessages.label.popular)}
      </option>
      <option key="publishedAt" value="publishedAt">
        {formatMessage(craftPageMessages.label.publishedAt)}
      </option>
      <option key="currentPrice" value="currentPrice">
        {formatMessage(craftPageMessages.label.currentPrice)}
      </option>
      {!withOrderSelector && (
        <option key="recentWatched" value="recentWatched">
          {formatMessage(craftPageMessages.label.recentWatched)}
        </option>
      )}
      {!withOrderSelector && (
        <option key="custom" value="custom">
          {formatMessage(craftPageMessages.label.custom)}
        </option>
      )}
    </Select>
  )
}

export default OrderSelector
