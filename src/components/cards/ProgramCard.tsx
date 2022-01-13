import { Skeleton, SkeletonText } from '@chakra-ui/skeleton'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { durationFormatter } from '../../helpers'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramElementProps } from '../../types/element'
import { MultiLineTruncationMixin } from '../common'
import { MultiAvatar } from '../common/Avatar'
import { CustomRatioImage } from '../common/Image'
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
const InstructorPlaceHolder = styled.div`
  margin-bottom: 1rem;
  height: 2rem;
`
const StyledCard = styled(Card)`
  background-color: white;
  padding: 0;
  overflow: hidden;
`
const ProgramCard: React.FC<ProgramElementProps> = props => {
  const { loading, errors } = props
  const history = useHistory()
  if (errors) {
    return <div>{JSON.stringify(errors)}</div>
  }
  return (
    <div>
      <InstructorPlaceHolder>
        {loading ? (
          <MultiAvatar loading memberIdList={[]} />
        ) : (
          <MultiAvatar
            memberIdList={props.instructorIds || []}
            withName
            onClick={instructorId => !props.editing && history.push(`/creators/${instructorId}?tabkey=introduction`)}
          />
        )}
      </InstructorPlaceHolder>

      <StyledCard
        className={classNames('program', 'cursor-pointer', props.className)}
        shadowed
        onClick={() => {
          // !loading && !props.editing && history.push(`/programs/${props.id}`)
        }}
      >
        {loading ? (
          <Skeleton width="100%" style={{ paddingTop: 'calc(100% * 9/16)' }} />
        ) : (
          <CustomRatioImage width="100%" ratio={9 / 16} src={props.coverUrl || EmptyCover} />
        )}
        <Card.Content className="content">
          {loading ? <Skeleton className="mb-3" width="20" height={4} /> : <StyledTitle>{props.title}</StyledTitle>}
          <Card.Description className="description">
            {loading ? <SkeletonText className="mb-3" noOfLines={Math.ceil(Math.random() * 3 + 1)} /> : props.abstract}
          </Card.Description>
          <Card.MetaBlock className="metadata d-flex flex-row-reverse justify-content-between align-items-center">
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
      </StyledCard>
    </div>
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

export default ProgramCard
