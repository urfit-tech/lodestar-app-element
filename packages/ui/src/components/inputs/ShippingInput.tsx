import { Button, Checkbox, Form, Input, Radio, Select } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { camelCase } from 'lodash'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { cities, districts, useTwZipCode, zipCodes } from 'use-tw-zipcode'
import { useApp } from '../../contexts/AppContext'
import { checkoutMessages } from '../../helpers/translation'
import { ShippingOptionProps, ShippingProps } from '../../types/checkout'
import { CommonTitleMixin } from '../common'
import PriceLabel from '../labels/PriceLabel'
import inputMessages from './translation'

export const csvShippingMethods = ['seven-eleven', 'family-mart', 'ok-mart', 'hi-life']

const StyledTitle = styled.div`
  ${CommonTitleMixin}
`

const GiftPlanDeliverNoticeBlock = styled.div`
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const StyledPriceTag = styled.span`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: ${props => props.theme['@primary-color']};
`

const StyledCheckBox = styled(Checkbox)`
  margin-top: 24px;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

type cvsOptionsProps = {
  cvsType: string
  storeId: string
  storeName: string
  storeAddress: string
}

export const validateShipping: (shipping: ShippingProps) => boolean = shipping => {
  if (shipping.phone && !/^\+?\(?[0-9]+\)?-?[0-9]+$/.test(shipping.phone)) return false
  return [shipping.name, shipping.phone, shipping.address].every(value => !!value)
}

const ShippingInput: React.FC<{
  value?: ShippingProps
  onChange?: (value: ShippingProps) => void
  isValidating?: boolean
  shippingMethods?: ShippingOptionProps[]
  isGiftPlanDeliverable?: boolean
  defaultValue?: ShippingProps
}> = ({ value, onChange, isValidating, shippingMethods, isGiftPlanDeliverable, defaultValue }) => {
  const { formatMessage } = useIntl()
  const { currencyId: appCurrencyId, settings } = useApp()
  const { handleCityChange, handleDistrictChange } = useTwZipCode()
  const [isOutsideTaiwanIsland, setIsOutsideTaiwanIsland] = useState(value?.isOutsideTaiwanIsland === 'true')

  const nameRef = useRef<Input | null>(null)
  const phoneRef = useRef<Input | null>(null)
  const addressRef = useRef<Input | null>(null)
  const specificationRef = useRef<TextArea | null>(null)

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

    let newValue: ShippingProps = defaultValue
      ? defaultValue
      : {
          name: value?.name?.trim() || '',
          phone: value?.phone?.trim() || '',
          zipCode: value?.zipCode || '',
          city: value?.city || '',
          district: value?.district || '',
          address: value?.address?.trim() || '',
          isOutsideTaiwanIsland: value?.isOutsideTaiwanIsland || 'false',
          shippingMethod: value?.shippingMethod || 'home-delivery',
          specification: value?.specification?.trim() || '',
          storeId: value?.storeId || '',
          storeName: value?.storeName || '',
          ...newShippingOption,
        }

    let newZipCode = value?.zipCode

    if (key === 'city') {
      newZipCode = zipCodes[inputValue][districts[inputValue][0]]
    } else if (key === 'district' && value?.city) {
      newZipCode = zipCodes[value.city][inputValue]
    }

    newValue = { ...value, zipCode: newZipCode, [key]: inputValue }

    if (key === 'city') {
      newValue['district'] = districts[inputValue][0]
      handleDistrictChange(districts[inputValue][0])
    } else if (key === 'isOutsideTaiwanIsland' && inputValue === 'true') {
      newValue['shippingMethod'] = ''
    }

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

  const currentShippingMethod = useMemo(
    () =>
      shippingMethods?.filter(shippingMethod => shippingMethod.enabled).some(v => v.id === value?.shippingMethod)
        ? value?.shippingMethod
        : shippingMethods?.filter(shippingMethod => shippingMethod.enabled).some(v => v.id === 'home-delivery')
        ? 'home-delivery'
        : shippingMethods?.filter(shippingMethod => shippingMethod.enabled)?.[0].id,
    [shippingMethods],
  )
  useEffect(() => {
    handleChange('shippingMethod', currentShippingMethod || '')
  }, [currentShippingMethod])
  return (
    <div>
      <StyledTitle className="mb-4">{formatMessage(inputMessages.ShippingInput.shippingInput)}</StyledTitle>

      {isGiftPlanDeliverable && (
        <GiftPlanDeliverNoticeBlock className="mb-4">
          <p>{formatMessage(inputMessages.ShippingInput.giftPlanDeliverNotice1)}</p>
          <p>{formatMessage(inputMessages.ShippingInput.giftPlanDeliverNotice2)}</p>
          <p>{formatMessage(inputMessages.ShippingInput.giftPlanDeliverNotice3)}</p>
        </GiftPlanDeliverNoticeBlock>
      )}

      {shippingMethods && !isOutsideTaiwanIsland && (
        <Form.Item required label={formatMessage(inputMessages.ShippingInput.shippingMethod)}>
          <Radio.Group
            value={
              shippingMethods.filter(shippingMethod => shippingMethod.enabled).some(v => v.id === value?.shippingMethod)
                ? value?.shippingMethod
                : shippingMethods.filter(shippingMethod => shippingMethod.enabled).some(v => v.id === 'home-delivery')
                ? 'home-delivery'
                : shippingMethods.filter(shippingMethod => shippingMethod.enabled)?.[0].id
            }
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
                          <Button onClick={() => handleStoreSelect()}>
                            {formatMessage(inputMessages.ShippingInput.selectStore)}
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
            required={!isOutsideTaiwanIsland}
            label={formatMessage(inputMessages['*'].receiverName)}
            validateStatus={
              !isOutsideTaiwanIsland && isValidating && nameRef.current?.input.value === '' ? 'error' : undefined
            }
          >
            <Input
              ref={nameRef}
              placeholder={formatMessage(inputMessages.ShippingInput.nameText)}
              defaultValue={value?.name || ''}
              value={isOutsideTaiwanIsland ? undefined : value?.name}
              disabled={isOutsideTaiwanIsland}
              onChange={event => handleChange('name', event.target.value)}
              onBlur={event => handleChange('name', event.target.value)}
            />
          </Form.Item>
        </div>
        <div className="col-12 col-lg-6">
          <Form.Item
            required={!isOutsideTaiwanIsland}
            label={formatMessage(inputMessages.ShippingInput.receiverPhone)}
            validateStatus={
              !isOutsideTaiwanIsland &&
              isValidating &&
              (phoneRef.current?.input.value === '' ||
                !/^\+?\(?[0-9]+\)?-?[0-9]+$/.test(phoneRef.current?.input.value || ''))
                ? 'error'
                : undefined
            }
          >
            <Input
              ref={phoneRef}
              placeholder={formatMessage(inputMessages.ShippingInput.mobilePhone)}
              defaultValue={value?.phone || ''}
              value={isOutsideTaiwanIsland ? undefined : value?.phone}
              disabled={isOutsideTaiwanIsland}
              onChange={event => handleChange('phone', event.target.value)}
              onBlur={event => handleChange('phone', event.target.value)}
            />
          </Form.Item>
        </div>
      </div>

      {!!Number(settings['checkout.taiwan_shipping_selector']) ? (
        <Form.Item
          required={!isOutsideTaiwanIsland}
          label={formatMessage(inputMessages.ShippingInput.receiverAddress)}
          validateStatus={
            !isOutsideTaiwanIsland && isValidating && addressRef.current?.input.value === '' ? 'error' : undefined
          }
        >
          <div className="row">
            <div className="col-12 col-lg-2">
              <Select className="col-12" disabled value={isOutsideTaiwanIsland ? undefined : value?.zipCode}></Select>
            </div>
            <div className="col-12 col-lg-2">
              <Select
                className="col-12"
                value={isOutsideTaiwanIsland ? undefined : value?.city}
                onChange={(v: string) => {
                  handleChange('city', v)
                  handleCityChange(v)
                }}
                disabled={isOutsideTaiwanIsland}
              >
                {cities?.map(city => {
                  return (
                    <Select.Option
                      key={city}
                      disabled={[
                        formatMessage(inputMessages.ShippingInput.penghuCounty),
                        formatMessage(inputMessages.ShippingInput.kinmenCounty),
                        formatMessage(inputMessages.ShippingInput.lienchiangCounty),
                      ].includes(city)}
                    >
                      {city}
                    </Select.Option>
                  )
                })}
              </Select>
            </div>
            <div className="col-12 col-lg-2">
              <Select
                className="col-12"
                value={isOutsideTaiwanIsland ? undefined : value?.district}
                onChange={(w: string) => {
                  handleChange('district', w)
                  handleDistrictChange(w)
                }}
                disabled={isOutsideTaiwanIsland}
              >
                {districts?.[value?.city || '']?.map(district => {
                  return (
                    <Select.Option
                      key={district}
                      disabled={[
                        formatMessage(inputMessages.ShippingInput.diaoyutaiIslands),
                        formatMessage(inputMessages.ShippingInput.ludaoTownship),
                        formatMessage(inputMessages.ShippingInput.lanyuTownship),
                        formatMessage(inputMessages.ShippingInput.dongshaIslands),
                        formatMessage(inputMessages.ShippingInput.nanshaIslands),
                      ].includes(district)}
                    >
                      {district}
                    </Select.Option>
                  )
                })}
              </Select>
            </div>
            <div className="col-12 col-lg-6">
              <Input
                ref={addressRef}
                placeholder={formatMessage(inputMessages.ShippingInput.addressText)}
                defaultValue={value?.address || ''}
                value={isOutsideTaiwanIsland ? undefined : value?.address}
                onBlur={event => handleChange('address', event.target.value)}
                onChange={event => handleChange('address', event.target.value)}
                disabled={isOutsideTaiwanIsland}
              />
            </div>
          </div>
          <StyledCheckBox
            defaultChecked={value?.isOutsideTaiwanIsland === 'true'}
            onChange={() => {
              setIsOutsideTaiwanIsland(!isOutsideTaiwanIsland)
              handleChange('isOutsideTaiwanIsland', (!isOutsideTaiwanIsland).toString())
            }}
          >
            {formatMessage(inputMessages.ShippingInput.outsideTaiwanIslandNoShipping)}
          </StyledCheckBox>
        </Form.Item>
      ) : (
        <Form.Item
          required
          label={formatMessage(inputMessages.ShippingInput.receiverAddress)}
          validateStatus={
            !isOutsideTaiwanIsland && isValidating && addressRef.current?.input.value === '' ? 'error' : undefined
          }
        >
          <Input
            ref={addressRef}
            placeholder={formatMessage(inputMessages.ShippingInput.addressText)}
            defaultValue={value?.address || ''}
            value={value?.address}
            onBlur={event => handleChange('address', event.target.value)}
            onChange={event => handleChange('address', event.target.value)}
          />
        </Form.Item>
      )}

      {!isGiftPlanDeliverable && (
        <Form.Item label={formatMessage(inputMessages.ShippingInput.specification)}>
          <Input.TextArea
            ref={specificationRef}
            rows={5}
            defaultValue={value?.specification || ''}
            onBlur={event => handleChange('specification', event.target.value)}
          />
        </Form.Item>
      )}
    </div>
  )
}

export default ShippingInput
