import { Button, Textarea } from '@chakra-ui/react'
import { Form, Input, Radio } from 'antd'
import { camelCase } from 'lodash'
import React, { useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../contexts/AppContext'
import { checkoutMessages } from '../../helpers/translation'
import { ShippingOptionProps, ShippingProps } from '../../types/checkout'
import { CommonTitleMixin } from '../common'
import PriceLabel from '../labels/PriceLabel'

export const csvShippingMethods = ['seven-eleven', 'family-mart', 'ok-mart', 'hi-life']

const StyledTitle = styled.div`
  ${CommonTitleMixin}
`

const StyledPriceTag = styled.span`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: ${props => props.theme['@primary-color']};
`

type cvsOptionsProps = {
  cvsType: string
  storeId: string
  storeName: string
  storeAddress: string
}

export const validateShipping: (shipping: ShippingProps) => boolean = shipping => {
  return [shipping.name, shipping.phone, shipping.address].every(value => !!value)
}

const ShippingInput: React.VFC<{
  value?: ShippingProps
  onChange?: (value: ShippingProps) => void
  isValidating?: boolean
  shippingMethods?: ShippingOptionProps[]
}> = ({ value, onChange, isValidating, shippingMethods }) => {
  const { formatMessage } = useIntl()
  const { currencyId: appCurrencyId } = useApp()

  const nameRef = useRef<Input | null>(null)
  const phoneRef = useRef<Input | null>(null)
  const addressRef = useRef<Input | null>(null)

  const cachedCvsOptions = localStorage.getItem('kolable.cart.shippingOptions')
  const [currentCvsOptions, setCurrentCvsOptions] = useState<{ [key: string]: cvsOptionsProps }>(
    cachedCvsOptions ? JSON.parse(cachedCvsOptions) : {},
  )

  const handleChange = (key: keyof ShippingProps, inputValue: string) => {
    let newShippingOption = {}

    if (key === 'shippingMethod' && currentCvsOptions[inputValue]) {
      const { storeId, storeName, storeAddress } = currentCvsOptions[inputValue]
      newShippingOption = {
        storeId,
        storeName,
        address: storeAddress,
      }
      localStorage.setItem('kolable.cart.shippingOptions', JSON.stringify(newShippingOption))
    }

    const newValue: ShippingProps = {
      name: value?.name || '',
      phone: value?.phone || '',
      address: value?.address || '',
      shippingMethod: value?.shippingMethod || 'home-delivery',
      specification: value?.specification || '',
      storeId: value?.storeId || '',
      storeName: value?.storeName || '',
      ...newShippingOption,
    }
    newValue[key] = inputValue
    localStorage.setItem('kolable.cart.shipping', JSON.stringify(newValue))
    onChange && onChange(newValue)
  }

  ;(window as any).callCvsPopupCallback = (params: cvsOptionsProps) => {
    const { cvsType, storeId, storeName, storeAddress } = params

    if (value?.shippingMethod) {
      const newCvsOptions = {
        ...currentCvsOptions,
        [cvsType || value.shippingMethod]: params,
      }
      setCurrentCvsOptions(newCvsOptions)
      localStorage.setItem('kolable.cart.shippingOptions', JSON.stringify(newCvsOptions))
    }

    const newValue = {
      name: value?.name || '',
      phone: value?.phone || '',
      specification: value?.specification || '',
      ...value,
      storeId,
      storeName,
      address: storeAddress || '',
      shippingMethod: cvsType || value?.shippingMethod || 'home-delivery',
    }
    localStorage.setItem('kolable.cart.shipping', JSON.stringify(newValue))
    onChange && onChange(newValue)
  }

  const handleStoreSelect = () => {
    if (!process.env.REACT_APP_API_BASE_ROOT) {
      return
    }
    let apiUrl: string
    try {
      apiUrl = new URL(process.env.REACT_APP_API_BASE_ROOT).href
    } catch {
      apiUrl = window.location.origin + process.env.REACT_APP_API_BASE_ROOT
    }
    const cvsSelectionBackUrl = encodeURIComponent(
      `${apiUrl}/payment/cvs-proxy/${value?.shippingMethod}?callbackUrl=${window.location.origin}/cvs`,
    )
    let cvsSelectionUrl

    switch (value?.shippingMethod) {
      case 'seven-eleven':
        cvsSelectionUrl = `https://emap.pcsc.com.tw/ecmap/default.aspx?eshopparid=935&eshopid=001&eshoppwd=presco123&tempvar=&sid=1&storecategory=3&showtype=1&storeid=&url=${cvsSelectionBackUrl}`
        break
      case 'ok-mart':
        cvsSelectionUrl = `https://ecservice.okmart.com.tw/ECMapInquiry/ShowStore?userip=&cvsid=1592042616368&cvstemp=${cvsSelectionBackUrl}`
        break
      case 'hi-life':
      case 'family-mart':
        cvsSelectionUrl = `https://map.ezship.com.tw/ezship_map_web_2014.jsp?rtURL=${cvsSelectionBackUrl}`
        break
      default:
        break
    }
    window.open(cvsSelectionUrl)
  }

  return (
    <div>
      <StyledTitle className="mb-4">{formatMessage(checkoutMessages.label.shippingInput)}</StyledTitle>

      {shippingMethods && (
        <Form.Item required label={formatMessage(checkoutMessages.label.shippingMethod)}>
          <Radio.Group
            value={value?.shippingMethod || 'home-delivery'}
            onChange={event => handleChange('shippingMethod', event.target.value)}
          >
            {shippingMethods
              .filter(shippingMethod => shippingMethod.enabled)
              .map(shippingMethod => {
                const formattedShippingMethod =
                  checkoutMessages.shipping[camelCase(shippingMethod.id) as keyof typeof checkoutMessages.shipping]
                return (
                  <Radio key={shippingMethod.id} value={shippingMethod.id} className="d-block mt-4">
                    <span className="align-middle mr-2">{formatMessage(formattedShippingMethod)}</span>
                    <StyledPriceTag className="mr-2">
                      <PriceLabel listPrice={shippingMethod.fee} currencyId={appCurrencyId} />
                    </StyledPriceTag>
                    {csvShippingMethods.includes(shippingMethod.id) && value?.shippingMethod === shippingMethod.id && (
                      <>
                        <span className="mr-2">
                          <Button
                            variant="outline"
                            borderColor="#d9d9d9"
                            borderRadius="4px"
                            onClick={() => handleStoreSelect()}
                          >
                            {formatMessage(checkoutMessages.label.selectStore)}
                          </Button>
                        </span>

                        {currentCvsOptions[value?.shippingMethod] && (
                          <span>{currentCvsOptions[value?.shippingMethod].storeName}</span>
                        )}
                      </>
                    )}
                  </Radio>
                )
              })}
          </Radio.Group>
        </Form.Item>
      )}

      <div className="row">
        <div className="col-12 col-lg-6">
          <Form.Item
            required
            label={formatMessage(checkoutMessages.label.receiverName)}
            validateStatus={isValidating && nameRef.current?.input.value === '' ? 'error' : undefined}
          >
            <Input
              ref={nameRef}
              placeholder={formatMessage(checkoutMessages.placeholder.nameText)}
              defaultValue={value?.name || ''}
              onBlur={event => handleChange('name', event.target.value)}
            />
          </Form.Item>
        </div>
        <div className="col-12 col-lg-6">
          <Form.Item
            required
            label={formatMessage(checkoutMessages.label.receiverPhone)}
            validateStatus={
              isValidating &&
              (phoneRef.current?.input.value === '' || /^[^0-9^+^\-^(^)]$/.test(phoneRef.current?.input.value || ''))
                ? 'error'
                : undefined
            }
          >
            <Input
              ref={phoneRef}
              placeholder={formatMessage(checkoutMessages.label.phone)}
              defaultValue={value?.phone || ''}
              onBlur={event => handleChange('phone', event.target.value)}
            />
          </Form.Item>
        </div>
      </div>

      <Form.Item
        required
        label={formatMessage(checkoutMessages.label.receiverAddress)}
        validateStatus={isValidating && addressRef.current?.input.value === '' ? 'error' : undefined}
      >
        <Input
          ref={addressRef}
          placeholder={formatMessage(checkoutMessages.message.addressText)}
          defaultValue={value?.address || ''}
          value={value?.address}
          onBlur={event => handleChange('address', event.target.value)}
          onChange={event => handleChange('address', event.target.value)}
        />
      </Form.Item>

      <Form.Item label={formatMessage(checkoutMessages.label.specification)}>
        <Textarea
          rows={5}
          defaultValue={value?.specification || ''}
          onBlur={event => handleChange('specification', event.target.value)}
        />
      </Form.Item>
    </div>
  )
}

export default ShippingInput
