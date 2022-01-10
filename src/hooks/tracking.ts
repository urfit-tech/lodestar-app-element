import { useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import TagManager from 'react-gtm-module'
import { hotjar } from 'react-hotjar'
import { useApp } from '../contexts/AppContext'
import {
  getActivityCollectionQuery,
  getMemberCollectionQuery,
  getProgramCollectionQuery,
  getProgramPackageCollectionQuery,
} from '../graphql/queries'
import * as hasura from '../hasura'
import { Category, Member } from '../types/data'

type ProductMeta = {
  type: 'Program' | 'Activity' | 'Project' | 'ProgramPackage' // TODO: add other products
  id: string
}
type EventData = {
  id: string
  name: string
  price: string
  brand: string
  categories: Category[]
  authors: Pick<Member, 'id' | 'name'>[]
  quantity: number
  position: number
  currency: string
}
type EventProductMeta = Pick<EventData, 'id' | 'name' | 'categories' | 'authors' | 'price'>

type EventTrackingProps = {
  eventName: string
  data: EventData[]
}

export const useTracking = () => {
  const { settings, currencyId: appCurrencyId, id: appId } = useApp()
  const { getEventMetaProductList } = useMetaProducts()

  const initialize = () => {
    if (settings['tracking.ga_id']) {
      ReactGA.initialize(settings['tracking.ga_id'])
      ReactGA.plugin.require('ecommerce')
      ReactGA.plugin.require('ec')
    }

    if (settings['tracking.fb_pixel_id']) {
      ReactPixel.init(settings['tracking.fb_pixel_id'])
    }

    try {
      settings['tracking.hotjar_id'] &&
        settings['tracking.hotjar_sv'] &&
        hotjar.initialize(parseInt(settings['tracking.hotjar_id']), parseInt(settings['tracking.hotjar_sv']))
    } catch (error) {
      process.env.NODE_ENV === 'development' && console.error(error)
    }

    if (settings['tracking.gtm_id']) {
      try {
        if (settings['tracking.gtm_id']) {
          TagManager.initialize({
            gtmId: settings['tracking.gtm_id'],
          })
        }
      } catch (error) {
        process.env.NODE_ENV === 'development' && console.error(error)
      }
    }
  }

  const memberInfo = () => {
    if (settings['tracking.cw.enabled']) {
    }
  }

  const pageView = () => {
    if (settings['tracking.ga_id']) {
      ReactGA.pageview(window.location.pathname + window.location.search)
    }
  }

  const impressProducts = async (productIdList: ProductMeta[], pageFrom: string) => {
    let eventProductMetaList: EventProductMeta[] = []
    if (settings['tracking.gtm_id'] || settings['tracking.cw.enabled']) {
      eventProductMetaList = await getEventMetaProductList(productIdList)
    }
    if (settings['tracking.gtm_id']) {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null })
      ;(window as any).dataLayer.push({
        event: 'productImpression',
        ecommerce: {
          currencyCode: appCurrencyId || 'TWD',
          impressions: eventProductMetaList.map((productMeta, index) => {
            return {
              id: productMeta.id,
              name: productMeta.name,
              price: productMeta.price,
              brand: settings['title'] || appId,
              category: productMeta.categories.map(category => category.name).join('|'),
              variant: productMeta.authors.map(author => author.name).join('|'),
              list: pageFrom,
              position: index + 1,
            }
          }),
        },
      })
    }

    if (settings['tracking.cw.enabled']) {
    }
  }

  const showProductDetail = () => {}

  const clickProduct = () => {}

  const addToCart = () => {}

  const removeFromCart = () => {}

  const checkout = () => {}

  const checkoutMoveOn = () => {}

  const purchase = () => {}

  return {
    initialize,
  }
}

const useMetaProducts = () => {
  const apolloClient = useApolloClient()

  const getEventMetaProductList = async (productMetaList: ProductMeta[]): Promise<EventProductMeta[]> => {
    const programIdList = productMetaList.filter(meta => meta.type === 'Program').map(meta => meta.id)
    const activityIdList = productMetaList.filter(meta => meta.type === 'Activity').map(meta => meta.id)
    const programPackageIdList = productMetaList.filter(meta => meta.type === 'ProgramPackage').map(meta => meta.id)
    //const projectIdList = productMetaList.filter(meta => meta.type === 'Project').map(meta=>meta.id)
    let eventMetaProductList: EventProductMeta[] = []

    try {
      if (programIdList.length > 0) {
        const programList = await getProgramList(programIdList)
        eventMetaProductList = [...eventMetaProductList, ...programList]
      }

      if (activityIdList.length > 0) {
        const activityList = await getActivityList(activityIdList)
        eventMetaProductList = [...eventMetaProductList, ...activityList]
      }

      if (programPackageIdList.length > 0) {
        const programPackageList = await getProgramPackageList(programPackageIdList)
        eventMetaProductList = [...eventMetaProductList, ...programPackageList]
      }
    } catch (error) {
      process.env.NODE_ENV === 'development' && console.error(error)
    }

    return eventMetaProductList
  }

  const getProgramList = async (programIdList: string[]): Promise<EventProductMeta[]> => {
    const { data: programData } = await apolloClient.query<
      hasura.GET_PROGRAM_COLLECTION,
      hasura.GET_PROGRAM_COLLECTIONVariables
    >({
      query: getProgramCollectionQuery(programFields),
      variables: {
        whereClause: {
          id: { _in: programIdList },
        },
      },
    })
    const memberIdList = programData?.program?.reduce<string[]>((accumulator, currentValue) => {
      const currentProgramAuthorIdList = currentValue?.program_roles.map(programRole => programRole.member_id) || []

      return [...accumulator, ...currentProgramAuthorIdList]
    }, [])

    const { data: authorData } = await apolloClient.query<
      hasura.GET_MEMBER_COLLECTION,
      hasura.GET_MEMBER_COLLECTIONVariables
    >({
      query: getMemberCollectionQuery(memberFields),
      variables: {
        whereClause: {
          id: { _in: memberIdList },
        },
      },
    })

    return programData?.program?.map(p => {
      const listPrice = p?.program_plans[0]?.list_price || 0
      const salePrice =
        (p?.program_plans[0]?.sold_at?.getTime() || 0) > Date.now()
          ? p?.program_plans[0]?.sale_price
          : (p?.program_plans[0]?.sold_at?.getTime() || 0) > Date.now()
          ? p?.program_plans[0]?.sale_price
          : undefined
      return {
        id: p?.id,
        name: p?.title,
        price: salePrice || listPrice,
        categories: p?.program_categories.map(d => ({ id: d.category.id, name: d.category.name })),
        authors: p?.program_roles.map(d => {
          const { id, name } = authorData.member_public.filter(m => m.id === d.member_id)[0]
          return { id, name }
        }),
      } as EventProductMeta
    })
  }

  const getProgramPackageList = async (prpgramPackageIdList: string[]): Promise<EventProductMeta[]> => {
    const { data: programPackageData } = await apolloClient.query<
      hasura.GET_PROGRAM_PACKAGE_COLLECTION,
      hasura.GET_PROGRAM_PACKAGE_COLLECTIONVariables
    >({
      query: getProgramPackageCollectionQuery(programPackageFields),
      variables: {
        whereClause: {
          id: { _in: prpgramPackageIdList },
        },
      },
    })
    let memberIdList = new Set<string>()
    programPackageData?.program_package?.forEach(pp => {
      pp.program_package_programs.forEach(pp => {
        pp.program.program_roles.forEach(pr => {
          memberIdList.add(pr.member_id)
        })
      })
    })

    const { data: authorData } = await apolloClient.query<
      hasura.GET_MEMBER_COLLECTION,
      hasura.GET_MEMBER_COLLECTIONVariables
    >({
      query: getMemberCollectionQuery(memberFields),
      variables: {
        whereClause: {
          id: { _in: Array.from(memberIdList) },
        },
      },
    })

    return programPackageData?.program_package?.map(pp => {
      const listPrice = pp.program_package_plans[0]?.list_price
      const salePrice =
        (pp.program_package_plans[0]?.sold_at?.getTime() || 0) > Date.now()
          ? pp.program_package_plans[0]?.sale_price
          : (pp.program_package_plans[0]?.sold_at?.getTime() || 0) > Date.now()
          ? pp.program_package_plans[0]?.sale_price
          : undefined
      const programPackageProgramRolesMemberIdList = Array.from(
        new Set(
          pp.program_package_programs.reduce<string[]>((acc, curr) => {
            const programRoleMemberIdList = curr?.program.program_roles?.map(pr => pr?.member_id) || []
            return [...programRoleMemberIdList, ...acc]
          }, []),
        ),
      )
      const programPackage: EventProductMeta = {
        id: pp.id,
        name: pp.title,
        price: salePrice || listPrice,
        categories: pp?.program_package_categories?.map(pc => pc?.category as Category) || [],
        authors: programPackageProgramRolesMemberIdList.map(d => {
          const targetAuthor = authorData.member_public.find(m => m.id === d) || { id: '', name: '' }
          return { id: targetAuthor.id || '', name: targetAuthor.name || '' }
        }),
      }
      return programPackage
    })
  }

  const getActivityList = async (activityList: string[]): Promise<EventProductMeta[]> => {
    const { data: activityData } = await apolloClient.query<
      hasura.GET_ACTIVITY_COLLECTION,
      hasura.GET_ACTIVITY_COLLECTIONVariables
    >({
      query: getActivityCollectionQuery(activityFields),
      variables: {
        whereClause: {
          id: { _in: activityList },
        },
      },
    })

    let memberIdList = new Set<string>()
    activityData?.activity?.forEach(a => {
      memberIdList.add(a.organizer_id)
    })

    const { data: authorData } = await apolloClient.query<
      hasura.GET_MEMBER_COLLECTION,
      hasura.GET_MEMBER_COLLECTIONVariables
    >({
      query: getMemberCollectionQuery(memberFields),
      variables: {
        whereClause: {
          id: { _in: Array.from(memberIdList) },
        },
      },
    })

    return activityData.activity.map(activity => {
      const organizer = authorData.member_public.find(author => author.id === activity.organizer_id) || {
        id: '',
        name: '',
      }
      const activityMetaProduct: EventProductMeta = {
        id: activity.id,
        name: activity.title,
        price: activity.activity_tickets[0].price || 0,
        categories: activity.activity_categories?.map(ac => ac?.category as Category) || [],
        authors: [{ id: organizer.id || '', name: organizer.name || '' }],
      }
      return activityMetaProduct
    })
  }

  return {
    getProgramList,
    getProgramPackageList,
    getActivityList,
    getEventMetaProductList,
  }
}

const programFields = gql`
  fragment programFields on program {
    id
    title
    program_categories {
      category {
        id
        name
      }
    }
    program_roles(where: { name: { _eq: "instructor" } }, order_by: { created_at: asc, id: asc }) {
      id
      member_id
    }
    program_plans(where: { published_at: { _is_null: false } }) {
      id
      type
      title
      currency_id
      list_price
      sale_price
      sold_at
      discount_down_price
      published_at
    }
  }
`

const memberFields = gql`
  fragment memberFields on member {
    id
    name
  }
`

const programPackageFields = gql`
  fragment programPackageFields on program_package {
    id
    title
    program_package_programs {
      program(where: { published_at: { _is_null: false } }) {
        program_roles(where: { name: { _eq: "instructor" } }, order_by: { created_at: asc }) {
          id
          name
          member_id
        }
        program_content_sections {
          program_contents_aggregate {
            aggregate {
              sum {
                duration
              }
            }
          }
        }
      }
    }
    program_package_plans {
      list_price
      sale_price
      sold_at
      period_amount
      period_type
    }
    program_package_categories {
      category {
        id
        name
      }
    }
    published_at
  }
`

const activityFields = gql`
  fragment activityFields on activity(where: { published_at: { _lt: "now()" }}) {
    id
    title
    published_at
    organizer_id
    activity_categories {
      category {
        id
        name
      }
    }
    activity_tickets(where:{is_published: { _eq: true}}) {
      price
    }
  }
`
