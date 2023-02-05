import { Skeleton, SkeletonText } from '@chakra-ui/skeleton'
import moment from 'moment'
import { Circle } from 'rc-progress'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { projectMessages } from '../../helpers/translation'
import { CalendarAltOIcon, UserOIcon } from '../../images'
import EmptyCover from '../../images/empty-cover.png'
import PlayIcon from '../../images/play-fill.svg'
import { ProjectElementProps } from '../../types/element'
import { MultiAvatar } from '../common/Avatar'
import { CustomRatioImage } from '../common/Image'
import PriceLabel from '../labels/PriceLabel'
import Card from './Card'

const StyledLabel = styled.div`
  color: ${props => props.theme['@primary-color']};
`
const StyledCircleWrapper = styled.div`
  position: relative;
`
const StyledPercent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  color: var(--gray-darker);
`
const InstructorPlaceHolder = styled.div`
  margin-bottom: 1rem;
  height: 2rem;
`

const StyledPlayIcon = styled.img`
  position: absolute;
  top: 0%;
  right: 0%;
  width: 40px;
  transform: translate(-50%, 50%);
`
const StyledCover = styled.div`
  width: 100%;
  position: relative;
`

const ProjectCard: React.FC<ProjectElementProps> = props => {
  const history = useHistory()
  const { loading, errors } = props
  const { formatMessage } = useIntl()
  const theme = useContext(ThemeContext)

  if (errors) {
    return <div>{JSON.stringify(errors)}</div>
  }

  const TitleElement = ({ style }: { style?: React.CSSProperties }) => (
    <Card.Title
      style={{
        fontSize: '18',
        textAlign: 'left',
        fontWeight: 'bold',
        color: '',
        ...style,
      }}
      className="content__title"
    >
      {loading ? (
        <Skeleton height={4} width={100} />
      ) : (
        <Link to={loading ? `#!` : `/projects/${props.id}`}>{props.title}</Link>
      )}
    </Card.Title>
  )

  return (
    <div
      onClick={e => {
        !loading ? (props.editing ? e.preventDefault() : history.push(`/projects/${props.id}`)) : history.push(`#!`)
      }}
    >
      <Card className={`project ${props.className}`}>
        <StyledCover>
          <CustomRatioImage
            className="cover"
            width="100%"
            ratio={9 / 16}
            shape="rounded"
            src={loading ? EmptyCover : props.previewUrl || props.coverUrl || EmptyCover}
          />
          {props.type === 'portfolio' && props.coverType === 'video' && <StyledPlayIcon src={PlayIcon} />}
        </StyledCover>
        {props.type === 'portfolio' && (
          <TitleElement
            style={{
              alignSelf: 'start',
              marginBottom: '0.75rem',
              marginTop: '1.125rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          />
        )}
        {props.type !== 'portfolio' && (
          <Card.Content className="content">
            <TitleElement
              style={{
                height: '3rem',
                marginBottom: '1rem',
              }}
            />
            <Card.Description className="mb-3 description">
              {loading ? (
                <SkeletonText noOfLines={5} />
              ) : (
                <span className="description__abstract">{props.abstract}</span>
              )}
            </Card.Description>
            <Card.MetaBlock className="metadata d-flex align-items-end justify-content-between">
              <StyledCircleWrapper className="targetLeft">
                {!loading && props.type === 'funding' && (
                  <StyledPercent className="percent">
                    <span className="percent__amount">
                      {!props.targetAmount
                        ? 0
                        : Math.floor(
                            (((props.targetUnit === 'participants' ? props.enrollmentCount : props.totalSales) || 0) *
                              100) /
                              props.targetAmount,
                          )}
                    </span>
                    <span className="percent__unit">%</span>
                  </StyledPercent>
                )}
                {!loading && props.type === 'funding' ? (
                  <Circle
                    className="target__circle"
                    percent={
                      !props.targetAmount
                        ? 0
                        : Math.floor(
                            (((props.targetUnit === 'participants' ? props.enrollmentCount : props.totalSales) || 0) *
                              100) /
                              props.targetAmount,
                          )
                    }
                    style={{ width: 50 }}
                    trailWidth={12}
                    trailColor="#ececec"
                    strokeWidth={12}
                    strokeColor={theme['@primary-color']}
                  />
                ) : !loading && props.isParticipantsVisible ? (
                  <div className="d-flex align-items-center participants">
                    <UserOIcon className="participants__userIcon" />
                    <span className="participants__enrollmentCount">
                      {formatMessage(projectMessages.text.people, { count: loading ? 0 : props.enrollmentCount })}
                    </span>
                  </div>
                ) : null}
              </StyledCircleWrapper>

              <div className="text-right targetRight">
                {loading && <Skeleton height={4} width={20} />}
                {!loading && props.type === 'funding' && (
                  <StyledLabel className="participants">
                    {props.targetUnit === 'participants' && (
                      <span className="participants__totalParticipantsText">
                        {formatMessage(projectMessages.text.totalParticipants, { count: props.enrollmentCount })}
                      </span>
                    )}
                    {props.targetUnit === 'funds' && <PriceLabel listPrice={props.totalSales || 0} />}
                  </StyledLabel>
                )}
                {!loading && props.isCountdownTimerVisible && props.expiredAt && (
                  <>
                    {moment().isAfter(props.expiredAt) ? (
                      <div className="d-flex align-items-center justify-content-end expiredDate">
                        <CalendarAltOIcon className="mr-1" />
                        {props.type === 'funding' ? (
                          <span className="expiredDate__isExpiredFundingText">
                            {formatMessage(projectMessages.label.isExpiredFunding)}
                          </span>
                        ) : (
                          <span className="expiredDate__isExpiredText">
                            {formatMessage(projectMessages.label.isExpired)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <StyledLabel className="d-flex align-items-center countDownDays">
                        <CalendarAltOIcon className="mr-1 countDownDays__calendarIcon" />
                        {props.type === 'funding' ? (
                          <span className="countDownDays__fundingCountDownDaysText">
                            {formatMessage(projectMessages.text.fundingCountDownDays, {
                              days: moment(props.expiredAt).diff(new Date(), 'days'),
                            })}
                          </span>
                        ) : (
                          <span className="countDownDays__preOrderCountDownDaysText">
                            {formatMessage(projectMessages.text.preOrderCountDownDays, {
                              days: moment(props.expiredAt).diff(new Date(), 'days'),
                            })}
                          </span>
                        )}
                      </StyledLabel>
                    )}
                  </>
                )}
              </div>
            </Card.MetaBlock>
          </Card.Content>
        )}
      </Card>
      {props.type === 'portfolio' && (
        <InstructorPlaceHolder>
          {loading ? (
            <MultiAvatar loading memberIdList={[]} />
          ) : (
            <Link to={!props.editing ? `/creators/${props.authorId}?tabkey=introduction` : '#!'}>
              <MultiAvatar memberIdList={props.authorId ? [props.authorId] : []} withName />
            </Link>
          )}
        </InstructorPlaceHolder>
      )}
    </div>
  )
}

export default ProjectCard
