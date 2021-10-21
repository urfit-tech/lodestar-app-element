import styled, { css, keyframes } from 'styled-components'

const defaultBaseColor = 'var(--gray-light)'

const defaultHighlightColor = 'var(--gray-lighter)'

const skeletonKeyframes = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`
const skeletonStyles = css<SkeletonProps>`
  background-color: ${defaultBaseColor};
  background-image: linear-gradient(90deg, ${defaultBaseColor}, ${defaultHighlightColor}, ${defaultBaseColor});
  background-size: 200px 100%;
  background-repeat: no-repeat;
  ${props => props.height && `height:${props.height};`}
  border-radius: 4px;
  display: inline-block;
  line-height: 1;
  width: 100%;
`

type SkeletonProps = {
  active?: boolean
  loading?: boolean
  height?: string
  className?: string
  round?: boolean
  duration?: number
}

const StyledSkeleton = styled.div<SkeletonProps>`
  ${skeletonStyles}
  animation: ${skeletonKeyframes} ${props => props.duration || 1.2}s ease-in-out infinite
`

const Skeleton: React.FC<SkeletonProps> = ({ children, ...props }) => {
  return <StyledSkeleton {...props}>{children}</StyledSkeleton>
}

export default Skeleton
