import React from 'react'
import styled from 'styled-components'
import { ReactComponent as ArrowRightIcon } from '../images/icons/arrow-right.svg'

const StyledSlideTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: #585858;
  font-weight: bold;
  font-size: 20px;

  svg {
    margin: 0 8px;
    width: 20px;
    height: 20px;

    path {
      fill: #ff5760;
    }
  }
`

const StyledDialogBlock = styled.div`
  position: relative;
  margin-bottom: 60px;
  padding: 40px;
  background: white;
  color: #9b9b9b;
  font-size: 16px;
  line-height: 1.69;
  border-radius: 4px;
  border-bottom-left-radius: 0;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);

  &::after {
    position: absolute;
    left: -10px;
    bottom: 0;
    width: 60px;
    height: 60px;
    content: url(https://static.kolable.com/images/xuemi/dialog-pionter.svg);
    transform: translateY(99%);
  }
`

const StyledUserBlock = styled.div`
  display: flex;
  align-items: center;
  color: #585858;
  font-size: 14px;

  img {
    margin-right: 24px;
    width: 64px;
  }
  span {
    padding-bottom: 8px;
  }
`

const Dialog: React.FC<{
  title?: {
    before: string
    after: string
  }
  subtitle?: string
  description?: string
  avatarSrc?: string
  name?: string
}> = ({
  title = {
    before: '行銷',
    after: '設計實習',
  },
  description = '本身非本科生，但目前有在業界從事網頁設計實習工作。對於網頁的知識和技能都是靠高中補習遙遠的記憶和零散的自學，但一直沒有融會貫通的感覺，每個功能都只是似懂非懂，搞不太清楚“為什麼要這樣做”，無法全靠自己刻出一個完整的頁面。',
  avatarSrc = 'https://static.kolable.com/images/xuemi/storyAvatar1.png',
  name = 'Letitia',
}) => {
  return (
    <div>
      <StyledDialogBlock>
        <StyledSlideTitle>
          <span>{title['before']}</span>
          <ArrowRightIcon />
          <span>{title['after']}</span>
        </StyledSlideTitle>
        <p>{description}</p>
      </StyledDialogBlock>
      <StyledUserBlock>
        <img src={avatarSrc} alt="avatar" />
        <span>{name}</span>
      </StyledUserBlock>
    </div>
  )
}

export default Dialog
