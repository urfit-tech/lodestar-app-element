import { Input } from 'antd'
import { range, repeat } from 'ramda'
import React from 'react'
import { StyledCraftSettingLabel, StyledCraftSlider } from '../common'

const CraftBoxModelInput: React.VFC<{
  title?: string
  value?: string
  onChange?: (value: string) => void
}> = ({ title, value, onChange }) => {
  const boxModelValue = formatBoxModelValue(value)

  return (
    <>
      {title && <StyledCraftSettingLabel>{title}</StyledCraftSettingLabel>}
      <div className="col-12 d-flex justify-content-center align-items-center p-0">
        <div className="col-8 p-0">
          <StyledCraftSlider
            min={0}
            value={new Set(boxModelValue).size === 1 ? Number(boxModelValue[0]) : 0}
            onChange={(v: number) => onChange?.(`${repeat(v, 4).join(';')}`)}
          />
        </div>
        <Input
          className="col-4"
          value={value}
          onBlur={e => {
            const eventBoxModelValue = formatBoxModelValue(e.target.value)
            onChange?.(`${eventBoxModelValue?.join(';')}`)
          }}
          onChange={e => onChange?.(e.target.value)}
        />
      </div>
    </>
  )
}

export const formatBoxModelValue = (value?: string) => {
  const slices = value?.split(';') || []
  return range(0, 4).map(index => Number(slices[index]) || 0)
}

export default CraftBoxModelInput
