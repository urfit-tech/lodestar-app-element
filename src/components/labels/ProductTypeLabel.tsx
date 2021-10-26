import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { ProductType } from '../../types/product'

const messages = defineMessages({
  program: { id: 'common.program', defaultMessage: '單次課程' },
  programPlan: { id: 'common.programPlan', defaultMessage: '課程方案' },
  programContent: { id: 'common.programContent', defaultMessage: '課程內容' },
  programPackagePlan: { id: 'common.package', defaultMessage: '課程組合' },
  projectPlan: { id: 'common.project', defaultMessage: '專案方案' },
  card: { id: 'common.memberCard', defaultMessage: '會員卡' },
  activityTicket: { id: 'common.activity', defaultMessage: '線下實體' },
  merchandise: { id: 'common.merchandise', defaultMessage: '商品' },
  podcastProgram: { id: 'common.podcast', defaultMessage: '廣播' },
  podcastPlan: { id: 'common.podcast.subscription', defaultMessage: '廣播頻道' },
  appointmentPlan: { id: 'common.appointment', defaultMessage: '預約' },
  unknownType: { id: 'common.unknownType', defaultMessage: '未知' },
})

const ProductTypeLabel: React.VFC<{
  productType: ProductType
}> = ({ productType }) => {
  const { formatMessage } = useIntl()

  switch (productType) {
    case 'Program':
      return <>{formatMessage(messages.program)}</>
    case 'ProgramPlan':
      return <>{formatMessage(messages.programPlan)}</>
    case 'ProgramContent':
      return <>{formatMessage(messages.programContent)}</>
    case 'ProgramPackagePlan':
      return <>{formatMessage(messages.programPackagePlan)}</>
    case 'ProjectPlan':
      return <>{formatMessage(messages.projectPlan)}</>
    case 'Card':
      return <>{formatMessage(messages.card)}</>
    case 'ActivityTicket':
      return <>{formatMessage(messages.activityTicket)}</>
    case 'MerchandiseSpec':
      return <>{formatMessage(messages.merchandise)}</>
    case 'PodcastProgram':
      return <>{formatMessage(messages.podcastProgram)}</>
    case 'PodcastPlan':
      return <>{formatMessage(messages.podcastPlan)}</>
    case 'AppointmentPlan':
      return <>{formatMessage(messages.appointmentPlan)}</>
    default:
      return <>{formatMessage(messages.unknownType)}</>
  }
}

export default ProductTypeLabel
