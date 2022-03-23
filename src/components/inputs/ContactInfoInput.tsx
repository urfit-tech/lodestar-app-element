import { Box, SimpleGrid } from '@chakra-ui/react'
import { Form, Input } from 'antd'
import { useIntl } from 'react-intl'
import { ContactInfo } from '../../types/checkout'
import inputMessages from './translation'

const ContactInfoInput: React.VFC<{
  value: ContactInfo
  onChange: (value: ContactInfo) => void
  errorContactFields: string[]
}> = ({ value, onChange, errorContactFields }) => {
  const { formatMessage } = useIntl()

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
          validateStatus={errorContactFields.includes('name') ? 'error' : ''}
          help={errorContactFields.includes('name') ? formatMessage(inputMessages.ContactInfoInput.nameHelpText) : null}
        >
          <Input defaultValue={value.name} onChange={v => onChange({ ...value, name: v.target.value })} />
        </Form.Item>
        <Form.Item
          required
          label={formatMessage(inputMessages.ContactInfoInput.phone)}
          validateStatus={errorContactFields.includes('phone') ? 'error' : ''}
          help={
            errorContactFields.includes('phone') ? formatMessage(inputMessages.ContactInfoInput.phoneHelpText) : null
          }
        >
          <Input defaultValue={value.phone} onChange={v => onChange({ ...value, phone: v.target.value })} />
        </Form.Item>
        <Form.Item
          required
          label={formatMessage(inputMessages.ContactInfoInput.email)}
          validateStatus={errorContactFields.includes('email') ? 'error' : ''}
          help={
            errorContactFields.includes('email') ? formatMessage(inputMessages.ContactInfoInput.emailHelpText) : null
          }
        >
          <Input defaultValue={value.email} onChange={v => onChange({ ...value, email: v.target.value })} />
        </Form.Item>
      </SimpleGrid>
    </>
  )
}

export default ContactInfoInput
