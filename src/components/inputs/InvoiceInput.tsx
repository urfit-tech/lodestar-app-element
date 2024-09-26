import { HStack, Select, SkeletonText, useRadioGroup } from '@chakra-ui/react'
import { Checkbox, Form, Input } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../contexts/AppContext'
import { useAuth } from '../../contexts/AuthContext'
import { checkUniformNumber, validationRegExp } from '../../helpers'
import { checkoutMessages } from '../../helpers/translation'
import { useMember } from '../../hooks/member'
import { InvoiceProps, ShippingProps } from '../../types/checkout'
import { CommonTitleMixin } from '../common'
import RadioCard from '../common/RadioCard'
import inputMessages from './translation'

const StyledWrapper = styled.div`
  .ant-select {
    width: 100%;
  }
`
const StyledTitle = styled.div`
  margin-bottom: 0.75rem;
  ${CommonTitleMixin}
`
export const StyledDescription = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
  .primary {
    color: ${props => props.theme['@primary-color']};
  }
`
export const StyledRemark = styled.div`
  color: var(--gray-darker);
  font-size: 14px;
  line-height: 1.57;
  letter-spacing: 0.18px;
`

type InvoiceType = 'electronic' | 'uniform-number' | 'donation' | 'hardcopy' | 'hardcopy-uniform-number'
type InvoiceOption = 'send-to-email' | 'use-phone-bar-code' | 'citizen-digital-certificate'

export const validateInvoice: (invoice: InvoiceProps) => string[] = invoice => {
  const errorFields: string[] = []
  for (const fieldId in invoice) {
    const fieldValue =
      fieldId === 'phone'
        ? invoice[fieldId as keyof InvoiceProps]?.replace(/-/g, '')
        : invoice[fieldId as keyof InvoiceProps]
    if (typeof fieldValue === 'string' && fieldId === 'uniformNumber' && !checkUniformNumber(fieldValue)) {
      errorFields.push(fieldId)
    } else if (
      typeof fieldValue === 'string' &&
      (!fieldValue || (validationRegExp[fieldId] && !validationRegExp[fieldId].test(fieldValue)))
    ) {
      errorFields.push(fieldId)
    }
  }
  return errorFields
}

const InvoiceInput: React.VFC<{
  value?: InvoiceProps
  onChange?: (value: InvoiceProps) => void
  isValidating?: boolean
  shouldSameToShippingCheckboxDisplay?: boolean
  renderMemberInfoInput?: (props: {
    value?: InvoiceProps
    nameRef: React.MutableRefObject<Input | null>
    phoneRef: React.MutableRefObject<Input | null>
    emailRef: React.MutableRefObject<Input | null>
  }) => React.ReactNode
  renderDescription?: () => React.ReactNode
  renderUniformNumber?: (props: {
    value?: InvoiceProps
    uniformNumberRef: React.MutableRefObject<Input | null>
    uniformTitleRef: React.MutableRefObject<Input | null>
    isValidating?: boolean
    errorFields: string[]
    handleChange: () => void
  }) => React.ReactNode
  hidePhoneInput?: boolean
}> = ({
  value,
  onChange,
  isValidating,
  shouldSameToShippingCheckboxDisplay,
  renderMemberInfoInput,
  renderDescription,
  renderUniformNumber,
  hidePhoneInput,
}) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { loading, settings, enabledModules } = useApp()
  const { loadingMember, member } = useMember(currentMemberId || '')

  const nameRef = useRef<Input | null>(null)
  const phoneRef = useRef<Input | null>(null)
  const emailRef = useRef<Input | null>(null)
  const phoneBarCodeRef = useRef<Input | null>(null)
  const citizenCodeRef = useRef<Input | null>(null)
  const uniformNumberRef = useRef<Input | null>(null)
  const uniformTitleRef = useRef<Input | null>(null)
  const postCodeRef = useRef<Input | null>(null)
  const addressRef = useRef<Input | null>(null)

  const [selectedType, setSelectedType] = useState<InvoiceType | null>(null)
  const [selectedOption, setSelectedOption] = useState<InvoiceOption | null>(null)
  const [selectedCharity, setSelectedCharity] = useState('5380')
  const [isSameToShipping, setIsSameToShipping] = useState(false)

  const errorFields = isValidating && value ? validateInvoice(value) : []

  const invoiceTypes = settings['invoice.types'] ? JSON.parse(settings['invoice.types']) : null
  const invoiceTypeOptions = invoiceTypes
    ? (invoiceTypes as Array<InvoiceType>)
    : ['donation', 'electronic', 'uniform-number']

  const customCharities: { code: string; name: string }[] = (() => {
    try {
      return JSON.parse(settings['invoice.charities']) || []
    } catch {
      return []
    }
  })()

  useEffect(() => {
    if (loading) {
      return
    }

    if (enabledModules.invoice) {
      const initInvoiceType = invoiceTypeOptions.includes(settings['invoice.default_type'])
        ? settings['invoice.default_type']
        : invoiceTypeOptions[0]
      setSelectedType(initInvoiceType as InvoiceType)
      settings['invoice.default_type'] === 'electronic' && setSelectedOption('send-to-email')
      customCharities[0]?.code && setSelectedCharity(customCharities[0]?.code)
    } else {
      setSelectedType('hardcopy')
    }

    try {
      const cachedInvoiceRaw = localStorage.getItem('kolable.cart.invoice')
      if (!cachedInvoiceRaw) {
        return
      }

      const cachedInvoice: {
        type?: InvoiceType
        option?: InvoiceOption
        value?: InvoiceProps
      } = JSON.parse(cachedInvoiceRaw)

      invoiceTypeOptions.includes(cachedInvoice.type || '') && cachedInvoice.type && setSelectedType(cachedInvoice.type)
      invoiceTypeOptions.includes(cachedInvoice.type || '') &&
        cachedInvoice.option &&
        setSelectedOption(cachedInvoice.option)
    } catch (error) {}
  }, [loading, enabledModules.invoice])

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'invoiceType',
    defaultValue: selectedType || 'donation',
    value: selectedType || 'donation',
    onChange: e => {
      if (typeof e.valueOf() === 'string') {
        handleChange({
          invoiceType: e.valueOf() ? (e.valueOf() as InvoiceType) : null,
          invoiceOption: e.valueOf() === 'electronic' ? 'send-to-email' : null,
        })
      }
    },
  })

  if (loading || loadingMember) {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }

  const handleChange: (props: {
    invoiceType?: InvoiceType | null
    invoiceOption?: InvoiceOption | null
    invoiceCharity?: string
    shippingName?: string
    shippingPhone?: string
    shippingAddress?: string
  }) => void = ({ invoiceType, invoiceOption, invoiceCharity, shippingName, shippingPhone, shippingAddress }) => {
    const currentInvoiceType = typeof invoiceType === 'undefined' ? selectedType : invoiceType
    const currentInvoiceOption = typeof invoiceOption === 'undefined' ? selectedOption : invoiceOption
    const currentSelectedCharity = typeof invoiceCharity === 'undefined' ? selectedCharity : invoiceCharity

    typeof invoiceType !== 'undefined' && setSelectedType(invoiceType)
    typeof invoiceOption !== 'undefined' && setSelectedOption(invoiceOption)
    typeof invoiceCharity !== 'undefined' && setSelectedCharity(invoiceCharity)

    const currentValue: InvoiceProps = {
      name: shippingName?.trim() || nameRef.current?.input.value.trim() || '',
      phone: shippingPhone?.trim() || phoneRef.current?.input.value.trim() || '',
      email: emailRef.current?.input.value.trim() || '',
      phoneBarCode:
        currentInvoiceOption === 'use-phone-bar-code'
          ? phoneBarCodeRef.current?.input.value.toLocaleUpperCase().trim() || ''
          : undefined,
      citizenCode:
        currentInvoiceOption === 'citizen-digital-certificate'
          ? citizenCodeRef.current?.input.value.toLocaleUpperCase().trim() || ''
          : undefined,
      uniformNumber:
        currentInvoiceType === 'uniform-number' || currentInvoiceType === 'hardcopy-uniform-number'
          ? uniformNumberRef.current?.input.value.trim() || ''
          : undefined,
      uniformTitle:
        currentInvoiceType === 'uniform-number' || currentInvoiceType === 'hardcopy-uniform-number'
          ? uniformTitleRef.current?.input.value.trim() || ''
          : undefined,
      donationCode: currentInvoiceType === 'donation' ? currentSelectedCharity : undefined,
      postCode:
        currentInvoiceType === 'hardcopy-uniform-number' || currentInvoiceType === 'hardcopy'
          ? postCodeRef.current?.input.value.trim() || ''
          : undefined,
      address:
        currentInvoiceType === 'hardcopy-uniform-number' || currentInvoiceType === 'hardcopy'
          ? shippingAddress || addressRef.current?.input.value.trim() || ''
          : undefined,
    }

    localStorage.setItem(
      'kolable.cart.invoice',
      JSON.stringify({
        type: currentInvoiceType,
        option: currentInvoiceOption,
        value: currentValue,
      }),
    )

    onChange && onChange(currentValue)
  }

  const syncWithShipping = async () => {
    try {
      const cachedShipping: ShippingProps = JSON.parse(localStorage.getItem('kolable.cart.shipping') || '')

      nameRef.current?.setValue(cachedShipping?.name || '')
      phoneRef.current?.setValue(cachedShipping?.phone || '')
      addressRef.current?.setValue(cachedShipping?.address || '')

      handleChange({
        invoiceType: selectedType,
        invoiceOption: selectedOption,
        invoiceCharity: selectedCharity,
        shippingName: cachedShipping.name,
        shippingPhone: cachedShipping.phone,
        shippingAddress: cachedShipping.address,
      })
    } catch (error) {
      handleChange({
        invoiceType: selectedType,
        invoiceOption: selectedOption,
        invoiceCharity: selectedCharity,
      })
    }
  }

  const isMemberInfoDisable = Boolean(Number(settings['feature.invoice_member_info_input.disable']))
  const group = getRootProps()

  return (
    <StyledWrapper>
      <StyledTitle>{formatMessage(checkoutMessages.label.invoice)}</StyledTitle>
      {renderDescription?.() ||
        (settings['feature.invoice_input_description.enable'] === '1' ? (
          <StyledDescription className="mb-4">
            <div className="mb-1">{formatMessage(checkoutMessages.text.invoiceDescription1)}</div>
            <div>
              {formatMessage(checkoutMessages.text.invoiceDescription2)}
              <a
                className="primary"
                href={`${settings['feature.invoice_input_description_href']}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {formatMessage(checkoutMessages.text.invoiceDescription3)}
              </a>
              {formatMessage(checkoutMessages.text.invoiceDescription4)}
            </div>
          </StyledDescription>
        ) : (
          <StyledDescription className="mb-4">
            {enabledModules.invoice
              ? formatMessage(checkoutMessages.message.warningEmail)
              : formatMessage(checkoutMessages.message.warningHardcopy)}
          </StyledDescription>
        ))}

      {shouldSameToShippingCheckboxDisplay && (
        <div className="mb-4">
          <Checkbox
            onChange={event => {
              if (event.target.checked) {
                setIsSameToShipping(true)
                syncWithShipping()
              } else {
                setIsSameToShipping(false)
              }
            }}
          >
            {formatMessage(checkoutMessages.message.sameToShipping)}
          </Checkbox>
        </div>
      )}

      {renderMemberInfoInput?.({ value, nameRef, phoneRef, emailRef }) || (
        <div className="row" style={isMemberInfoDisable ? { display: 'none' } : {}}>
          <div className="col-12 col-lg-3">
            <Form.Item
              label={formatMessage(checkoutMessages.label.name)}
              required
              validateStatus={isValidating && errorFields.includes('name') ? 'error' : undefined}
              help={errorFields.includes('name') && formatMessage(checkoutMessages.message.errorName)}
            >
              <Input
                disabled={isSameToShipping}
                ref={nameRef}
                placeholder={formatMessage(checkoutMessages.placeholder.nameText)}
                defaultValue={isMemberInfoDisable ? member?.name || member?.username : value ? value.name : ''}
                onBlur={() => handleChange({})}
              />
            </Form.Item>
          </div>
          {!hidePhoneInput && (
            <div className="col-12 col-lg-3">
              <Form.Item
                label={formatMessage(checkoutMessages.label.phone)}
                required
                validateStatus={isValidating && errorFields.includes('phone') ? 'error' : undefined}
                help={errorFields.includes('phone') && formatMessage(checkoutMessages.message.errorPhone)}
              >
                <Input
                  disabled={isSameToShipping}
                  ref={phoneRef}
                  placeholder={formatMessage(checkoutMessages.message.phone)}
                  defaultValue={isMemberInfoDisable ? member?.phone || '' : value ? value.phone : ''}
                  onBlur={() => handleChange({})}
                />
              </Form.Item>
            </div>
          )}
          <div className="col-12 col-lg-6">
            <Form.Item
              label={formatMessage(checkoutMessages.label.email)}
              required
              validateStatus={isValidating && errorFields.includes('email') ? 'error' : undefined}
              help={errorFields.includes('email') && formatMessage(checkoutMessages.message.errorEmail)}
            >
              <Input
                disabled={isSameToShipping}
                ref={emailRef}
                placeholder={formatMessage(checkoutMessages.message.emailText)}
                defaultValue={isMemberInfoDisable ? member?.email : value ? value.email : ''}
                onBlur={() => handleChange({})}
              />
            </Form.Item>
          </div>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-12 col-lg-6">
          {enabledModules.invoice ? (
            <HStack {...group}>
              {invoiceTypeOptions.map(value => {
                const radio = getRadioProps({ value })
                return (
                  <RadioCard key={value} size="md" {...radio}>
                    {value === 'electronic'
                      ? formatMessage(checkoutMessages.label.electronicInvoice)
                      : value === 'uniform-number'
                      ? formatMessage(checkoutMessages.label.uniformNumber)
                      : formatMessage(checkoutMessages.label.donateInvoice)}
                  </RadioCard>
                )
              })}
            </HStack>
          ) : (
            <Select
              value={selectedType || ''}
              onChange={e =>
                handleChange({ invoiceType: e.target.value.length ? (e.target.value as InvoiceType) : null })
              }
            >
              <option value="hardcopy">{formatMessage(checkoutMessages.label.hardcopyInvoice)}</option>
              <option value="hardcopy-uniform-number">
                {formatMessage(checkoutMessages.label.hardcopyUniformNumberInvoice)}
              </option>
            </Select>
          )}
        </div>
      </div>

      {selectedType === 'donation' && (
        <div className="row">
          <div className="col-6">
            <Select value={selectedCharity} onChange={e => handleChange({ invoiceCharity: e.target.value })}>
              {customCharities.map(v => (
                <option key={v.code} value={v.code}>
                  {v.code} {v.name}
                </option>
              ))}
              <option value="25885">{formatMessage(inputMessages.InvoiceInput.edenSocialWelfareFoundation)}</option>
              <option value="5380">{formatMessage(inputMessages.InvoiceInput.taiwanAlzheimerAssociation)}</option>
              <option value="8957282">{formatMessage(inputMessages.InvoiceInput.strayAnimalsHomeFoundation)}</option>
            </Select>
          </div>
        </div>
      )}

      {selectedType === 'electronic' && (
        <div className="row mb-4">
          <div className="col-6">
            <Select
              value={selectedOption || ''}
              onChange={e =>
                handleChange({ invoiceOption: e.target.value.length ? (e.target.value as InvoiceOption) : null })
              }
            >
              <option value="send-to-email">{formatMessage(checkoutMessages.label.sendToEmail)}</option>
              <option value="use-phone-bar-code">{formatMessage(checkoutMessages.label.usePhoneBarCode)}</option>
              <option value="citizen-digital-certificate">{formatMessage(checkoutMessages.label.citizenCode)}</option>
            </Select>
          </div>
        </div>
      )}

      {selectedOption === 'use-phone-bar-code' && (
        <div className="row">
          <div className="col-12">
            <Form.Item
              label={formatMessage(checkoutMessages.label.phoneBarCode)}
              required
              validateStatus={isValidating && errorFields.includes('phoneBarCode') ? 'error' : undefined}
              help={formatMessage(checkoutMessages.message.phoneBarCodeText)}
            >
              <Input
                style={{ textTransform: 'uppercase' }}
                ref={phoneBarCodeRef}
                defaultValue={value ? value.phoneBarCode : undefined}
                onBlur={() => handleChange({})}
              />
            </Form.Item>
          </div>
        </div>
      )}

      {selectedOption === 'citizen-digital-certificate' && (
        <div className="row">
          <div className="col-12">
            <Form.Item
              label={formatMessage(checkoutMessages.label.citizenCode)}
              required
              validateStatus={isValidating && errorFields.includes('citizenCode') ? 'error' : undefined}
              help={formatMessage(checkoutMessages.message.citizenCodeText)}
            >
              <Input
                style={{ textTransform: 'uppercase' }}
                ref={citizenCodeRef}
                defaultValue={value ? value.citizenCode : undefined}
                onBlur={() => handleChange({})}
              />
            </Form.Item>
          </div>
        </div>
      )}

      {(selectedType === 'uniform-number' || selectedType === 'hardcopy-uniform-number') &&
        (renderUniformNumber?.({
          value,
          uniformNumberRef,
          uniformTitleRef,
          handleChange: () => handleChange({}),
          isValidating,
          errorFields,
        }) || (
          <div className="row">
            <div className="col-12 col-lg-6">
              <Form.Item
                label={formatMessage(checkoutMessages.label.uniformNumber)}
                required
                validateStatus={isValidating && errorFields.includes('uniformNumber') ? 'error' : undefined}
              >
                <Input
                  ref={uniformNumberRef}
                  type="number"
                  placeholder={formatMessage(checkoutMessages.message.uniformNumberText)}
                  defaultValue={value ? value.uniformNumber : undefined}
                  onBlur={() => handleChange({})}
                />
              </Form.Item>
            </div>
            <div className="col-12 col-lg-6">
              <Form.Item
                label={formatMessage(checkoutMessages.label.uniformTitle)}
                required
                validateStatus={isValidating && errorFields.includes('uniformTitle') ? 'error' : undefined}
              >
                <Input
                  ref={uniformTitleRef}
                  placeholder={formatMessage(checkoutMessages.message.uniformTitleText)}
                  defaultValue={value ? value.uniformTitle : undefined}
                  onBlur={() => handleChange({})}
                />
              </Form.Item>
            </div>
            <div className="col-12">
              {selectedType === 'uniform-number' && (
                <StyledRemark>{formatMessage(checkoutMessages.message.uniformNumberRemark)}</StyledRemark>
              )}
            </div>
          </div>
        ))}

      {(selectedType === 'hardcopy' || selectedType === 'hardcopy-uniform-number') && (
        <div className="row">
          <div className="col-12">
            <Form.Item
              label={formatMessage(checkoutMessages.label.receiverAddress)}
              required
              validateStatus={
                isValidating && (errorFields.includes('post') || errorFields.includes('address')) ? 'error' : undefined
              }
            >
              <div className="row no-gutters">
                <div className="col-4 pr-3">
                  <Input
                    ref={postCodeRef}
                    placeholder={formatMessage(checkoutMessages.label.postCode)}
                    defaultValue={value ? value.postCode : undefined}
                    onBlur={() => handleChange({})}
                  />
                </div>
                <div className="col-8">
                  <Input
                    ref={addressRef}
                    placeholder={formatMessage(checkoutMessages.label.receiverAddress)}
                    defaultValue={value ? value.address : undefined}
                    onBlur={() => handleChange({})}
                  />
                </div>
              </div>
            </Form.Item>
          </div>
        </div>
      )}
    </StyledWrapper>
  )
}

export default InvoiceInput
