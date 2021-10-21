import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { useCurrency } from '../../hooks/util'
import { PeriodType } from '../../types/program'
import ShortenPeriodTypeLabel from './ShortenPeriodTypeLabel'

const messages = defineMessages({
  listPrice: { id: 'common.label.listPrice', defaultMessage: '定價' },
  free: { id: 'common.label.free', defaultMessage: '免費' },
  firstPeriod: { id: 'common.label.firstPeriod', defaultMessage: '首期' },
  fromSecondPeriod: { id: 'common.label.fromSecondPeriod', defaultMessage: '第二期開始' },
  originalPrice: { id: 'common.label.originalPrice', defaultMessage: '原價' },
})

const FullDetailPrice = styled.div`
  > div:first-child {
    color: var(--gray-darker);
    font-size: 28px;
    font-weight: bold;
  }
  > div:nth-child(2) {
    color: var(--gray-darker);
  }
`
const SalePrice = styled.div``
const ListPrice = styled.div`
  ${SalePrice} + && {
    color: var(--black-45);
    font-size: 14px;
    text-decoration: line-through;
  }
`

const InlinePrice = styled.div`
  color: ${props => props.theme['@primary-color']};

  & > span:first-child:not(:last-child) {
    margin-right: 0.5rem;
    color: ${props => 'var(--gray-dark);'};
    text-decoration: line-through;
  }
`

type PriceLabelOptions = {
  listPrice: number
  salePrice?: number | null
  downPrice?: number | null
  periodAmount?: number | null
  periodType?: PeriodType
  currencyId?: 'LSC' | string
}
const PriceLabel: React.VFC<
  PriceLabelOptions & {
    variant?: 'default' | 'inline' | 'full-detail'
    render?: React.VFC<PriceLabelOptions & { formatCurrency: (price: number) => string }>
    noFreeText?: boolean
  }
> = ({ variant, render, noFreeText, ...options }) => {
  const { listPrice, salePrice, downPrice, periodAmount, periodType } = options
  const { formatMessage } = useIntl()
  const { formatCurrency } = useCurrency(options.currencyId)

  if (render) {
    return render({ ...options, formatCurrency })
  }

  const displayPrice = salePrice || listPrice
  const firstPeriodPrice = displayPrice - (downPrice || 0)

  const periodElem = !!periodType && (
    <>
      {` / ${periodAmount && periodAmount > 1 ? periodAmount : ''}`}
      <ShortenPeriodTypeLabel periodType={periodType} withQuantifier={!!periodAmount && periodAmount > 1} />
    </>
  )

  if (variant === 'full-detail') {
    return (
      <FullDetailPrice>
        {!!downPrice && (
          <div>
            {formatMessage(messages.firstPeriod)}
            {firstPeriodPrice === 0 && !noFreeText && formatMessage(messages.free)}
            {formatCurrency(firstPeriodPrice)}
          </div>
        )}

        {typeof salePrice === 'number' && (
          <SalePrice>
            {!!downPrice && formatMessage(messages.fromSecondPeriod)}
            {salePrice === 0 && !noFreeText && formatMessage(messages.free)}
            {formatCurrency(salePrice)}
            <span style={{ fontSize: '16px' }}>{periodElem}</span>
          </SalePrice>
        )}

        <ListPrice>
          {typeof salePrice === 'number'
            ? formatMessage(messages.originalPrice)
            : !!downPrice
            ? formatMessage(messages.fromSecondPeriod)
            : ''}
          {listPrice === 0 && !noFreeText && formatMessage(messages.free)}
          {formatCurrency(listPrice)}
          <span style={{ fontSize: '16px' }}>{periodElem}</span>
        </ListPrice>
      </FullDetailPrice>
    )
  }

  if (variant === 'inline') {
    return (
      <InlinePrice>
        <span>
          {formatCurrency(listPrice)}
          {periodElem}
        </span>
        {typeof salePrice === 'number' && (
          <span>
            {formatCurrency(salePrice)}
            {periodElem}
          </span>
        )}
      </InlinePrice>
    )
  }

  return <>{formatCurrency(listPrice)}</>
}

export default PriceLabel
