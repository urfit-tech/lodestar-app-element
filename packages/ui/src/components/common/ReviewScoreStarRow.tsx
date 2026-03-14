import { FC } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../contexts/AppContext'
import { useAuth } from '../../contexts/AuthContext'
import { useAdaptedReviewable, useReviewAggregate } from '../../hooks/review'
import StarRating from './StarRating'
import commonMessages from './translation'

const StyledReviewRating = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
  text-align: justify;
  flex-direction: column;
`

const ReviewScoreStarRow: FC<{
  path: string
  appId: string
  direction?: 'row' | 'column'
  reviewAverageScore?: number
  reviewCount?: number
}> = ({ path, appId, direction = 'row', reviewAverageScore, reviewCount }) => {
  const { formatMessage } = useIntl()
  const { enabledModules, settings } = useApp()
  const { currentUserRole } = useAuth()
  const { data: reviewable, loading: reviewableLoading } = useAdaptedReviewable(path, appId)
  const {
    averageScore,
    reviewCount: reviewCountFromAggregate,
    loading: reviewAggregateLoading,
  } = useReviewAggregate(path, { skip: typeof reviewAverageScore === 'number' && typeof reviewCount === 'number' })

  if (reviewableLoading || reviewAggregateLoading) return <></>

  const finalReviewCount = reviewCount || reviewCountFromAggregate || 0
  const finalAverageScore = reviewAverageScore || averageScore || 0

  return enabledModules.customer_review ? (
    currentUserRole === 'app-owner' ||
    (reviewable?.is_score_viewable &&
      finalReviewCount >= (settings.review_lower_bound ? Number(settings.review_lower_bound) : 3)) ? (
      <StyledReviewRating className="d-flex" style={{ flexDirection: direction }}>
        <StarRating score={Math.round((Math.round(finalAverageScore * 10) / 10) * 2) / 2} max={5} size="20px" />
        <span style={{ whiteSpace: 'nowrap' }}>
          ({formatMessage(commonMessages.review.reviewCount, { count: finalReviewCount })})
        </span>
      </StyledReviewRating>
    ) : (
      <StyledReviewRating className="mb-2">{formatMessage(commonMessages.review.noReviews)}</StyledReviewRating>
    )
  ) : null
}

export default ReviewScoreStarRow
