import { Box, SimpleGrid } from '@chakra-ui/react'
import { Form, Input } from 'antd'
import { useIntl } from 'react-intl'
import { validationRegExp } from '../../helpers'
import { ContactInfo } from '../../types/checkout'
import inputMessages from './translation'

const ContactInfoInput: React.VFC<{
  value: ContactInfo
  onChange: (value: ContactInfo & { withError: boolean }) => void
  isValidating?: boolean
}> = ({ value, onChange, isValidating }) => {
  const { formatMessage } = useIntl()
  const errorFields = isValidating && value ? validateContactInfo(value) : []

  return (
    <>
      <Box mb="4" fontSize="18px" fontWeight="bold" color="var(--gray-darker)">
        {formatMessage(inputMessages.ContactInfoInput.contactInfo)}
      </Box>
      <Box>{formatMessage(inputMessages.ContactInfoInput.contactInfoDescription)}</Box>

      <SimpleGrid columns={3} spacing={10}>
        <Form.Item
          required
          label={formatMessage(inputMessages.ContactInfoInput.name)}
          help={errorFields.includes('phone') && formatMessage(inputMessages.ContactInfoInput.nameHelpText)}
        >
          <Input
            defaultValue={value.name}
            onChange={v => onChange({ ...value, name: v.target.value, withError: !(errorFields.length === 0) })}
          />
        </Form.Item>
        <Form.Item
          required
          label={formatMessage(inputMessages.ContactInfoInput.phone)}
          help={errorFields.includes('phone') && formatMessage(inputMessages.ContactInfoInput.phoneHelpText)}
        >
          <Input
            defaultValue={value.phone}
            onChange={v => onChange({ ...value, phone: v.target.value, withError: !(errorFields.length === 0) })}
          />
        </Form.Item>
        <Form.Item
          required
          label={formatMessage(inputMessages.ContactInfoInput.email)}
          help={errorFields.includes('phone') && formatMessage(inputMessages.ContactInfoInput.emailHelpText)}
        >
          <Input
            defaultValue={value.email}
            onChange={v => onChange({ ...value, email: v.target.value, withError: !(errorFields.length === 0) })}
          />
        </Form.Item>
      </SimpleGrid>
    </>
  )
}

const validateContactInfo: (contactInfo: ContactInfo) => string[] = contactInfo => {
  const errorFields: string[] = []
  !contactInfo.name && errorFields.push('name')
  !contactInfo.phone || (!validationRegExp['phone']?.test(contactInfo.phone) && errorFields.push('phone'))
  !contactInfo.email || (!validationRegExp['email']?.test(contactInfo.email) && errorFields.push('email'))
  return errorFields
}

export default ContactInfoInput
