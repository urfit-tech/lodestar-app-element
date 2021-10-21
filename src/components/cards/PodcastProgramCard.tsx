import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { durationFullFormatter } from '../../helpers/index'
import EmptyCover from '../../images/empty-cover.png'
import { PodcastProgramElementProps } from '../../types/element'
import Avatar from '../common/Avatar'
import { CustomRatioImage } from '../common/Image'
import Responsive, { BREAK_POINT } from '../common/Responsive'
import PriceLabel from '../labels/PriceLabel'
import Card from './Card'

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

const PodcastProgramCard: React.VFC<PodcastProgramElementProps> = props => {
  const { loading, errors } = props
  if (errors) {
    return <div>{JSON.stringify(errors)}</div>
  }
  return (
    <Link
      to={loading ? `#!` : `/podcasts/${props.id}`}
      onClick={!loading && props.editing ? e => e.preventDefault() : undefined}
    >
      <Card
        customStyle={{
          direction: 'row',
          bordered: false,
          shadow: true,
          p: '0',
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
      >
        <StyledCoverBlock>
          <Responsive.Default>
            <CustomRatioImage width="88px" ratio={1} src={(!loading && props.coverUrl) || EmptyCover} />
          </Responsive.Default>
          <Responsive.Desktop>
            <CustomRatioImage width="140px" ratio={1} src={(!loading && props.coverUrl) || EmptyCover} />
          </Responsive.Desktop>
          <StyledDuration>{!loading && durationFullFormatter(props.durationSecond)}</StyledDuration>
        </StyledCoverBlock>
        <StyledContentBlock className="flex-grow-1 d-flex flex-column justify-content-between">
          <StyledTitle>{!loading && props.title}</StyledTitle>
          <StyledDescription className="d-flex justify-content-between align-items-center">
            <div className="d-none d-lg-flex align-items-center">
              {!loading && <Avatar.Image src={props.instructor?.avatarUrl} size={36} className="mr-2" />}
              <span>{!loading && props.instructor?.name}</span>
            </div>

            <div className="text-right">
              {!loading && (
                <PriceLabel
                  variant="inline"
                  listPrice={props.listPrice || props.currentPrice}
                  salePrice={props.currentPrice}
                />
              )}
            </div>
          </StyledDescription>
        </StyledContentBlock>
      </Card>
    </Link>
  )
}

export default PodcastProgramCard
