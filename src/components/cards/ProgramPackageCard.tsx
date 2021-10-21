import { Skeleton, SkeletonText } from '@chakra-ui/react'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramPackageElementProps } from '../../types/element'
import { CustomRatioImage } from '../common/Image'
import PriceLabel from '../labels/PriceLabel'
import Card from './Card'

const messages = defineMessages({
  totalCourses: { id: 'programPackage.card.totalCourses', defaultMessage: '{count} 堂課' },
  totalDuration: { id: 'programPackage.card.totalDuration', defaultMessage: '{duration} 分鐘' },
})
const ProgramPackageCard: React.FC<ProgramPackageElementProps> = props => {
  const { loading, errors } = props
  const { formatMessage } = useIntl()
  const history = useHistory()
  if (errors) {
    return <div>{JSON.stringify(errors)}</div>
  }
  return (
    <Card
      className={!loading && props.link ? 'cursor-pointer' : ''}
      customStyle={{
        direction: 'column',
        bordered: false,
        shadow: true,
        backgroundColor: 'white',
        p: '0',
        overflow: 'hidden',
      }}
      onClick={() => !loading && !props.editing && props.link && history.push(props.link)}
    >
      {loading ? (
        <Skeleton width="100%" style={{ paddingTop: 'calc(100% * 9/16)' }} />
      ) : (
        <CustomRatioImage width="100%" ratio={9 / 16} src={props.coverUrl || EmptyCover} />
      )}
      <Card.ContentBlock>
        {loading ? <Skeleton className="mb-3" width="20" height={4} /> : <Card.Title>{props.title}</Card.Title>}
        <Card.Description>
          {loading ? (
            <SkeletonText className="mb-3" noOfLines={1} />
          ) : (
            formatMessage(messages.totalCourses, { count: props.totalPrograms }) +
            '．' +
            formatMessage(messages.totalDuration, { duration: props.totalDuration })
          )}
        </Card.Description>
        <Card.MetaBlock className="d-flex flex-row-reverse justify-content-between align-items-center">
          <div>
            {loading ? (
              <Skeleton width="10" height={4} />
            ) : (
              <PriceLabel
                variant="inline"
                listPrice={props.listPrice || props.currentPrice}
                salePrice={props.currentPrice}
                periodAmount={props.period?.amount}
                periodType={props.period?.type}
              />
            )}
          </div>
        </Card.MetaBlock>
      </Card.ContentBlock>
    </Card>
  )
}

export default ProgramPackageCard
