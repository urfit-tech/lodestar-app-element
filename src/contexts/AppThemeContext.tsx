import paletteGenerator from '@bobthered/tailwindcss-palette-generator'
import { ChakraProvider, extendTheme, ThemeOverride, useTheme } from '@chakra-ui/react'
import { mergeDeepRight } from 'ramda'
import { ThemeProvider } from 'styled-components'
import '../styles.scss'
import { useApp } from './AppContext'

export const AppThemeProvider: React.FC<{ extendChakraTheme?: ThemeOverride }> = ({
  extendChakraTheme = {},
  children,
}) => {
  const { settings } = useApp()

  const theme = extendTheme(
    mergeDeepRight(
      {
        components: {
          Button: {
            baseStyle: {
              fontWeight: '400',
              borderRadius: '2px',
              _focus: {
                boxShadow: '0',
              },
            },
            variants: {
              primary: {
                background: 'primary.500',
                color: '#ffffff',
                _hover: {
                  background: 'primary.300',
                },
              },
              secondary: {
                background: 'secondary.500',
                color: '#ffffff',
                _hover: {
                  background: 'secondary.300',
                },
              },
              outline: (props: { colorScheme: string }) => ({
                border: 'solid 1px',
                borderColor: 'var(--gray)',
                color: '#585858',
                _hover: {
                  background: 'transparent',
                  borderColor: props.colorScheme
                    ? `${props.colorScheme}`
                    : settings['theme.@primary-color'] || '#000000',
                  color: props.colorScheme ? `${props.colorScheme}` : settings['theme.@primary-color'] || '#000000',
                },
              }),
              ghost: (props: { colorScheme: string }) => ({
                _hover: {
                  color: props.colorScheme ? `${props.colorScheme}.400` : 'primary.400',
                  background: 'transparent',
                },
              }),
              link: (props: { colorScheme: string }) => ({
                color: props.colorScheme ? `${props.colorScheme}.500` : 'primary.500',
              }),
            },
          },
          CloseButton: {
            baseStyle: {
              _focus: {
                boxShadow: '0',
              },
            },
          },
          Divider: {
            baseStyle: {
              borderColor: '#e8e8e8',
            },
          },
          IconButton: {
            download: {
              background: 'transparent',
            },
          },
          Input: {
            variants: {
              outline: () => ({
                field: {
                  borderColor: 'var(--gray)',
                  _focus: {
                    borderColor: settings['theme.@primary-color'],
                  },
                },
              }),
            },
          },
          Select: {
            variants: {
              outline: () => ({
                field: {
                  borderColor: '#ccc',
                },
              }),
            },
          },
          Textarea: {
            variants: {
              outline: () => ({
                borderColor: 'var(--gray)',
              }),
            },
          },
          Checkbox: {
            baseStyle: {
              control: {
                borderWidth: '1px',
                borderColor: 'var(--gray)',
                _checked: {
                  bg: 'primary.500',
                  borderColor: 'primary.500',
                  _hover: {
                    bg: 'primary.600',
                    borderColor: 'primary.600',
                  },
                },
                _indeterminate: {
                  bg: 'primary.500',
                  borderColor: 'primary.500',
                },
                _hover: {
                  borderColor: 'gray.600',
                },
                _focus: {
                  boxShadow: 'none',
                  borderColor: 'primary.500',
                },
                _disabled: {
                  borderColor: 'gray.300',
                  bg: 'gray.100',
                },
              },
            },
          },
          Radio: {
            baseStyle: {
              control: {
                borderWidth: '1px',
                borderColor: 'var(--gray)',
                bg: 'white',
                _checked: {
                  bg: 'primary.500',
                  borderColor: 'primary.500',
                  _before: {
                    content: '""',
                    display: 'inline-block',
                    position: 'relative',
                    width: '50%',
                    height: '50%',
                    borderRadius: '50%',
                    bg: 'white',
                  },
                  _hover: {
                    bg: 'primary.600',
                    borderColor: 'primary.600',
                    _before: {
                      bg: 'white',
                    },
                  },
                },
                _hover: {
                  bg: 'white',
                  borderColor: 'gray.600',
                },
                _focus: {
                  boxShadow: 'none',
                  borderColor: 'primary.500',
                },
                _disabled: {
                  borderColor: 'gray.300',
                  bg: 'gray.100',
                },
              },
            },
          },
          FormError: {
            baseStyle: {
              text: {
                color: 'danger.500',
              },
            },
          },
          Menu: {
            baseStyle: {
              item: {
                _active: {
                  bg: `${settings['theme.@primary-color']}1a`,
                },
                _focus: {
                  bg: `${settings['theme.@primary-color']}1a`,
                },
              },
            },
          },
          Modal: {
            baseStyle: {
              dialog: {
                borderRadius: '2px',
              },
            },
          },
          Tooltip: {
            baseStyle: {
              bg: '#4a4a4a',
              borderRadius: '4px',
              fontWeight: '500',
              fontSize: '12px',
            },
          },
          Tabs: {
            baseStyle: {
              tab: {
                _focus: {
                  boxShadow: 0,
                },
              },
            },
          },
        },
        colors: {
          ...paletteGenerator(settings['theme.@primary-color'] || '#2d313a'),
          secondary: {
            ...paletteGenerator(settings['theme.@secondary-color'] || '#6b46c1').primary,
          },
          danger: {
            ...paletteGenerator('#ff7d62').primary,
          },
          gray: {
            100: 'rgba(0, 0, 0, 0.1)',
            200: '#f7f8f8',
            300: '#ececec',
            400: '#cdcece',
            500: '#cdcdcd',
            600: '#9b9b9b',
            700: '#585858',
            800: '#4a4a4a',
            900: 'rgba(0, 0, 0, 0.45)',
          },
        },
      },
      extendChakraTheme,
    ),
  )
  const themeVars = Object.keys(settings)
    .filter(key => key.split('.')[0] === 'theme')
    .map(key => key.split('.')[1])
    .reduce(
      (vars: { [key: string]: string }, themeKey: string) => {
        vars[themeKey] = settings[`theme.${themeKey}`]
        return vars
      },
      {
        '@primary-color': '#2d313a',
        '@secondary-color': '#6b46c1',
      },
    )

  return (
    <ChakraProvider theme={theme}>
      <ThemeProvider theme={themeVars}>{children}</ThemeProvider>
    </ChakraProvider>
  )
}

export const useAppTheme = useTheme
