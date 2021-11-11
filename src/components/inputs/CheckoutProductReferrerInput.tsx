import { FormControl, FormErrorMessage } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import { useAuth } from '../../contexts/AuthContext'
import { commonMessages } from '../../helpers/translation'
import { FormInput } from '../input/FormInput'

const CheckoutProductReferrerInput: React.VFC<{
  referrerStatus: 'success' | 'error' | 'validating' | undefined
  referrerId: string | null
  onEmailSet: (email: string) => void
}> = ({ referrerStatus, referrerId, onEmailSet }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()

  return (
    <FormControl isInvalid={referrerStatus === 'error'}>
      <FormInput
        type="email"
        status={referrerStatus}
        placeholder={formatMessage(commonMessages.label.referrerEmail)}
        onBlur={e => onEmailSet(e.target.value)}
      />
      <FormErrorMessage>
        {referrerStatus === 'error'
          ? referrerId === currentMemberId
            ? formatMessage(commonMessages.text.selfReferringIsNotAllowed)
            : formatMessage(commonMessages.text.notFoundMemberEmail)
          : undefined}
      </FormErrorMessage>
    </FormControl>
  )
}

export default CheckoutProductReferrerInput
