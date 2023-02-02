import { Skeleton } from '@chakra-ui/react'
import classNames from 'classnames'
import moment from 'moment'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { productMessages } from '../../helpers/translation'
import { CalendarAltOIcon, UserOIcon } from '../../images'
import EmptyCover from '../../images/empty-cover.png'
import { ActivityElementProps } from '../../types/element'
import { CommonTitleMixin } from '../common'
import { CustomRatioImage } from '../common/Image'
import Card from './Card'

const StyledTitle = styled.div`
  ${CommonTitleMixin}
  height: 3em;
`
const StyledMeta = styled.div`
  min-height: 1.5rem;
  color: var(--black-45);
  font-size: 14px;
  letter-spacing: 0.18px;
`

const StyledCard = styled(Card)({
  flexDirection: 'column',
  border: 'none',
  boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
  padding: '0',
  backgroundColor: 'white',
  overflow: 'hidden',
})

const ActivityCard: React.FC<ActivityElementProps> = props => {
  const { loading, errors } = props
  const { formatMessage } = useIntl()

  if (errors) {
    return <div>{JSON.stringify(errors)}</div>
  }

  const startDate = !loading && props.startedAt ? moment(props.startedAt).format('YYYY-MM-DD(dd)') : ''
  const endDate = !loading && props.endedAt ? moment(props.endedAt).format('YYYY-MM-DD(dd)') : ''

  return (
    <StyledCard
      className={classNames('activity', { 'cursor-pointer': Boolean(props.onClick) }, props.className)}
      onClick={props.onClick}
    >
      {loading ? (
        <Skeleton width="100%" style={{ paddingTop: 'calc(100% * 9/16)' }} />
      ) : (
        <CustomRatioImage width="100%" ratio={9 / 16} src={props.coverUrl || EmptyCover} />
      )}

      <Card.Content>
        <StyledTitle>
          <Link to={!props.editing && !loading ? `/activities/${props.id}` : '#!'}>
            {loading ? '---' : props.title}
          </Link>
        </StyledTitle>
        <StyledMeta className="mb-2">
          {!loading && props.isParticipantsVisible && (
            <div className="d-flex align-items-center">
              <UserOIcon />
              <span className="ml-2">
                {formatMessage(productMessages.activity.content.remaining)}
                {props.participantCount && props.totalSeats
                  ? props.totalSeats - props.participantCount
                  : props.totalSeats}
              </span>
            </div>
          )}
        </StyledMeta>
        <StyledMeta className="d-flex align-items-center">
          <CalendarAltOIcon />
          {startDate && endDate ? (
            <span className="ml-2">
              {startDate}
              {startDate !== endDate ? ` ~ ${endDate}` : ''}
            </span>
          ) : null}
        </StyledMeta>
      </Card.Content>
    </StyledCard>
  )
}

export default ActivityCard
