import moment from 'moment'
import { Circle } from 'rc-progress'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import { projectMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as CalendarAltOIcon } from '../../images/icons/calendar-alt-o.svg'
import { ReactComponent as UserOIcon } from '../../images/icons/user-o.svg'
import { ProjectBasicProps } from '../../types/data'
import Card from '../Card'
import { CustomRatioImage } from '../Image'
import PriceLabel from '../label/PriceLabel'

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
export type ProjectCardProps = {
  project: ProjectBasicProps
}

const ProjectCard: React.VFC<ProjectCardProps> = ({ project }) => {
  const { formatMessage } = useIntl()
  const theme = useContext(ThemeContext)

  return (
    <Link to={`/projects/${project.id}`}>
      <Card
        customStyle={{
          direction: 'column',
          bordered: false,
          shadow: true,
          p: '0',
        }}
      >
        <CustomRatioImage width="100%" ratio={9 / 16} src={project.previewUrl || project.coverUrl || EmptyCover} />
        <Card.ContentBlock>
          <Card.Title
            style={{ height: '3rem' }}
            customStyle={{ fontSize: '18', textAlign: 'left', fontWeight: 'bold', color: '' }}
            className="mb-3"
          >
            {project.title}
          </Card.Title>
          <Card.Description className="mb-3">{project.abstract}</Card.Description>
          <Card.MetaBlock className="d-flex align-items-end justify-content-between">
            <StyledCircleWrapper>
              {project.type === 'funding' && (
                <StyledPercent>
                  {!project.targetAmount
                    ? 0
                    : Math.floor(
                        ((project.targetUnit === 'participants' ? project.enrollmentCount : project.totalSales) * 100) /
                          project.targetAmount,
                      )}
                  %
                </StyledPercent>
              )}
              {project.type === 'funding' ? (
                <Circle
                  percent={
                    !project.targetAmount
                      ? 0
                      : Math.floor(
                          ((project.targetUnit === 'participants' ? project.enrollmentCount : project.totalSales) *
                            100) /
                            project.targetAmount,
                        )
                  }
                  style={{ width: 50 }}
                  trailWidth={12}
                  trailColor="#ececec"
                  strokeWidth={12}
                  strokeColor={theme['@primary-color']}
                />
              ) : project.isParticipantsVisible ? (
                <div className="d-flex align-items-center">
                  <UserOIcon />
                  {formatMessage(projectMessages.text.people, { count: project.enrollmentCount })}
                </div>
              ) : null}
            </StyledCircleWrapper>

            <div className="text-right">
              {project.type === 'funding' && (
                <StyledLabel>
                  {project.targetUnit === 'participants' &&
                    formatMessage(projectMessages.text.totalParticipants, { count: project.enrollmentCount })}
                  {project.targetUnit === 'funds' && <PriceLabel listPrice={project.totalSales || 0} />}
                </StyledLabel>
              )}
              {project.isCountdownTimerVisible && project.expiredAt && (
                <>
                  {moment().isAfter(project.expiredAt) ? (
                    <div className="d-flex align-items-center justify-content-end">
                      <CalendarAltOIcon className="mr-1" />
                      {project.type === 'funding'
                        ? formatMessage(projectMessages.label.isExpiredFunding)
                        : formatMessage(projectMessages.label.isExpired)}
                    </div>
                  ) : (
                    <StyledLabel className="d-flex align-items-center">
                      <CalendarAltOIcon className="mr-1" />
                      {project.type === 'funding'
                        ? formatMessage(projectMessages.text.fundingCountDownDays, {
                            days: moment(project.expiredAt).diff(new Date(), 'days'),
                          })
                        : formatMessage(projectMessages.text.preOrderCountDownDays, {
                            days: moment(project.expiredAt).diff(new Date(), 'days'),
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
