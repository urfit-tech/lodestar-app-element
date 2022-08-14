import { render } from 'mustache'
import { forwardRef, RefObject, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const StyledCertificateContainer = styled.div`
  position: relative;
  padding-top: 71%;
`
const StyledCertificateCard = styled.div<{ scale: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 1200px;
  overflow: hidden;
  white-space: nowrap;
  transform: scale(${props => props.scale});
  transform-origin: top left;
`
const _Certificate: React.VFC<{
  template: string
  templateVars?: any
  certificateRef: React.Ref<HTMLDivElement>
}> = ({ template, templateVars, certificateRef }) => {
  const [scale, setScale] = useState(0)
  const cardRef = useRef<HTMLDivElement | null>(null)

  const handleResize = useCallback(() => {
    if (certificateRef && (certificateRef as RefObject<HTMLDivElement>).current && cardRef.current) {
      setScale((certificateRef as RefObject<HTMLDivElement>).current!.offsetWidth / cardRef.current.offsetWidth)
    }
  }, [certificateRef, cardRef])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return (
    <StyledCertificateContainer ref={certificateRef}>
      <StyledCertificateCard
        ref={cardRef}
        scale={scale}
        dangerouslySetInnerHTML={{ __html: render(template, templateVars) }}
      />
    </StyledCertificateContainer>
  )
}

const CertificateImageCard = forwardRef(
  (
    props: {
      template: string
      templateVars?: any
    },
    ref: React.Ref<HTMLDivElement>,
  ) => <_Certificate {...props} certificateRef={ref} />,
)

export default CertificateImageCard
