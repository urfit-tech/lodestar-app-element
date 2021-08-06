import React, { useContext, useEffect, useRef, useState } from 'react'
import { SketchPicker } from 'react-color'
import { useIntl } from 'react-intl'
import styled, { ThemeContext } from 'styled-components'
import { craftPageMessages } from '../../helpers/translation'
import { StyledCraftSettingLabel, StyledUnderLineInput } from '../common'

const StyleCircleColorInput = styled.div<{ background: string }>`
  background-color: ${props => props.background};
  border-radius: 50%;
  width: 16px;
  height: 16px;
  border: 1px solid #d8d8d8;
`
const StyledSketchPicker = styled(SketchPicker)`
  width: auto !important;
`

const CraftColorPickerBlock: React.VFC<{
  value?: string
  onChange?: (value: string) => void
}> = ({ value, onChange }) => {
  const { formatMessage } = useIntl()
  const theme = useContext(ThemeContext)
  const [visible, setVisible] = useState(false)
  const sketchPickerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sketchPickerRef.current && !sketchPickerRef.current.contains(e.target as Node)) {
        setVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [sketchPickerRef])

  return (
    <>
      <StyledCraftSettingLabel>{formatMessage(craftPageMessages.label.color)}</StyledCraftSettingLabel>
      <StyledUnderLineInput
        className="mb-3"
        bordered={false}
        value={value}
        onClick={() => setVisible(true)}
        onChange={e => onChange?.(e.target.value)}
      />

      <div className="d-flex mb-3">
        <StyleCircleColorInput
          background={theme['@primary-color'] || '#e1614b'}
          onClick={() => onChange?.(theme['@primary-color'] || '#e1614b')}
        />
        <StyleCircleColorInput className="ml-2" background="#585858" onClick={() => onChange?.('#585858')} />
        <StyleCircleColorInput className="ml-2" background="#ffffff" onClick={() => onChange?.('#ffffff')} />
      </div>
      {visible && (
        <div ref={sketchPickerRef}>
          <StyledSketchPicker className="mb-3" color={value} onChange={e => onChange?.(e.hex)} />
        </div>
      )}
    </>
  )
}

export default CraftColorPickerBlock
