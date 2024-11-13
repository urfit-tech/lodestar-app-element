import { StarIcon } from '@chakra-ui/icons'
import { Skeleton, SkeletonText } from '@chakra-ui/skeleton'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useApp } from '../../contexts/AppContext'
import { useAdaptedReviewable, useReviewAggregate } from '../../hooks/review'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramElementProps } from '../../types/element'
import { MultiLineTruncationMixin } from '../common'
import { CustomRatioImage } from '../common/Image'

const StyledTitle = styled.div`
  ${MultiLineTruncationMixin}
  margin-top: 1rem;
  color: var(--gray-darker);
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
`
const StyledCategories = styled.div`
  width: 70%;
  margin-top: 0.25rem;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`
const StyledScore = styled.div`
  font-size: 14px;
  color: ${props => props.theme['@primary-color']};
`

const ProgramSecondaryCard: React.FC<ProgramElementProps> = props => {
  const { id: appId } = useApp()
  const { loading: propsLoading, errors } = props
  const path = `/programs/${props.id}`
  const { data: rawReviewable, loading: reviewableLoading } = useAdaptedReviewable(path, appId)
  const loading = propsLoading && reviewableLoading
  const { loading: loadingReviewAggregate, averageScore } = useReviewAggregate(path)

  if (errors) {
    return <div>{JSON.stringify(errors)}</div>
  }

  return (
    <div
      className={classNames('program', { 'cursor-pointer': Boolean(props.onClick) }, props.className)}
      onClick={props.onClick}
    >
      {loading ? (
        <Skeleton width="100%" style={{ paddingTop: 'calc(100% * 9/16)' }} />
      ) : (
        <CustomRatioImage className="cover" width="100%" ratio={9 / 16} src={props.coverUrl || EmptyCover} />
      )}
      <div className="content">
        {loading ? (
          <Skeleton className="mb-3" width="20" height={4} />
        ) : (
          <StyledTitle className="content__title">
            <Link to={!props.editing ? `/programs/${props.id}` : '#!'}>{props.title}</Link>
          </StyledTitle>
        )}
        {loading || loadingReviewAggregate ? (
          <SkeletonText className="mb-3" />
        ) : (
          <div className="d-flex justify-content-between align-items-center">
            <StyledCategories className="category">
              {props?.categories
                ?.filter?.((_, i) => i < 3)
                // FIXME display subCategory instead split '/' here
                .map(category => category.name.split('/').pop())
                .join('・')}
            </StyledCategories>
            {rawReviewable?.is_score_viewable && averageScore !== 0 && (
              <StyledScore className="d-flex align-items-center score">
                <span className="score__amount">{averageScore.toFixed(1)}</span>
                <StarIcon className="ml-1 score__starIcon" style={{ width: '14px', height: '14px' }} />
              </StyledScore>
            )}
          </div>
        )}
      </div>
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

export default ProgramSecondaryCard
