import { Input } from 'antd'
import { range } from 'ramda'
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
            value={(new Set(value?.toString().split(';') || []).size === 1 && Number(boxModelValue?.[0])) || 0}
            onChange={(v: number) => onChange?.(`${v};${v};${v};${v}`)}
          />
        </div>
        <Input
          className="col-4"
          value={`${boxModelValue?.[0]};${boxModelValue?.[1]};${boxModelValue?.[2]};${boxModelValue?.[3]}`}
          onChange={e => {
            const eventBoxModelValue = formatBoxModelValue(e.target.value)
            onChange?.(
              `${range(0, 4)
                .map(index => (isNaN(eventBoxModelValue?.[index] || 0) ? eventBoxModelValue?.[index] || 0 : 0))
                .join(';')}`,
            )
          }}
        />
      </div>
    </>
  )
}

export const formatBoxModelValue = (value?: string) => {
  return value?.toString().split(';').map(Number)
}

export default CraftBoxModelInput
