import { Box, useRadio, UseRadioProps } from '@chakra-ui/react'
import { useAppTheme } from '../../contexts/AppThemeContext'

const RadioCard: React.FC<
  {
    size?: 'xs' | 'sm' | 'md' | 'lg'
    children: React.ReactNode
  } & UseRadioProps
> = ({ size, children, ...props }) => {
  const theme = useAppTheme()
  const { getInputProps, getCheckboxProps } = useRadio(props)
  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderColor="#d8d8d8"
        borderWidth="1px"
        borderRadius="md"
        _checked={{
          bg: `${theme.colors.primary[500]}`,
          color: 'white',
          borderColor: `${theme.colors.primary[500]}`,
        }}
        px={size === 'xs' ? 2 : size === 'sm' ? 3 : size === 'md' ? 4 : size === 'lg' ? 6 : 4}
        h={size === 'xs' ? 6 : size === 'sm' ? 8 : size === 'md' ? 10 : size === 'lg' ? 12 : 10}
        lineHeight={size === 'xs' ? 6 : size === 'sm' ? 8 : size === 'md' ? 10 : size === 'lg' ? 12 : 10}
        textAlign="center"
      >
        {children}
      </Box>
    </Box>
  )
}

export default RadioCard
