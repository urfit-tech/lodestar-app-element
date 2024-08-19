import { Button, ButtonProps } from '@chakra-ui/react'
import { AxiosPromise } from 'axios'
import React, { useState } from 'react'

export const FetchButton: React.FC<
  {
    fetcher: () => AxiosPromise | Promise<any>
    setResult?: React.Dispatch<React.SetStateAction<object>>
    setError?: React.Dispatch<React.SetStateAction<unknown>>
    afterFetch?: Function
  } & ButtonProps
> = ({ fetcher, setResult, setError, afterFetch, ...props }) => {
  const [isLoading, setIsLoading] = useState(false)
  const handleClick = async () => {
    setIsLoading(true)
    try {
      setIsLoading(true)
      const data = await fetcher()
      if (setResult) setResult(data)
      setIsLoading(false)
      if (afterFetch) afterFetch(data)
    } catch (e) {
      if (setError) setError(e)
    }
  }
  return (
    <Button isLoading={isLoading} onClick={handleClick} {...props}>
      {props.children}
    </Button>
  )
}
