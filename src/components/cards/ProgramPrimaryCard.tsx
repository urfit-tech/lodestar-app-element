import { Icon } from '@chakra-ui/react'
import { Skeleton, SkeletonText } from '@chakra-ui/skeleton'
import classNames from 'classnames'
import { AiOutlineClockCircle, AiOutlineUser } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useApp } from '../../contexts/AppContext'
import { durationFormatter } from '../../helpers'
import { useProgramEnrollmentAggregate } from '../../hooks/program'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramElementProps } from '../../types/element'
import { MultiLineTruncationMixin } from '../common'
import { MultiAvatar } from '../common/Avatar'
import { CustomRatioImage } from '../common/Image'
import ProgramMarketingTag from '../common/ProgramMarketingTag'
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
const StyledExtraBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`
const ProgramPrimaryCard: React.FC<ProgramElementProps> = props => {
  const {
    loading,
    errors,
    id: programId,
    label,
    labelColorType,
    roles,
    historicalProgramPlanBuyers,
    historicalProgramPackagePlanBuyers,
  } = props
  const { settings } = useApp()
  const { data: enrolledCount } = useProgramEnrollmentAggregate(props.id || '', {
    skip:
      !props.id ||
      !props.isEnrolledCountVisible ||
      typeof historicalProgramPlanBuyers === 'number' ||
      typeof historicalProgramPackagePlanBuyers === 'number',
  })

  const programAdditionalSoldHeadcountSetting = settings['program.additional.sold.headcount'] || '[]'
  let programAdditionalSoldHeadcountSettingValue: { programId: string; count: number }[] | [] = []

  try {
    programAdditionalSoldHeadcountSettingValue = JSON.parse(programAdditionalSoldHeadcountSetting)
  } catch (err) {
    console.error('App Setting: "program.additional.sold.headcount" Error:', err)
  }

  const programAdditionalSoldHeadcount =
    (Array.isArray(programAdditionalSoldHeadcountSettingValue) &&
      programAdditionalSoldHeadcountSettingValue.length > 0 &&
      programAdditionalSoldHeadcountSettingValue.find(setting => setting?.programId === programId)?.count) ||
    0

  const enrolledCountAmount =
    historicalProgramPlanBuyers || historicalProgramPackagePlanBuyers
      ? (historicalProgramPlanBuyers ?? 0) + (historicalProgramPackagePlanBuyers ?? 0) + programAdditionalSoldHeadcount
      : enrolledCount + programAdditionalSoldHeadcount

  const programPlanSalePriceColorSetting = settings['program_plan_card.sale_price.color']?.trim()

  if (errors) {
    return <div>{JSON.stringify(errors)}</div>
  }
  return (
    <div className="program">
      <InstructorPlaceHolder>
        {loading ? (
          <MultiAvatar loading memberIdList={[]} />
        ) : (
          <Link to={!props.editing ? `/creators/${props.instructorIds[0]}?tabkey=introduction` : '#!'}>
            {roles && roles?.length > 0 ? (
              <MultiAvatar
                memberIdList={props.instructorIds || []}
                withName
                members={roles.map(role => ({
                  id: role.id,
                  name: role.member.name,
                  pictureUrl: role.member.pictureUrl,
                }))}
              />
            ) : (
              <MultiAvatar memberIdList={props.instructorIds || []} withName />
            )}
          </Link>
        )}
      </InstructorPlaceHolder>
      <StyledCard
        className={classNames('program', { 'cursor-pointer': Boolean(props.onClick) }, props.className)}
        shadowed
        onClick={props.onClick}
      >
        {loading ? (
          <Skeleton width="100%" style={{ paddingTop: 'calc(100% * 9/16)' }} />
        ) : (
          <CustomRatioImage className="cover" width="100%" ratio={9 / 16} src={props.coverUrl || EmptyCover} />
        )}

        <ProgramMarketingTag label={label} labelColorType={labelColorType} />

        <Card.Content className="content">
          {loading ? (
            <Skeleton className="mb-3" width="20" height={4} />
          ) : (
            <StyledTitle className="content__title">
              <Link to={!props.editing ? `/programs/${props.id}` : '#!'}>{props.title} </Link>
            </StyledTitle>
          )}
          <Card.Description className="description">
            {loading ? (
              <SkeletonText className="mb-3" noOfLines={Math.ceil(Math.random() * 3 + 1)} />
            ) : (
              <span className="description__abstract">{props.abstract}</span>
            )}
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
                  customStyle={
                    programPlanSalePriceColorSetting
                      ? { salePrice: { amount: { color: programPlanSalePriceColorSetting } } }
                      : undefined
                  }
                />
              ) : null}
            </div>

            {loading ? (
              <SkeletonText />
            ) : (
              <StyledExtraBlock className="extra">
                <div className="d-flex align-items-center duration">
                  <Icon className="mr-1 duration__clockIcon" as={AiOutlineClockCircle} />
                  <span className="duration__amount">{durationFormatter(props.totalDuration)}</span>
                </div>
                {props.isEnrolledCountVisible && (
                  <div className="d-flex align-items-center enrolledCount">
                    <Icon className="mr-1 enrolledCount__userIcon" as={AiOutlineUser} />
                    <span className="enrolledCount__amount">{enrolledCountAmount}</span>
                  </div>
                )}
              </StyledExtraBlock>
            )}
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
  const ComponentWithReview: React.FC<P> = props => {
    return <WrappedComponent {...props} reviews={[]}></WrappedComponent>
  }
  return ComponentWithReview
}

export default ProgramPrimaryCard
