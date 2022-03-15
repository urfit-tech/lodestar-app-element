import { Box, SimpleGrid } from '@chakra-ui/react'
import { Form, Input } from 'antd'
import { useIntl } from 'react-intl'
import { validateContactInfo } from '../../helpers'
import { ContactInfo } from '../../types/checkout'
import inputMessages from './translation'

const ContactInfoInput: React.VFC<{
  value: ContactInfo
  onChange: (value: ContactInfo) => void
}> = ({ value, onChange }) => {
  const { formatMessage } = useIntl()
  const errorFields = validateContactInfo(value)

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
          validateStatus={errorFields.includes('name') ? 'error' : ''}
          help={errorFields.includes('name') ? formatMessage(inputMessages.ContactInfoInput.nameHelpText) : null}
        >
          <Input defaultValue={value.name} onChange={v => onChange({ ...value, name: v.target.value })} />
        </Form.Item>
        <Form.Item
          required
          label={formatMessage(inputMessages.ContactInfoInput.phone)}
          validateStatus={errorFields.includes('phone') ? 'error' : ''}
          help={errorFields.includes('phone') ? formatMessage(inputMessages.ContactInfoInput.phoneHelpText) : null}
        >
          <Input defaultValue={value.phone} onChange={v => onChange({ ...value, phone: v.target.value })} />
        </Form.Item>
        <Form.Item
          required
          label={formatMessage(inputMessages.ContactInfoInput.email)}
          validateStatus={errorFields.includes('email') ? 'error' : ''}
          help={errorFields.includes('email') ? formatMessage(inputMessages.ContactInfoInput.emailHelpText) : null}
        >
          <Input defaultValue={value.email} onChange={v => onChange({ ...value, email: v.target.value })} />
        </Form.Item>
      </SimpleGrid>
    </>
  )
}

export default ContactInfoInput
