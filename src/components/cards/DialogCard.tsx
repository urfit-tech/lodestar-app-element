import styled from 'styled-components'
import { ElementComponent } from '../../types/element'
import Paragraph from '../common/Paragraph'

const StyledSlideTitle = styled.h3`
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

const Dialog: ElementComponent<{
  title?: string
  description?: string
  avatarSrc?: string
  name?: string
}> = ({
  title = '行銷',
  description = '本身非本科生，但目前有在業界從事網頁設計實習工作。對於網頁的知識和技能都是靠高中補習遙遠的記憶和零散的自學，但一直沒有融會貫通的感覺，每個功能都只是似懂非懂，搞不太清楚“為什麼要這樣做”，無法全靠自己刻出一個完整的頁面。',
  avatarSrc = 'https://static.kolable.com/images/xuemi/storyAvatar1.png',
  name = 'Letitia',
  className,
}) => {
  return (
    <div>
      <StyledDialogBlock className={className}>
        <StyledSlideTitle className="title">
          <span>{title}</span>
        </StyledSlideTitle>
        <Paragraph className="paragraph" content={description}></Paragraph>
      </StyledDialogBlock>
      <StyledUserBlock>
        <img src={avatarSrc} alt="avatar" />
        <span>{name}</span>
      </StyledUserBlock>
    </div>
  )
}

export default Dialog
