import { useApolloClient } from '@apollo/react-hooks'
import { sum } from 'ramda'
import { useApp } from '../contexts/AppContext'
import { notEmpty } from '../helpers'
import { getResourceCollection, Resource, ResourceType } from './resource'

const convertProductType: (originalType: ResourceType, toMetaProduct: boolean) => ResourceType = (
  originalType: ResourceType,
  toMetaProduct: boolean = true,
) => {
  switch (originalType) {
    case 'program_plan':
      return toMetaProduct ? ('program' as ResourceType) : originalType
    case 'program_package_plan':
      return toMetaProduct ? ('program_package' as ResourceType) : originalType
    case 'activity_ticket':
      return toMetaProduct ? ('activity' as ResourceType) : originalType
    case 'merchandise_spec':
      return toMetaProduct ? ('merchandise' as ResourceType) : originalType
    default:
      return originalType
  }
}

const convertPathName = (pathName: string) => {
  const pathPatterns = pathName.match(/^\/([^\/]+)\/?(.*)$/)
  pathPatterns?.shift()
  return pathPatterns?.join('_') || '_'
}

type CwProductBaseType = {
  id: string
  type: string
  item: string | null
  title: string
  url: string
  authors: { id: string; name: string }[] | null
  channels: { master: { id: string[] } }
  keywords: string
  price?: number
  utmSource?: string
}

type CwProductContentType = CwProductBaseType & {
  content_id: string
  content_name: string
}

type CwProductSalesType = CwProductBaseType & {
  price: number
}

const convertCwProduct: (
  resource: Resource,
  utmSource?: string,
  options?: { separator: string },
) => CwProductBaseType | CwProductContentType | CwProductSalesType = (
  resource: Resource,
  utmSource: string | undefined,
  options: { separator: string } = { separator: '|' },
) => {
  const baseProduct = {
    id: resource.id,
    type: resource.type,
    title: resource.title,
    item: resource.sku || null,
    url: window.location.href,
    authors: resource.owners,
    channels: {
      master: {
        id: resource.categories || [],
      },
    },
    keywords:
      resource?.tags?.join(options.separator) ||
      document.querySelector('meta[name="keywords"]')?.getAttribute('content') ||
      '',
    utmSource,
  }
  switch (resource.type) {
    case 'program_content':
      return {
        ...baseProduct,
        id: (resource.metaId && resource.metaId.split(':')[2]) || '',
        title: resource.variants?.join(options.separator) || '',
        content_id: resource.id,
        content_name: resource.title,
      }
    case 'post':
      return baseProduct
    default:
      return {
        ...baseProduct,
        price: resource.price,
      }
  }
}

export const useTracking = (trackingOptions = { separator: '|' }) => {
  const { settings, currencyId: appCurrencyId, id: appId } = useApp()
  const brand = settings['name'] || document.title
  const enabledCW = Boolean(Number(settings['tracking.cw.enabled']))
  const apolloClient = useApolloClient()
  return {
    view: () => {},
    impress: (
      resources: (Resource | null)[],
      options?: {
        collection?: string
        ignore?: 'EEC' | 'CUSTOM'
        utmSource?: string
      },
    ) => {
      if (options?.ignore !== 'EEC') {
        const impressionsWithProducts = resources.reduce<
          {
            id: string
            name: string
            price: number
            brand: string
            category?: string
            variant?: string
            quantity: number
            list: string
            position: number
          }[]
        >((prev, curr, index) => {
          const flattenedResources = curr?.products?.filter(r => r?.type !== 'program_content') ?? [curr]
          const products =
            flattenedResources
              ?.map(product =>
                product
                  ? {
                      id: product.sku || product.id,
                      name: product.title,
                      price: product.price || 0,
                      brand,
                      category: product.categories?.join(trackingOptions.separator),
                      variant:
                        product.type === 'program_package' || product.type === 'program_package_plan'
                          ? product?.variants?.join(trackingOptions.separator)
                          : product.owners?.map(member => member.name).join(trackingOptions.separator),
                      quantity: 1, // TODO: use the inventory
                      list: options?.collection || convertPathName(window.location.pathname),
                      position: index + 1,
                    }
                  : null,
              )
              .filter(notEmpty) || []
          return [...prev, ...products]
        }, [])

        if (impressionsWithProducts.length > 0) {
          ;(window as any).dataLayer = (window as any).dataLayer || []
          ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
          ;(window as any).dataLayer.push({
            event: 'productImpression',
            label: impressionsWithProducts.map(impression => impression.name).join('|'),
            value: sum(impressionsWithProducts.map(impression => impression.price || 0)),
            ecommerce: {
              currencyCode: appCurrencyId,
              impressions: impressionsWithProducts,
            },
          })
        }
      }

      if (enabledCW && options?.ignore !== 'CUSTOM') {
        const cwProducts = resources.map(r => (r ? convertCwProduct(r, options?.utmSource) : null)).filter(notEmpty)
        if (cwProducts.length > 0) {
          ;(window as any).dataLayer = (window as any).dataLayer || []
          ;(window as any).dataLayer.push({ itemData: null })
          ;(window as any).dataLayer.push({
            event: 'cwData',
            itemData: {
              products: cwProducts,
            },
          })
        }
      }
    },
    click: (
      resource: Resource,
      options?: {
        collection?: string
        position?: number
        ignore?: 'EEC' | 'CUSTOM'
      },
    ) => {
      if (options?.ignore !== 'EEC') {
        const resourceOrProducts = resource.products?.filter(r => r?.type !== 'program_content') ?? [resource]
        const products = resourceOrProducts
          .map(resource =>
            resource
              ? {
                  id: resource.sku || resource.id,
                  name: resource.title,
                  price: resource.price,
                  brand,
                  category: resource.categories?.join(trackingOptions.separator),
                  variant:
                    resource.type === 'program_package' || resource.type === 'program_package_plan'
                      ? resource?.variants?.join(trackingOptions.separator)
                      : resource.owners?.map(member => member.name).join(trackingOptions.separator),
                  position: options?.position,
                }
              : null,
          )
          .filter(notEmpty)
        ;(window as any).dataLayer = (window as any).dataLayer || []
        ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.

        products.forEach(product => {
          ;(window as any).dataLayer.push({
            event: 'productClick',
            label: product.name,
            value: product.price,
            ecommerce: {
              currencyCode: appCurrencyId,
              click: {
                actionField: { list: options?.collection || convertPathName(window.location.pathname) },
                products: [product],
              },
            },
          })
        })
      }
    },
    detail: async (
      resource: Resource,
      options?: {
        collection?: string
        ignore?: 'EEC' | 'CUSTOM'
        utmSource?: string
      },
    ) => {
      if (options?.ignore !== 'EEC') {
        const resourceOrProducts = resource.products?.filter(r => r?.type !== 'program_content') ?? [resource]
        const products = resourceOrProducts
          .map(resource =>
            resource
              ? {
                  id: resource.sku || resource.id,
                  name: resource.title,
                  price: resource.price,
                  brand: settings['name'] || document.title,
                  category: resource.categories?.join(trackingOptions.separator),
                  variant:
                    resource.type === 'program_package' || resource.type === 'program_package_plan'
                      ? resource.variants?.join(trackingOptions.separator)
                      : resource.owners?.map(member => member.name).join(trackingOptions.separator),
                }
              : null,
          )
          .filter(notEmpty)
        ;(window as any).dataLayer = (window as any).dataLayer || []
        ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
        products.forEach(product => {
          ;(window as any).dataLayer.push({
            event: 'productDetail',
            label: product.name,
            value: product.price,
            ecommerce: {
              currencyCode: appCurrencyId,
              detail: {
                actionField: { list: options?.collection || convertPathName(window.location.pathname) },
                products: [product],
              },
            },
          })
        })
      }
      if (enabledCW && options?.ignore !== 'CUSTOM') {
        const isProgramContent = resource.type === 'program_content'
        let products = resource.products?.filter(r => r?.type !== 'program_content')
        if (isProgramContent && resource.metaId) {
          const metaProducts = await getResourceCollection(apolloClient, [resource.metaId], true)
          products = metaProducts[0]?.products?.filter(p => p?.type === 'program_plan')
        }
        const targetResource = resource && convertCwProduct(resource, options?.utmSource)
        const subResources = products && products.filter(notEmpty).map(p => convertCwProduct(p, options?.utmSource))

        ;(window as any).dataLayer = (window as any).dataLayer || []
        ;(window as any).dataLayer.push({ itemData: { products: null, program: null, article: null } })

        if (subResources) {
          subResources.forEach(resource => {
            ;(window as any).dataLayer.push({
              event: 'cwData',
              itemData: {
                products: [{ ...targetResource, ...resource }],
                program: { ...targetResource, ...resource },
                article: { ...targetResource, ...resource },
              },
            })
          })

          return
        }

        ;(window as any).dataLayer.push({
          event: 'cwData',
          itemData: {
            products: [targetResource],
            program: targetResource,
            article: targetResource,
          },
        })
      }
    },
    addToCart: (
      resource: Resource,
      options?: {
        direct?: boolean
        quantity?: number
      },
    ) => {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      ;(window as any).dataLayer.push({
        event: 'addToCart',
        label: resource.title,
        value: resource.price,
        ecommerce: {
          currencyCode: appCurrencyId,
          add: {
            direct: options?.direct,
            products: [
              {
                id: resource.sku || resource.id,
                name: resource.title,
                price: resource.price,
                brand,
                category: resource.categories?.join(trackingOptions.separator),
                variant:
                  resource.type === 'program_package' || resource.type === 'program_package_plan'
                    ? resource?.variants?.join(trackingOptions.separator)
                    : resource.owners?.map(member => member.name).join(trackingOptions.separator),
                quantity: options?.quantity || 1, // TODO: use the inventory
              },
            ],
          },
        },
      })
    },
    removeFromCart: (
      resource: Resource,
      options?: {
        quantity?: number
      },
    ) => {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      ;(window as any).dataLayer.push({
        event: 'removeFromCart',
        label: resource.title,
        value: resource.price,
        ecommerce: {
          currencyCode: appCurrencyId,
          remove: {
            products: [
              {
                id: resource.sku || resource.id,
                name: resource.title,
                price: resource.price,
                brand: settings['name'] || document.title,
                category: resource.categories?.join(trackingOptions.separator),
                variant:
                  resource.type === 'program_package' || resource.type === 'program_package_plan'
                    ? resource?.variants?.join(trackingOptions.separator)
                    : resource.owners?.map(member => member.name).join(trackingOptions.separator),
                quantity: options?.quantity || 1, // TODO: use the inventory
              },
            ],
          },
        },
      })
    },
    checkout: (
      resources: Resource[],
      options?: {
        step?: number
        ignore?: 'EEC' | 'CUSTOM'
        utmSource?: string
      },
    ) => {
      const ecProducts = resources
        .map(resource =>
          resource
            ? {
                id: resource.sku || resource.id,
                name: resource.title,
                price: resource.price,
                brand,
                category: resource.categories?.join(trackingOptions.separator),
                variant:
                  resource.type === 'program_package' || resource.type === 'program_package_plan'
                    ? resource?.variants?.join(trackingOptions.separator)
                    : resource.owners?.map(member => member.name).join(trackingOptions.separator),
                quantity: resource.options?.quantity || 1, // TODO: use the cart product
              }
            : null,
        )
        .filter(notEmpty)
      if (ecProducts.length > 0) {
        ;(window as any).dataLayer = (window as any).dataLayer || []
        ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
        ;(window as any).dataLayer.push({
          event: 'checkout',
          label: resources.map(resource => resource.title).join('|'),
          value: sum(resources.map(resource => resource.price || 0)),
          ecommerce: {
            currencyCode: appCurrencyId,
            checkout: {
              actionField: { step: options?.step || 1 },
              products: ecProducts,
            },
          },
        })
      }
      if (enabledCW && options?.ignore !== 'CUSTOM') {
        const cwProducts = resources
          .map(resource => (resource ? convertCwProduct(resource, options?.utmSource) : null))
          .filter(notEmpty)
        if (cwProducts.length > 0) {
          ;(window as any).dataLayer = (window as any).dataLayer || []
          ;(window as any).dataLayer.push({ itemData: { products: null, program: null, article: null } })
          ;(window as any).dataLayer.push({
            event: 'cwData',
            itemData: {
              products: cwProducts,
              program: cwProducts[0],
              article: cwProducts[0],
            },
          })
        }
      }
    },
    addPaymentInfo: (options?: { step?: number; gateway?: string; method?: string }) => {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      ;(window as any).dataLayer.push({
        event: 'checkoutOption',
        label: options?.gateway,
        value: 0,
        ecommerce: {
          currencyCode: appCurrencyId,
          checkout_option: {
            actionField: {
              step: options?.step || 2,
              option: `${options?.gateway || 'unknown'}.${options?.method || 'unknown'}`,
            },
          },
        },
      })
    },
    purchase: (
      orderId: string,
      orderProducts: (Resource & { quantity: number })[],
      orderDiscounts: { name: string; price: number }[],
      options?: {
        step?: number
        ignore?: 'EEC' | 'CUSTOM'
        utmSource?: string
      },
    ) => {
      const ecProducts =
        orderProducts.map(product => ({
          id: product.sku || product.id,
          name: product.title,
          price: product.price,
          brand,
          category: product.categories?.join(trackingOptions.separator),
          variant:
            product.type === 'program_package' || product.type === 'program_package_plan'
              ? product?.variants?.join(trackingOptions.separator)
              : product.owners?.map(member => member.name).join(trackingOptions.separator),
          quantity: product.quantity,
          utmSource: options?.utmSource,
        })) || []
      if (ecProducts.length > 0) {
        ;(window as any).dataLayer = (window as any).dataLayer || []
        ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
        ;(window as any).dataLayer.push({
          event: 'purchase',
          label: orderProducts.map(orderProduct => orderProduct.title).join('|'),
          value: sum(orderProducts.map(orderProduct => orderProduct.price || 0)),
          ecommerce: {
            currencyCode: appCurrencyId,
            purchase: {
              actionField: {
                id: orderId,
                affiliation: document.title,
                revenue: sum(orderProducts.map(v => v.price || 0)) - sum(orderDiscounts.map(v => v.price)),
                coupon: orderDiscounts.map(v => v.name).join(trackingOptions.separator),
              },
              products: ecProducts,
            },
          },
        })
      }
      if (enabledCW && options?.ignore !== 'CUSTOM') {
        const cwProducts =
          orderProducts.map(product => {
            const productType = convertProductType(product.type, true)
            return {
              ...convertCwProduct(product, options?.utmSource || undefined),
              order_number: orderId,
              type: productType === 'program_package' ? 'package' : productType,
            }
          }) || []
        if (cwProducts.length > 0) {
          ;(window as any).dataLayer = (window as any).dataLayer || []
          ;(window as any).dataLayer.push({ itemData: { products: null, program: null, article: null } })
          ;(window as any).dataLayer.push({
            event: 'cwData',
            itemData: {
              products: cwProducts,
              program: cwProducts[0],
              article: cwProducts[0],
            },
          })
        }
      }
    },
  }
}
