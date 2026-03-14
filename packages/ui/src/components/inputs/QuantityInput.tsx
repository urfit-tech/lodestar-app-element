import { Button, Input } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'

const StyledInputGroup = styled(Input.Group)`
  && {
    width: auto;
    input {
      width: 5rem;
      text-align: center;
    }
  }
`
const QuantityInput: React.FC<{
  value?: number
  min?: number
  max?: number
  isRemainQuantity?: boolean
  onChange?: (value: number | undefined) => void
}> = ({ value = 0, min = -Infinity, max = Infinity, isRemainQuantity, onChange }) => {
  const [inputValue, setInputValue] = useState(`${value}`)

  return (
    <StyledInputGroup compact>
      <Button
        icon="minus"
        onClick={() => {
          const result = value - 1 <= min ? min : value - 1
          onChange && onChange(result)
          setInputValue(`${result}`)
        }}
        disabled={min === value || (isRemainQuantity && max === 0)}
      />
      <Input
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onBlur={e => {
          const newValue = Number.isSafeInteger(parseInt(e.target.value)) ? parseInt(e.target.value) : value
          const result = newValue <= min ? min : newValue >= max ? max : newValue

          onChange && onChange(result)
          setInputValue(`${result}`)
        }}
      />
      <Button
        icon="plus"
        onClick={() => {
          const result = value + 1 >= max ? max : value + 1
          onChange && onChange(result)
          setInputValue(`${result}`)
        }}
        disabled={max === value || (isRemainQuantity && max === 0)}
      />
    </StyledInputGroup>
  )
}

export default QuantityInput
