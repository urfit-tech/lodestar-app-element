import { UserComponent } from '@craftjs/core'
import { Craftize, StyledTitle } from '../../components/common'
import { CraftTitleProps } from '../../types/craft'

const CraftTitle: UserComponent<CraftTitleProps> = ({
  titleContent,
  fontSize,
  margin,
  textAlign,
  fontWeight,
  color,
}) => {
  const CraftElement = Craftize(StyledTitle)

  return (
    <CraftElement
      customStyle={{
        fontSize,
        mt: margin.mt,
        mr: margin.mr,
        mb: margin.mb,
        ml: margin.ml,
        textAlign: textAlign,
        fontWeight: fontWeight,
        color: color,
      }}
    >
      {titleContent}
    </CraftElement>
  )
}

export default CraftTitle
