import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { durationFormatter } from '../../helpers'
import { MultiLineTruncationMixin } from '../../helpers/style'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramBriefProps, ProgramPlanProps, ProgramRoleProps } from '../../types/data'
import MemberAvatar from '../Avatar'
import Card from '../Card'
import { CustomRatioImage } from '../Image'
import PriceLabel from '../label/priceLabel'

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

export type ProgramCardProps = {
  program: ProgramBriefProps & {
    roles: ProgramRoleProps[]
    plans: ProgramPlanProps[]
  }
}

const ProgramCard: React.VFC<ProgramCardProps> = ({ program }) => {
  const instructorId = program.roles.length > 0 && program.roles[0].memberId
  const listPrice =
    program.isSubscription && program.plans.length > 0 ? program.plans[0].listPrice : program.listPrice || 0
  const salePrice =
    program.isSubscription && program.plans.length > 0 && (program.plans[0].soldAt?.getTime() || 0) > Date.now()
      ? program.plans[0].salePrice
      : (program.soldAt?.getTime() || 0) > Date.now()
      ? program.salePrice
      : undefined
  const periodType = program.isSubscription && program.plans.length > 0 ? program.plans[0].periodType : null

  return (
    <div>
      <InstructorPlaceHolder>
        <Link to={instructorId ? `/creators/${instructorId}?tabkey=introduction` : `/creators`}>
          <MemberAvatar memberId={instructorId || ''} withName />
        </Link>
      </InstructorPlaceHolder>

      <Link to={`/programs/${program.id}/contents`}>
        <Card
          customStyle={{
            direction: 'column',
            bordered: false,
            shadow: true,
            p: '0',
          }}
        >
          <CustomRatioImage width="100%" ratio={9 / 16} src={program.coverUrl || EmptyCover} />
          <Card.ContentBlock>
            <StyledTitle>{program.title}</StyledTitle>
            <Card.Description>{program.abstract}</Card.Description>
            <Card.MetaBlock className="d-flex flex-row-reverse justify-content-between align-items-center">
              <div>
                <PriceLabel
                  variant="inline"
                  listPrice={listPrice}
                  salePrice={salePrice}
                  periodType={periodType || undefined}
                />
              </div>

              {!program.isSubscription && !!program.totalDuration && (
                <div>{durationFormatter(program.totalDuration)}</div>
              )}
            </Card.MetaBlock>
          </Card.ContentBlock>
        </Card>
      </Link>
    </div>
  )
}

export default ProgramCard
