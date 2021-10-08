import { Skeleton, SkeletonText } from '@chakra-ui/skeleton'
import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { durationFormatter } from '../../helpers'
import { MultiLineTruncationMixin } from '../../helpers/style'
import EmptyCover from '../../images/empty-cover.png'
import { CurrentPrice } from '../../types/data'
import { PlanPeriod } from '../../types/shared'
import { MultiAvatar } from '../Avatar'
import Card from '../Card'
import { CustomRatioImage } from '../Image'
import PriceLabel from '../label/PriceLabel'

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

export type ProgramCardProps = (
  | {
      loading: true
    }
  | ({
      loading?: never
      id: string
      title: string
      abstract: string
      totalDuration: number
      coverUrl: string | null
      instructorIds: string[]
      period: PlanPeriod | null
    } & CurrentPrice)
) & {
  craftEnabled?: boolean
}

const ProgramCard: React.VFC<ProgramCardProps> = props => {
  const { loading, craftEnabled } = props
  const history = useHistory()

  return (
    <div>
      <InstructorPlaceHolder>
        {loading ? (
          <MultiAvatar loading memberIdList={[]} />
        ) : (
          <MultiAvatar
            memberIdList={props.instructorIds}
            withName
            onClick={instructorId => !craftEnabled && history.push(`/creators/${instructorId}?tabkey=introduction`)}
          />
        )}
      </InstructorPlaceHolder>

      <Card
        customStyle={{
          direction: 'column',
          bordered: false,
          shadow: true,
          backgroundColor: 'white',
          p: '0',
          overflow: 'hidden',
        }}
        onClick={() => !craftEnabled && !loading && `/programs/${props.id}/contents`}
      >
        {loading ? (
          <Skeleton width="100%" style={{ paddingTop: 'calc(100% * 9/16)' }} />
        ) : (
          <CustomRatioImage width="100%" ratio={9 / 16} src={props.coverUrl || EmptyCover} />
        )}
        <Card.ContentBlock>
          {loading ? <Skeleton className="mb-3" width="20" height={4} /> : <StyledTitle>{props.title}</StyledTitle>}
          <Card.Description>
            {loading ? <SkeletonText className="mb-3" noOfLines={Math.ceil(Math.random() * 3 + 1)} /> : props.abstract}
          </Card.Description>
          <Card.MetaBlock className="d-flex flex-row-reverse justify-content-between align-items-center">
            <div>
              {loading ? (
                <Skeleton width="10" height={4} />
              ) : (
                <PriceLabel
                  variant="inline"
                  listPrice={props.listPrice}
                  salePrice={props.salePrice}
                  periodAmount={props.period?.amount}
                  periodType={props.period?.type}
                />
              )}
            </div>
            <div>{loading ? <SkeletonText /> : durationFormatter(props.totalDuration)}</div>
          </Card.MetaBlock>
        </Card.ContentBlock>
      </Card>
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
