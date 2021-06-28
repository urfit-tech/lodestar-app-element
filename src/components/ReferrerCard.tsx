import React from 'react'
import styled from 'styled-components'
import { CardProps, ParagraphProps, TitleProps } from '../types/style'
import { generateCustomCardStyle, generateCustomTitleStyle, StyledParagraph } from './common'

const StyledAvatar = styled.img<{ size?: number }>`
  display: block;
  margin: 0 auto 0.75rem;
  width: ${props => props.size || 56}px;
  height: ${props => props.size || 56}px;
  border-radius: 50%;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  object-fit: cover;
  object-position: center;
`

const StyledReferrerBlock = styled.div<{ customStyle: CardProps }>`
  padding: 0 2rem;
  line-height: 1.57;
  letter-spacing: 0.18px;

  && {
    ${generateCustomCardStyle}
  }
`

const StyledSubTitle = styled.h3<{ customStyle: TitleProps }>`
  margin-bottom: 0.75rem;
  font-size: 16px;
  text-align: center;

  && {
    ${generateCustomTitleStyle}
  }
`

const Referrer: React.FC<{
  avatarSrc?: string
  name?: string
  title?: string
  description?: string
  customStyle: {
    title: TitleProps
    paragraph: ParagraphProps
    card: CardProps
  }
}> = ({
  avatarSrc = 'https://static.kolable.com/images/sixdigital/referrer-1.jpg',
  name = '陳慕天',
  title = '共同創辦人',
  description = '設計，是這個世代必備的溝通手段，很高興看到一個源自網路社群的設計學院誕生！',
  customStyle,
}) => {
  return (
    <StyledReferrerBlock customStyle={customStyle.card}>
      {avatarSrc && <StyledAvatar src={avatarSrc} alt="referrer" />}
      <div className="mb-3 text-center">{name}</div>
      <StyledSubTitle customStyle={customStyle.title}>{title}</StyledSubTitle>
      <StyledParagraph customStyle={customStyle.paragraph} style={{ textAlign: 'justify' }}>
        {description}
      </StyledParagraph>
    </StyledReferrerBlock>
  )
}

export default Referrer
