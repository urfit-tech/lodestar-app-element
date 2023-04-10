import { Skeleton, SkeletonText } from '@chakra-ui/react'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { durationFormatter } from '../../helpers'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramPackageElementProps } from '../../types/element'
import { MultiLineTruncationMixin } from '../common'
import { CustomRatioImage } from '../common/Image'
import PriceLabel from '../labels/PriceLabel'
import Card from './Card'

const StyledTitle = styled.div`
  ${MultiLineTruncationMixin}
  height: 3em;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
`

const messages = defineMessages({
  totalCourses: { id: 'programPackage.card.totalCourses', defaultMessage: '{count} 堂課' },
})

const ProgramPackageCard: React.FC<ProgramPackageElementProps> = props => {
  const { loading, errors } = props
  const { formatMessage } = useIntl()
  if (errors) {
    return <div>{JSON.stringify(errors)}</div>
  }
  return (
    <Card
      className={
        props.onClick ? `programPackage cursor-pointer ${props.className}` : `programPackage ${props.className}`
      }
      onClick={props.onClick}
    >
      {loading ? (
        <Skeleton width="100%" style={{ paddingTop: 'calc(100% * 9/16)' }} />
      ) : (
        <CustomRatioImage className="cover" width="100%" ratio={9 / 16} src={props.coverUrl || EmptyCover} />
      )}
      <Card.Content className="content">
        {loading ? (
          <Skeleton className="mb-3" width="20" height={4} />
        ) : (
          <StyledTitle className="content__title">
            <Link to={!props.editing && props.link ? props.link : '#!'}>{props.title}</Link>
          </StyledTitle>
        )}
        <Card.Description className="description">
          {loading ? (
            <SkeletonText className="mb-3" noOfLines={1} />
          ) : (
            <>
              <span className="description__totalCourses">
                {formatMessage(messages.totalCourses, { count: props.totalPrograms })}
              </span>
              <span>.</span>
              <span className="description__totalDuration">{durationFormatter(props.totalDuration)}</span>
            </>
          )}
        </Card.Description>
        <Card.MetaBlock className="metadata d-flex flex-row-reverse justify-content-between align-items-center">
          <div>
            {loading ? (
              <Skeleton width="10" height={4} />
            ) : props.listPrice ? (
              <PriceLabel
                variant="inline"
                listPrice={props.listPrice}
                salePrice={props.salePrice}
                periodAmount={props.period?.amount}
                periodType={props.period?.type}
              />
            ) : (
              ''
            )}
          </div>
        </Card.MetaBlock>
      </Card.Content>
    </Card>
  )
}

export default ProgramPackageCard
