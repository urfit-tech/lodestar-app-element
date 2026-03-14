import { Box, Text } from '@chakra-ui/layout'
import { FC } from 'react'
import { useApp } from '../../contexts/AppContext'

type LabelConfig = { id: number; backgroundColor: string; textColor: string }

function isLabelConfig(config: Record<string, any>): config is LabelConfig {
  return (
    typeof config?.id === 'number' &&
    typeof config?.backgroundColor === 'string' &&
    typeof config?.textColor === 'string'
  )
}

const ProgramMarketingTag: FC<{ label: string | undefined; labelColorType: string | undefined }> = ({
  label,
  labelColorType,
}) => {
  const { settings, enabledModules } = useApp()

  const getLabelColorConfig = (settings: Record<string, string>): LabelConfig[] | undefined => {
    const labelColorConfig = settings?.['program_label_color.config']
    try {
      const parsedConfig = JSON.parse(labelColorConfig)
      if (parsedConfig.every(isLabelConfig)) {
        return parsedConfig
      } else {
        throw new Error(`Format error.`)
      }
    } catch (err) {
      console.error(
        `Cannot parse program_label_color.config in app setting - ${labelColorConfig?.toString()}. Error:`,
        err,
      )
    }
  }

  const programLabelColorConfig = getLabelColorConfig(settings)

  const programLabelColor = programLabelColorConfig?.find(config => config.id === Number(labelColorType)) || {
    backgroundColor: '#ececec',
    textColor: '#585858',
  }

  return !enabledModules.program_label ? (
    <></>
  ) : (
    <Box alignSelf="flex-start" paddingX="10px" marginTop="10px" minH="25px" width="fit-content">
      {!label || label === '' ? (
        <Text paddingX="10px"> </Text>
      ) : (
        <Text
          backgroundColor={programLabelColor?.backgroundColor}
          textColor={programLabelColor?.textColor}
          paddingX="10px"
          borderRadius="4px"
        >
          {label}
        </Text>
      )}
    </Box>
  )
}

export default ProgramMarketingTag
