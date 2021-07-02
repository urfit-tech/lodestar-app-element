import styled, { css } from 'styled-components'
import { ImageProps } from '../types/style'

const StyledImage = styled.img<{ customStyle: ImageProps }>`
  width: 40px;
  margin: auto;

  && {
    ${props => css`
      margin: ${props.customStyle.mt}px ${props.customStyle.mr}px ${props.customStyle.mb}px ${props.customStyle.ml}px;
      padding: ${props.customStyle.pt}px ${props.customStyle.pr}px ${props.customStyle.pb}px ${props.customStyle.pl}px;
    `}
  }
`

export default StyledImage
