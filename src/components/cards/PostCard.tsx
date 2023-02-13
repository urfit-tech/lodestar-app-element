import { Icon } from '@chakra-ui/icons'
import { Skeleton } from '@chakra-ui/skeleton'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { desktopViewMixin } from '../../helpers'
import { CalendarAltOIcon, PlayCircleIcon, UserOIcon } from '../../images'
import EmptyCover from '../../images/empty-cover.png'
import { PostElementProps } from '../../types/element'
import { CustomRatioImage } from '../common/Image'

const StyledCover = styled.div`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
`
const StyledVideoIconBlock = styled.div<{ variant?: 'featuring' | 'popular' | 'list-item' }>`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem;
  font-size: 1.5rem;
  line-height: 1;

  ${props =>
    props.variant === 'featuring'
      ? css`
          padding: 0.75rem;
        `
      : props.variant === 'popular'
      ? css`
          font-size: 1rem;
        `
      : ''}
`
const StyledPostTitle = styled.div<{ rows?: number }>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${props => props.rows || 1};
  margin-bottom: 4px;
  overflow: hidden;
  width: 100%;
  height: calc(${props => props.rows || 1} * 1.5em);
  color: var(--gray-darker);
  font-size: 16px;
  letter-spacing: 0.2px;

  &.headline,
  &.featuring {
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 0.77px;
    margin-bottom: 4px;
  }
  &.list-item {
    -webkit-line-clamp: 2;
    font-size: 16px;
    font-weight: bold;
  }

  ${desktopViewMixin(css`
    font-weight: bold;

    &.headline {
      font-size: 20px;
      font-weight: bold;
      color: white;
    }
    &.featuring {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
      color: white;
    }
    &.list-item {
      min-height: 1.5em;
      font-size: 20px;
    }
  `)}
`
const StyledPostMeta = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;

  i,
  span {
    line-height: 20px;
  }

  ${desktopViewMixin(css`
    > div {
      display: inline;
    }
  `)}
`

const PostCard: React.VFC<PostElementProps> = props => {
  const { loading, errors } = props

  if (errors) {
    return <div>{JSON.stringify(errors)}</div>
  }
  if (loading) {
    return <Skeleton width="100%" style={{ paddingTop: 'calc(100% * 9/16)' }} />
  }
  return (
    <Link to={!props.editing ? `/posts/${props.codeName || props.id}` : '#!'}>
      <div className="mb-3">
        <PostPreviewCover coverUrl={props.coverUrl || EmptyCover} withVideo={typeof props.videoUrl === 'string'} />
      </div>
      <StyledPostTitle rows={2}>{props.title}</StyledPostTitle>
      <PostPreviewMeta author={props.author} publishedAt={props.publishedAt} />
    </Link>
  )
}

const PostPreviewCover: React.VFC<{
  coverUrl: string
  withVideo?: boolean
  variant?: 'featuring' | 'popular' | 'list-item'
}> = ({ coverUrl, withVideo, variant }) => {
  return (
    <StyledCover>
      {withVideo ? (
        <StyledVideoIconBlock variant={variant}>
          <Icon as={PlayCircleIcon} />
        </StyledVideoIconBlock>
      ) : null}
      <CustomRatioImage width="100%" ratio={variant === 'list-item' ? 2 / 3 : 9 / 16} src={coverUrl || EmptyCover} />
    </StyledCover>
  )
}

const PostPreviewMeta: React.VFC<{
  author: { id: string; name: string }
  publishedAt: Date | null
}> = ({ author, publishedAt }) => {
  return (
    <StyledPostMeta>
      <div className="mb-1">
        <Icon as={UserOIcon} className="mr-1" style={{ display: 'inline-block' }} />
        <span className="mr-2">{author.name}</span>
      </div>
      <div className="mb-1">
        <Icon as={CalendarAltOIcon} className="mr-1" style={{ display: 'inline-block' }} />
        <span>{publishedAt ? dayjs(publishedAt).format('YYYY-MM-DD') : ''}</span>
      </div>
    </StyledPostMeta>
  )
}

export default PostCard
