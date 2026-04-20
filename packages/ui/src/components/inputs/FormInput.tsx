import { Icon } from '@chakra-ui/icons'
import { Input as ChakraInput, InputGroup, InputProps, InputRightElement } from '@chakra-ui/react'
import React from 'react'
import styled, { css } from 'styled-components'
import CheckCircleIcon from '../../images/checked-circle.svg?react'
import ExclamationCircleIcon from '../../images/exclamation-circle.svg?react'

const StyledInput = styled(ChakraInput as any)<{ isSuccess: true }>`
  && {
    ${props =>
      props.isSuccess &&
      css`
        border-color: var(--success);
        box-shadow: 0 0 0 1px var(--success);
      `}
  }
`
const StyledInputRightElement = styled(InputRightElement as any)<{ status: 'error' | 'success' }>`
  && {
    font-size: 20px;
    ${props =>
      props.status === 'success' &&
      css`
        color: var(--success);
      `}
    ${props =>
      props.status === 'error' &&
      css`
        color: var(--error);
      `}
  }
`

const FormInput: React.FC<
  {
    status?: 'error' | 'validating' | 'success'
  } & InputProps
> = ({ status, ...inputProps }) => {
  const icon = {
    success: CheckCircleIcon,
    error: ExclamationCircleIcon,
    validating: undefined,
  }

  return (
    <InputGroup>
      <StyledInput
        isInvalid={status === 'error'}
        isDisabled={status === 'validating'}
        isSuccess={status === 'success'}
        focusBorderColor="primary.500"
        errorBorderColor="danger.500"
        {...inputProps}
      />
      {status && icon[status] && <StyledInputRightElement status={status} children={<Icon as={icon[status]} />} />}
    </InputGroup>
  )
}

export { FormInput }
