import moment from 'moment'
import { Circle } from 'rc-progress'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { projectMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as CalendarAltOIcon } from '../../images/icons/calendar-alt-o.svg'
import { ReactComponent as UserOIcon } from '../../images/icons/user-o.svg'
import { ProjectElementProps } from '../../types/element'
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
const ProjectCard: React.FC<ProjectElementProps> = props => {
  const { loading, errors } = props
  const { formatMessage } = useIntl()
  const theme = useContext(ThemeContext)

  if (errors) {
    return <div>{JSON.stringify(errors)}</div>
  }

  return (
    <Link
      to={loading ? `#!` : `/projects/${props.id}`}
      onClick={!loading && props.editing ? e => e.preventDefault() : undefined}
    >
      <Card
        customStyle={{
          direction: 'column',
          bordered: false,
          shadow: true,
          p: '0',
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
      >
        {!loading && (
          <CustomRatioImage width="100%" ratio={9 / 16} src={props.previewUrl || props.coverUrl || EmptyCover} />
        )}
        <Card.ContentBlock>
          <Card.Title
            style={{ height: '3rem' }}
            customStyle={{ fontSize: '18', textAlign: 'left', fontWeight: 'bold', color: '' }}
            className="mb-3"
          >
            {!loading && props.title}
          </Card.Title>
          <Card.Description className="mb-3">{!loading && props.abstract}</Card.Description>
          <Card.MetaBlock className="d-flex align-items-end justify-content-between">
            <StyledCircleWrapper>
              {!loading && props.type === 'funding' && (
                <StyledPercent>
                  {!props.targetAmount
                    ? 0
                    : Math.floor(
                        ((props.targetUnit === 'participants' ? props.enrollmentCount : props.totalSales) * 100) /
                          props.targetAmount,
                      )}
                  %
                </StyledPercent>
              )}
              {!loading && props.type === 'funding' ? (
                <Circle
                  percent={
                    !props.targetAmount
                      ? 0
                      : Math.floor(
                          ((props.targetUnit === 'participants' ? props.enrollmentCount : props.totalSales) * 100) /
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
                <div className="d-flex align-items-center">
                  <UserOIcon />
                  {formatMessage(projectMessages.text.people, { count: loading ? 0 : props.enrollmentCount })}
                </div>
              ) : null}
            </StyledCircleWrapper>

            <div className="text-right">
              {!loading && props.type === 'funding' && (
                <StyledLabel>
                  {props.targetUnit === 'participants' &&
                    formatMessage(projectMessages.text.totalParticipants, { count: props.enrollmentCount })}
                  {props.targetUnit === 'funds' && <PriceLabel listPrice={props.totalSales || 0} />}
                </StyledLabel>
              )}
              {!loading && props.isCountdownTimerVisible && props.expiredAt && (
                <>
                  {moment().isAfter(props.expiredAt) ? (
                    <div className="d-flex align-items-center justify-content-end">
                      <CalendarAltOIcon className="mr-1" />
                      {props.type === 'funding'
                        ? formatMessage(projectMessages.label.isExpiredFunding)
                        : formatMessage(projectMessages.label.isExpired)}
                    </div>
                  ) : (
                    <StyledLabel className="d-flex align-items-center">
                      <CalendarAltOIcon className="mr-1" />
                      {props.type === 'funding'
                        ? formatMessage(projectMessages.text.fundingCountDownDays, {
                            days: moment(props.expiredAt).diff(new Date(), 'days'),
                          })
                        : formatMessage(projectMessages.text.preOrderCountDownDays, {
                            days: moment(props.expiredAt).diff(new Date(), 'days'),
                          })}
                    </StyledLabel>
                  )}
                </>
              )}
            </div>
          </Card.MetaBlock>
        </Card.ContentBlock>
      </Card>
    </Link>
  )
}

export default ProjectCard
