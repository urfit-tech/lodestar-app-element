import { useApolloClient } from '@apollo/react-hooks'
import { Button } from '@chakra-ui/react'
import { useEditor, useNode, UserComponent } from '@craftjs/core'
import gql from 'graphql-tag'
import { uniqBy, unnest } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import hasura from '../../hasura'
import { notEmpty } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { usePublishedActivityCollection } from '../../hooks/data'
import { ActivityCollection, Category } from '../../types/data'
import ActivityCard from '../cards/ActivityCard'
import { CraftRefBlock } from '../common'
import Skeleton from '../Skeleton'

const StyledButton = styled(Button)`
  && {
    height: 2.75rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    border-radius: 2rem;
  }
`
const CraftActivity: UserComponent<{
  withSelector?: boolean
  defaultCategoryIds: string[]
  type: ActivityCollection['type']
  ids: ActivityCollection['ids']
}> = ({ withSelector, defaultCategoryIds, type, ids, children }) => {
  const { formatMessage } = useIntl()
  const [active = null] = useQueryParam('categories', StringParam)
  const [classification = null, setClassification] = useQueryParam('classification', StringParam)
  const apolloClient = useApolloClient()
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const [activityIds, setActivityIds] = useState<string[]>([])
  const {
    connectors: { connect },
    selected,
    hovered,
  } = useNode(node => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
  }))
  const { loadingActivities, errorActivities, activities } = usePublishedActivityCollection({
    ids: activityIds,
  })
  useEffect(() => {
    if (type === 'newest') {
      apolloClient
        .query({
          query: gql`
            query GET_NEWEST_ACTIVITIES($limit: Int) {
              activity(where: { published_at: { _is_null: false } }, limit: $limit) {
                id
              }
            }
          `,
          variables: {
            limit: ids.length > 0 ? ids.length : undefined,
          },
        })
        .then(({ data }: { data?: hasura.GET_NEWEST_ACTIVITIES }) => {
          setActivityIds(data?.activity.map(v => v.id) || [])
        })
    } else {
      setActivityIds(ids.filter(notEmpty) || [])
    }
  }, [type, ids, apolloClient])

  if (loadingActivities)
    return (
      <>
        <Skeleton height="20px" className="my-1" />
        <Skeleton height="20px" className="my-1" />
        <Skeleton height="20px" className="my-1" />
      </>
    )

  const selectedActivities = activities.filter(
    activity => !defaultCategoryIds?.some(categoryId => activity.categories.map(c => c.id).indexOf(categoryId) === -1),
  )

  const categories: Category[] = uniqBy(
    category => category.id,
    unnest(selectedActivities.map(activity => activity.categories || [])).filter(
      category => !defaultCategoryIds?.includes(category.id),
    ),
  )

  return (
    <div className="container">
      {withSelector && (
        <div className="mb-3">
          <StyledButton
            colorScheme="primary"
            variant={classification === null ? 'solid' : 'outline'}
            className="mb-2"
            onClick={(e: Event) => (enabled ? e.preventDefault() : setClassification(null))}
          >
            {formatMessage(commonMessages.button.allCategory)}
          </StyledButton>
          {categories
            .filter(category => category.id !== active)
            .map(category => (
              <StyledButton
                key={category.id}
                colorScheme="primary"
                variant={classification === category.id ? 'solid' : 'outline'}
                className="ml-2 mb-2"
                onClick={(e: Event) => (enabled ? e.preventDefault() : setClassification(category.id))}
              >
                {category.name}
              </StyledButton>
            ))}
        </div>
      )}
      {children}
      <div className="row">
        {selectedActivities.map(activity => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <CraftRefBlock
              ref={ref => ref && connect(ref)}
              style={{
                width: '100%',
                marginBottom: '12px',
              }}
              events={{ hovered, selected }}
              options={{ enabled }}
            >
              <ActivityCard key={activity.id} activity={activity} craftEnabled={enabled} />
            </CraftRefBlock>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CraftActivity
