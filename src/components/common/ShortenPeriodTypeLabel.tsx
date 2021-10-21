import React from 'react'
import { useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'
import { PeriodType } from '../../types/program'

const ShortenPeriodTypeLabel: React.VFC<{
  periodType: PeriodType
  withQuantifier?: boolean
}> = ({ periodType, withQuantifier }) => {
  const { formatMessage } = useIntl()

  switch (periodType) {
    case 'D':
      return <>{formatMessage(commonMessages.unit.day)}</>
    case 'W':
      return <>{formatMessage(commonMessages.unit.week)}</>
    case 'M':
      return (
        <>
          {withQuantifier
            ? formatMessage(commonMessages.unit.monthWithQuantifier)
            : formatMessage(commonMessages.unit.month)}
        </>
      )
    case 'Y':
      return <>{formatMessage(commonMessages.unit.year)}</>
    default:
      return <>{formatMessage(commonMessages.unknown.period)}</>
  }
}

export default ShortenPeriodTypeLabel
