import { Select, SkeletonText } from '@chakra-ui/react'
import { Checkbox, Form, Input } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../contexts/AppContext'
import { validationRegExp } from '../../helpers'
import { checkoutMessages } from '../../helpers/translation'
import { InvoiceProps, ShippingProps } from '../../types/checkout'
import { CommonTitleMixin } from '../common'

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
    if (
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
}> = ({
  value,
  onChange,
  isValidating,
  shouldSameToShippingCheckboxDisplay,
  renderMemberInfoInput,
  renderDescription,
  renderUniformNumber,
}) => {
  const { formatMessage } = useIntl()
  const { loading, settings, enabledModules } = useApp()

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

  const errorFields = isValidating && value ? validateInvoice(value) : []

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
      setSelectedType((settings['invoice.default_type'] as InvoiceType) || 'donation')
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

      cachedInvoice.type && setSelectedType(cachedInvoice.type)
      cachedInvoice.option && setSelectedOption(cachedInvoice.option)
    } catch (error) {}
  }, [loading, enabledModules.invoice])

  if (loading) {
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
      name: shippingName || nameRef.current?.input.value || '',
      phone: shippingPhone || phoneRef.current?.input.value || '',
      email: emailRef.current?.input.value || '',
      phoneBarCode:
        currentInvoiceOption === 'use-phone-bar-code' ? phoneBarCodeRef.current?.input.value || '' : undefined,
      citizenCode:
        currentInvoiceOption === 'citizen-digital-certificate' ? citizenCodeRef.current?.input.value || '' : undefined,
      uniformNumber:
        currentInvoiceType === 'uniform-number' || currentInvoiceType === 'hardcopy-uniform-number'
          ? uniformNumberRef.current?.input.value || ''
          : undefined,
      uniformTitle:
        currentInvoiceType === 'uniform-number' || currentInvoiceType === 'hardcopy-uniform-number'
          ? uniformTitleRef.current?.input.value || ''
          : undefined,
      donationCode: currentInvoiceType === 'donation' ? currentSelectedCharity : undefined,
      postCode: currentInvoiceType === 'hardcopy-uniform-number' ? postCodeRef.current?.input.value || '' : undefined,
      address:
        currentInvoiceType === 'hardcopy-uniform-number'
          ? shippingAddress || addressRef.current?.input.value || ''
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

  return (
    <StyledWrapper>
      <StyledTitle>{formatMessage(checkoutMessages.label.invoice)}</StyledTitle>
      {renderDescription?.() || (
          <div dangerouslySetInnerHTML={{ __html: settings['custom.invoiceInput.description'] }} />
        ) || (
          <StyledDescription className="mb-4">
            {enabledModules.invoice
              ? formatMessage(checkoutMessages.message.warningEmail)
              : formatMessage(checkoutMessages.message.warningHardcopy)}
          </StyledDescription>
        )}

      {shouldSameToShippingCheckboxDisplay && (
        <div className="mb-4">
          <Checkbox onChange={event => event.target.checked && syncWithShipping()}>
            {formatMessage(checkoutMessages.message.sameToShipping)}
          </Checkbox>
        </div>
      )}

      {renderMemberInfoInput?.({ value, nameRef, phoneRef, emailRef }) || (
        <div className="row">
          <div className="col-12 col-lg-3">
            <Form.Item
              label={formatMessage(checkoutMessages.label.name)}
              required
              validateStatus={isValidating && errorFields.includes('name') ? 'error' : undefined}
              help={errorFields.includes('name') && formatMessage(checkoutMessages.message.errorName)}
            >
              <Input
                ref={nameRef}
                placeholder={formatMessage(checkoutMessages.placeholder.nameText)}
                defaultValue={value ? value.name : ''}
                onBlur={() => handleChange({})}
              />
            </Form.Item>
          </div>
          <div className="col-12 col-lg-3">
            <Form.Item
              label={formatMessage(checkoutMessages.label.phone)}
              required
              validateStatus={isValidating && errorFields.includes('phone') ? 'error' : undefined}
              help={errorFields.includes('phone') && formatMessage(checkoutMessages.message.errorPhone)}
            >
              <Input
                ref={phoneRef}
                placeholder={formatMessage(checkoutMessages.message.phone)}
                defaultValue={value ? value.phone : ''}
                onBlur={() => handleChange({})}
              />
            </Form.Item>
          </div>
          <div className="col-12 col-lg-6">
            <Form.Item
              label={formatMessage(checkoutMessages.label.email)}
              required
              validateStatus={isValidating && errorFields.includes('email') ? 'error' : undefined}
              help={errorFields.includes('email') && formatMessage(checkoutMessages.message.errorEmail)}
            >
              <Input
                ref={emailRef}
                placeholder={formatMessage(checkoutMessages.message.emailText)}
                defaultValue={value ? value.email : ''}
                onBlur={() => handleChange({})}
              />
            </Form.Item>
          </div>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-12 col-lg-6">
          {enabledModules.invoice ? (
            <Select
              value={selectedType || ''}
              onChange={e =>
                handleChange({
                  invoiceType: e.target.value.length ? (e.target.value as InvoiceType) : null,
                  invoiceOption: e.target.value === 'electronic' ? 'send-to-email' : null,
                })
              }
            >
              <option value="electronic">{formatMessage(checkoutMessages.label.electronicInvoice)}</option>
              <option value="donation">{formatMessage(checkoutMessages.label.donateInvoice)}</option>
              <option value="uniform-number">{formatMessage(checkoutMessages.label.uniformNumber)}</option>
            </Select>
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
        <div className="col-12 col-lg-6">
          {selectedType === 'donation' && (
            <Select value={selectedCharity} onChange={e => handleChange({ invoiceCharity: e.target.value })}>
              {customCharities.map(v => (
                <option key={v.code} value={v.code}>
                  {v.code} {v.name}
                </option>
              ))}
              <option value="25885">25885 財團法人伊甸社會福利基金會</option>
              <option value="5380">5380 社團法人台灣失智症協會</option>
              <option value="8957282">8957282 財團法人流浪動物之家基金會</option>
            </Select>
          )}

          {selectedType === 'electronic' && (
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
          )}
        </div>
      </div>

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
