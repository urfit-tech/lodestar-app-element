import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import DefaultAvatar from '../images/icons/avatar.svg'
import { ParagraphProps, TitleProps } from '../types/style'
import { generateCustomParagraphStyle, generateCustomTitleStyle } from './common'

const StyledInstructorBlock = styled.div`
  padding: 1rem;
`
const StyledAvatar = styled.img<{ size?: number }>`
  overflow: hidden;
  background: #ccc;
  display: block;
  margin: 0 auto 0.75rem;
  width: ${props => props.size || 56}px;
  height: ${props => props.size || 56}px;
  border-radius: 50%;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  object-fit: cover;
  object-position: center;
`
const StyledSubTitle = styled.h2<{ customStyle?: TitleProps }>`
  color: var(--gray-darker);
  text-align: center;
  font-size: 24px;
  margin-bottom: 8px;
  font-weight: bold;
  line-height: 1.3;
  letter-spacing: 0.77;
  font-weight: ${props =>
    props.customStyle &&
    (props.customStyle.fontWeight === 'bold'
      ? 800
      : props.customStyle.fontWeight === 'normal'
      ? 500
      : props.customStyle.fontWeight === 'lighter'
      ? 200
      : 500)};

  && {
    ${generateCustomTitleStyle}
  }
`
const StyledDescription = styled.div<{ customStyle?: ParagraphProps }>`
  font-size: 14px;
  font-weight: ${props =>
    props.customStyle &&
    (props.customStyle.fontWeight === 'bold'
      ? 800
      : props.customStyle.fontWeight === 'normal'
      ? 500
      : props.customStyle.fontWeight === 'lighter'
      ? 200
      : 500)};
  line-height: 1;
  letter-spacing: 0.2px;
  max-width: 190px;
  text-align: center;
  margin: 0 auto;
  max-height: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 8;
  && {
    ${generateCustomParagraphStyle}
  }
`
const StyledAbstract = styled(StyledDescription)`
  color: #a9a9a9;
  line-height: 1.5;
  font-weight: ${props =>
    props.customStyle &&
    (props.customStyle.fontWeight === 'bold'
      ? 800
      : props.customStyle.fontWeight === 'normal'
      ? 500
      : props.customStyle.fontWeight === 'lighter'
      ? 200
      : 500)};
`

const Instructor: React.FC<{
  id: string | null
  name: string | null
  abstract: string | null
  description: string | null
  avatarUrl: string | null
  isShowDescription?: boolean
  customStyle?: {
    subTitle?: TitleProps
    abstract?: ParagraphProps
    description?: ParagraphProps
  }
}> = ({ id, name, abstract, description, avatarUrl, isShowDescription, customStyle }) => {
  return (
    <StyledInstructorBlock key={id}>
      <Link to={`/creators/${id}`}>
        <div className="mb-4">
          <StyledAvatar
            src={avatarUrl !== null ? avatarUrl : DefaultAvatar}
            alt={name || ''}
            className="mx-auto"
            size={128}
          />
        </div>
        <StyledSubTitle customStyle={customStyle?.subTitle}>{name}</StyledSubTitle>
        <StyledAbstract customStyle={customStyle?.abstract}>{abstract}</StyledAbstract>
        {isShowDescription && (
          <StyledDescription className="mt-3" customStyle={customStyle?.description}>
            {description}
          </StyledDescription>
        )}
      </Link>
    </StyledInstructorBlock>
  )
}

export default Instructor
