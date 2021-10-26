import { Spinner } from '@chakra-ui/react'
import { Typography } from 'antd'
import moment from 'moment'
import React from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import PriceLabel from '../../components/labels/PriceLabel'
import ProductTypeLabel from '../../components/labels/ProductTypeLabel'
import { desktopViewMixin } from '../../helpers'
import { CommonTextMixin } from '../../helpers/style'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useSimpleProduct } from '../../hooks/common'
import EmptyCover from '../../images/empty-cover.png'
import { ProductType } from '../../types/product'
import { CustomRatioImage } from './Image'

const StyledCoverImage = styled.img`
  width: 64px;
  height: 48px;
  min-height: 1px;
  border-radius: 4px;
  object-fit: cover;
  object-position: center;
`
const StyledProductType = styled.div`
  color: var(--gray-dark);
  font-size: 12px;
  letter-spacing: 0.6px;
`
const StyledProductTitle = styled.div`
  color: var(--gray-darker);
  line-height: 1.5;
  letter-spacing: 0.2px;
`
const StyledTitle = styled(Typography.Title)`
  && {
    color: var(--gray-darker);
    font-size: 20px;
    font-weight: bold;
    line-height: 1.3;
    letter-spacing: 0.77px;
  }
`
const StyledPeriod = styled.div`
  ${CommonTextMixin}
`
const StyledMeta = styled.span`
  margin-top: 0.5rem;
  min-width: 4.5rem;
  white-space: nowrap;

  ${desktopViewMixin(css`
    margin-top: 0;
    text-align: right;
  `)}
`
const StyledHighlight = styled.div`
  color: ${props => props.theme['@primary-color']};
  font-size: 14px;
  letter-spacing: 0.18px;
  margin-top: 8px;
`
const StyledListLabelBLock = styled.div`
  width: 5rem;
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledListTitleBlock = styled.div`
  overflow: hidden;
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
  white-space: nowrap;
  text-overflow: ellipsis;
`

type ProductItemProps = {
  id: string
  startedAt?: Date
  variant?: 'default' | 'simple' | 'simpleCartProduct' | 'checkout' | 'coupon-product'
  quantity?: number
}
const ProductItem: React.VFC<ProductItemProps> = ({ id, startedAt, variant, quantity }) => {
  const { formatMessage } = useIntl()

  const { loading, target } = useSimpleProduct({ id, startedAt })
  const [productType] = id.split('_') as [ProductType]

  if (loading || !target) {
    if (variant === 'coupon-product') {
      return <Spinner size="sm" className="d-block" />
    }

    return <Spinner size="lg" />
  }

  const {
    title,
    coverUrl,
    listPrice,
    salePrice,
    discountDownPrice,
    currencyId,
    periodAmount,
    periodType,
    endedAt,
    isSubscription,
  } = target

  switch (variant) {
    case 'simple':
      return (
        <>
          <StyledTitle level={2} ellipsis={{ rows: 2 }} className="flex-grow-1 m-0 mr-5">
            {title}
          </StyledTitle>
          <StyledCoverImage src={coverUrl || EmptyCover} alt={id} className="flex-shrink-0" />
        </>
      )
    case 'coupon-product':
      return (
        <div className="d-flex mb-1">
          <StyledListLabelBLock className="flex-shrink-0">
            <ProductTypeLabel productType={productType} />
          </StyledListLabelBLock>
          <StyledListTitleBlock className="flex-grow-1">{title}</StyledListTitleBlock>
        </div>
      )
    case 'simpleCartProduct':
      return (
        <div className="d-flex align-items-center justify-content-between">
          <CustomRatioImage
            width="4rem"
            ratio={2 / 3}
            src={coverUrl || EmptyCover}
            shape="rounded"
            className="flex-shrink-0 mr-3"
          />
          <div className="flex-grow-1">
            <Typography.Paragraph ellipsis={{ rows: 2 }} className="mb-0">
              {title}
              {typeof quantity === 'number' ? ` x${quantity}` : ''}
            </Typography.Paragraph>
            <StyledMeta className="text-left">
              <PriceLabel listPrice={(salePrice || listPrice || 0) * (quantity || 1)} currencyId={currencyId} />
            </StyledMeta>
          </div>
        </div>
      )
    case 'checkout':
      return (
        <>
          <div className="d-flex align-items-center justify-content-between">
            <StyledTitle level={2} ellipsis={{ rows: 2 }} className="flex-grow-1 m-0 mr-5">
              <span>{title}</span>
              {!!startedAt && !!endedAt && (
                <StyledPeriod className="mt-2">{`${moment(startedAt).format('YYYY-MM-DD(dd)')} ${moment(
                  startedAt,
                ).format('HH:mm')} - ${moment(endedAt).format('HH:mm')}`}</StyledPeriod>
              )}
            </StyledTitle>
            <CustomRatioImage
              width="88px"
              ratio={3 / 4}
              src={coverUrl || EmptyCover}
              shape="rounded"
              className="flex-shrink-0"
            />
          </div>
          {typeof listPrice == 'number' && (
            <PriceLabel
              variant="full-detail"
              listPrice={listPrice}
              salePrice={salePrice}
              downPrice={discountDownPrice}
              currencyId={currencyId}
              periodType={isSubscription === undefined && periodType ? periodType : undefined}
              periodAmount={isSubscription === undefined && periodType ? periodAmount : undefined}
            />
          )}
          {isSubscription === false && periodType && (
            <StyledHighlight className="mb-3">
              {formatMessage(productMessages.label.availableForLimitTime, {
                amount: periodAmount,
                unit:
                  periodType === 'D'
                    ? formatMessage(commonMessages.unit.day)
                    : periodType === 'W'
                    ? formatMessage(commonMessages.unit.week)
                    : periodType === 'M'
                    ? formatMessage(commonMessages.unit.monthWithQuantifier)
                    : periodType === 'Y'
                    ? formatMessage(commonMessages.unit.year)
                    : formatMessage(commonMessages.unknown.period),
              })}
            </StyledHighlight>
          )}
        </>
      )
  }

  return (
    <div className="d-flex align-items-center justify-content-start">
      <CustomRatioImage
        width="64px"
        ratio={3 / 4}
        src={coverUrl || EmptyCover}
        shape="rounded"
        className="flex-shrink-0 mr-3"
      />
      <div className="flex-grow-1">
        <StyledProductType>
          <ProductTypeLabel productType={productType} />
        </StyledProductType>

        <StyledProductTitle>{title}</StyledProductTitle>
      </div>
    </div>
  )
}

export default ProductItem
