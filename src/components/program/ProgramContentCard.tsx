import { Heading, Skeleton } from '@chakra-ui/react'
import styled from 'styled-components'
import { durationFormatter } from '../../helpers'
import EmptyCover from '../../images/empty-cover.png'
import PlayIcon from '../../images/play-circle.svg'
import TextIcon from '../../images/text.svg'
import { ProgramContentProps } from '../../types/program'
import { CustomRatioImage } from '../common/Image'
import ProgressBar from '../common/ProgressBar'
import { BREAK_POINT } from '../common/Responsive'

const StyledProgramContentCard = styled.div`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px 0 rgba(207, 207, 207, 0.55);
`

const StyledHeading = styled(Heading)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  font-weight: bold;
  font-size: 16px;
  color: #585858;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: 20px;
  }
`

const StyledDuration = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-dark);
`

const StyledName = styled.div`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`

const StyledCover = styled.div`
  position: relative;
  width: 40%;

  @media (min-width: ${BREAK_POINT}px) {
    width: 50%;
  }
`

const StyledPlayIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  transform: translate(-50%, -50%);
`

const StyledContentBackground = styled.div`
  padding-top: calc(100% * 2 / 3);
  width: 100%;
  background: ${props => props.theme['@primary-color']};
  opacity: 0.1;
`

const StyledTextIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  padding: 16px;
  background: white;
  transform: translate(-50%, -50%);
`

const StyledInfo = styled.div`
  background-color: white;
  width: 60%;

  @media (min-width: ${BREAK_POINT}px) {
    width: 50%;
  }
`

const StyledProgressBar = styled(ProgressBar)`
  .progress-bar {
    border-radius: 0 0 4px;
    height: 4px;
  }
`

const ProgramContentCard: React.FC<ProgramContentProps> = props => {
  const { loading } = props
  return (
    <StyledProgramContentCard>
      <div className="d-flex overflow-hidden">
        <StyledCover className="flex-shrink-0">
          {loading ? (
            <Skeleton width="100%" style={{ paddingTop: 'calc(100% * 9/16)' }} />
          ) : props.type === 'video' ? (
            <>
              <CustomRatioImage src={props.coverUrl || EmptyCover} ratio={2 / 3} width={'100%'} />
              <StyledPlayIcon src={PlayIcon} />
            </>
          ) : (
            <>
              <StyledContentBackground />
              <StyledTextIcon>
                <img src={TextIcon} alt="text-icon" />
              </StyledTextIcon>
            </>
          )}
        </StyledCover>
        <StyledInfo className="d-flex flex-column justify-content-between p-3">
          <StyledHeading as="h4">{loading ? '---' : props.title}</StyledHeading>
          <StyledDuration>{loading ? '---' : durationFormatter(props.duration)}</StyledDuration>
          <div className="d-none d-lg-flex">
            {/* <CustomRatioImage
              src={role.pictureUrl || EmptyCover}
              ratio={1}
              width="24px"
              shape="circle"
              className="mr-2"
            />
            <StyledName>{role.name}</StyledName> */}
          </div>
        </StyledInfo>
      </div>
      {!loading && <StyledProgressBar noPercent percent={props.progress} />}
    </StyledProgramContentCard>
  )
}

export default ProgramContentCard
