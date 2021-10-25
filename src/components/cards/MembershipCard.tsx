import { render } from 'mustache'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import DefaultAvatar from '../../images/avatar.svg'

const StyledContainer = styled.div`
  position: relative;
  padding-top: 62.5%;
`
const StyledMembershipCard = styled.div<{ scale: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 400px;
  overflow: hidden;
  white-space: nowrap;
  transform: scale(${props => props.scale});
  transform-origin: top left;
`

const MembershipCard: React.VFC<{
  template: string
  templateVars?: any
}> = ({ template, templateVars }) => {
  const [scale, setScale] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)

  if (templateVars && !templateVars.avatar) {
    templateVars.avatar = DefaultAvatar
  }

  const handleResize = useCallback(() => {
    if (containerRef.current && cardRef.current) {
      setScale(containerRef.current.offsetWidth / cardRef.current.offsetWidth)
    }
  }, [containerRef, cardRef])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return (
    <StyledContainer ref={containerRef}>
      <StyledMembershipCard
        ref={cardRef}
        scale={scale}
        dangerouslySetInnerHTML={{ __html: render(template, templateVars) }}
      />
    </StyledContainer>
  )
}

export default MembershipCard
