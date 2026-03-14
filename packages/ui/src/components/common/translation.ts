import { defineMessages } from 'react-intl'

const commonMessages = {
  Embedded: defineMessages({
    iframe: { id: 'commonMessages.Embedded.iframe', defaultMessage: '請填入 iframe' },
  }),
  review: defineMessages({
    reviewCount: { id: 'commonMessages.review.reviewCount', defaultMessage: '{count} 則' },
    noReviews: { id: 'commonMessages.review.noReviews', defaultMessage: '目前無評價' },
  }),
}

export default commonMessages
