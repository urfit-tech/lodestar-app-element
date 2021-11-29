import { Skeleton, SkeletonText } from '@chakra-ui/skeleton'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { durationFormatter } from '../../helpers'
import { ProgramElementProps } from '../../types/element'
import { MultiLineTruncationMixin } from '../common'
import PriceLabel from '../labels/PriceLabel'
import Card from './Card'

const StyledTitle = styled.div`
  ${MultiLineTruncationMixin}
  margin-bottom: 1.25rem;
  height: 3em;
  color: var(--gray-darker);
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
`

const ProgramSecondaryCard: React.FC<ProgramElementProps> = props => {
  const { loading, errors } = props
  const history = useHistory()

  if (errors) {
    return <div>{JSON.stringify(errors)}</div>
  }
  return (
    <Card
      className={classNames('cursor-pointer', props.className)}
      onClick={() => !loading && !props.editing && history.push(`/programs/${props.id}`)}
    >
      <Card.Content>
        {loading ? <Skeleton className="mb-3" width="20" height={4} /> : <StyledTitle>{props.title}</StyledTitle>}
        <Card.Description>
          {loading ? <SkeletonText className="mb-3" noOfLines={Math.ceil(Math.random() * 3 + 1)} /> : props.abstract}
        </Card.Description>
        <Card.MetaBlock className="d-flex flex-row-reverse justify-content-between align-items-center">
          <div>
            {loading ? (
              <Skeleton width="10" height={4} />
            ) : props.listPrice !== undefined ? (
              <PriceLabel
                variant="inline"
                listPrice={props.listPrice}
                salePrice={props.salePrice}
                periodAmount={props.period?.amount}
                periodType={props.period?.type}
              />
            ) : null}
          </div>
          <div>{loading ? <SkeletonText /> : durationFormatter(props.totalDuration)}</div>
        </Card.MetaBlock>
      </Card.Content>
    </Card>
  )
}

export function withReviews<P>(
  WrappedComponent: React.ComponentType<P & { reviews: string[] }>,
  options?: { limit: number },
) {
  const ComponentWithReview: React.VFC<P> = props => {
    return <WrappedComponent {...props} reviews={[]}></WrappedComponent>
  }
  return ComponentWithReview
}

export default ProgramSecondaryCard
