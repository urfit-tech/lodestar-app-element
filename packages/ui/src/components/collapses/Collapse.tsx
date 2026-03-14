import { useState } from 'react'
import styled, { css } from 'styled-components'
import { ReactComponent as AngleRightIcon } from '../../images/icons/angle-right.svg'
import { ElementComponent } from '../../types/element'
import Paragraph from '../common/Paragraph'

const StyledAction = styled.div<{ isActive: boolean }>`
  font-size: 20px;
  ${props =>
    props.isActive &&
    css`
      transform: rotate(90deg);
    `};
  color: var(--gray);
  transition: transform 0.3s ease-in-out;
`

const StyledTitle = styled.h3`
  line-height: 1.5;
`

const StyledParagraph = styled(Paragraph)<{ isActive: boolean }>`
  margin-top: 1.25rem;
  display: ${props => (props.isActive ? 'block' : `none`)};
`

const StyledCollapseHeader = styled.header`
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
  cursor: pointer;
  line-height: 1;
`

const StyledCollapse = styled.article<{ isActive?: boolean }>`
  margin-bottom: 1.5rem;
  border-radius: 4px;
  padding: 1.25rem;
  overflow: hidden;
  background-color: var(--gray-lighter);
`

export type CollapseProps = {
  list: {
    title: string
    description: string
  }[]
  accordion?: boolean
}
const Collapse: ElementComponent<CollapseProps> = props => {
  const [activeIndex, setActiveIndex] = useState(0)
  if (props.loading || props.errors) {
    return null
  }
  return (
    <div>
      {props.list.map((v, i) => (
        <StyledCollapse key={v.title + i} className={props.className} isActive={activeIndex === i}>
          <StyledCollapseHeader
            onClick={() => setActiveIndex(i)}
            className="d-flex justify-content-between align-items-center"
          >
            <StyledTitle className="title">{v.title}</StyledTitle>
            <StyledAction isActive={activeIndex === i}>
              <AngleRightIcon />
            </StyledAction>
          </StyledCollapseHeader>
          <StyledParagraph className="paragraph" isActive={activeIndex === i}>
            {v.description}
          </StyledParagraph>
        </StyledCollapse>
      ))}
    </div>
  )
}

export default Collapse
