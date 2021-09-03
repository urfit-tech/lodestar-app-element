import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { durationFullFormatter } from '../../helpers/index'
import EmptyCover from '../../images/empty-cover.png'
import { PodcastProgramBriefProps } from '../../types/data'
import Avatar from '../Avatar'
import Card from '../Card'
import { CustomRatioImage } from '../Image'
import PriceLabel from '../label/PriceLabel'
import Responsive, { BREAK_POINT } from '../Responsive'

const StyledContentBlock = styled.div`
  padding: 0.75rem;

  @media (min-width: ${BREAK_POINT}px) {
    padding: 1.25rem;
  }
`
const StyledCoverBlock = styled.div`
  position: relative;
`
const StyledTitle = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 1.5em;
  color: var(--gray-darker);
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;

  @media (min-width: ${BREAK_POINT}px) {
    -webkit-line-clamp: 2;
    height: 3em;
  }
`
const StyledDescription = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.4px;

  @media (min-width: ${BREAK_POINT}px) {
    line-height: 20px;

    span:first-child {
      display: inline;
    }
  }
`
const StyledDuration = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  padding: 0 0.25rem;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 12px;
  letter-spacing: 0.58px;
`
export type PodcastProgramCardProps = {
  podcastProgram: PodcastProgramBriefProps
  craftEnabled?: boolean
}

const PodcastProgramCard: React.VFC<PodcastProgramCardProps> = ({ podcastProgram, craftEnabled }) => {
  return (
    <Link to={`/podcasts/${podcastProgram.id}`} onClick={craftEnabled ? e => e.preventDefault() : undefined}>
      <Card
        customStyle={{
          direction: 'row',
          bordered: false,
          shadow: true,
          p: '0',
        }}
      >
        <StyledCoverBlock>
          <Responsive.Default>
            <CustomRatioImage width="88px" ratio={1} src={podcastProgram.coverUrl || EmptyCover} />
          </Responsive.Default>
          <Responsive.Desktop>
            <CustomRatioImage width="140px" ratio={1} src={podcastProgram.coverUrl || EmptyCover} />
          </Responsive.Desktop>
          <StyledDuration>{durationFullFormatter(podcastProgram.durationSecond)}</StyledDuration>
        </StyledCoverBlock>
        <StyledContentBlock className="flex-grow-1 d-flex flex-column justify-content-between">
          <StyledTitle>{podcastProgram.title}</StyledTitle>
          <StyledDescription className="d-flex justify-content-between align-items-center">
            <div className="d-none d-lg-flex align-items-center">
              <Avatar.Image src={podcastProgram.instructor?.avatarUrl} size={36} className="mr-2" />
              <span>{podcastProgram.instructor?.name}</span>
            </div>

            <div className="text-right">
              <PriceLabel variant="inline" listPrice={podcastProgram.listPrice} salePrice={podcastProgram.salePrice} />
            </div>
          </StyledDescription>
        </StyledContentBlock>
      </Card>
    </Link>
  )
}

export default PodcastProgramCard
