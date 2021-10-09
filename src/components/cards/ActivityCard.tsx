import moment from 'moment'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CommonTitleMixin } from '../../helpers/style'
import { productMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as CalendarOIcon } from '../../images/icons/calendar-alt-o.svg'
import { ReactComponent as UserOIcon } from '../../images/icons/user-o.svg'
import { ActivityProps } from '../../types/data'
import Card from '../Card'
import { CustomRatioImage } from '../Image'

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

export type ActivityCardProps = {
  activity: ActivityProps
  craftEnabled?: boolean
}

const ActivityCard: React.VFC<ActivityCardProps> = ({ activity, craftEnabled }) => {
  const { formatMessage } = useIntl()

  const startDate = activity.startedAt ? moment(activity.startedAt).format('YYYY-MM-DD(dd)') : ''
  const endDate = activity.endedAt ? moment(activity.endedAt).format('YYYY-MM-DD(dd)') : ''

  return (
    <Link to={`/activities/${activity.id}`} onClick={craftEnabled ? e => e.preventDefault() : undefined}>
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
        <CustomRatioImage width="100%" ratio={9 / 16} src={activity.coverUrl || EmptyCover} />

        <Card.ContentBlock>
          <StyledTitle>{activity.title}</StyledTitle>
          <StyledMeta className="mb-2">
            {activity.isParticipantsVisible && (
              <div className="d-flex align-items-center">
                <UserOIcon />
                <span className="ml-2">
                  {formatMessage(productMessages.activity.content.remaining)}
                  {activity.participantCount && activity.totalSeats
                    ? activity.totalSeats - activity.participantCount
                    : activity.totalSeats}
                </span>
              </div>
            )}
          </StyledMeta>
          <StyledMeta className="d-flex align-items-center">
            <CalendarOIcon />
            {startDate && endDate ? (
              <span className="ml-2">
                {startDate}
                {startDate !== endDate ? ` ~ ${endDate}` : ''}
              </span>
            ) : null}
          </StyledMeta>
        </Card.ContentBlock>
      </Card>
    </Link>
  )
}

export default ActivityCard
