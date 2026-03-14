import React from 'react'
import styled from 'styled-components'

const StyledBar = styled.div`
  border-radius: 5px;
  width: 100%;
  height: 8px;
  background-color: var(--gray-light);
  overflow: hidden;
`
const StyledProgress = styled.div<{ percent: number }>`
  width: ${props => props.percent}%;
  height: 100%;
  background-color: ${props => props.theme['@primary-color']};
`
const StyledPercent = styled.span`
  color: var(--gray-darker);
  width: 40px;
  font-size: 14px;
  line-height: 1;
  letter-spacing: 0.4px;
`
const ProgressBar: React.FC<{
  percent: number
  noPercent?: boolean
  className?: string
}> = ({ percent, noPercent, className }) => {
  return (
    <div className={`d-flex align-items-center justify-content-between ${className}`}>
      <StyledBar className="progress-bar">
        <StyledProgress percent={percent} />
      </StyledBar>
      {!noPercent && <StyledPercent className="ml-2">{percent}%</StyledPercent>}
    </div>
  )
}

export default ProgressBar
