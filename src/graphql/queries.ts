import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

export const getProgramCollectionQuery = (programFields: DocumentNode) => gql`
  query GET_PROGRAM_COLLECTION($whereClause: program_bool_exp, $limit: Int, $orderByClause: [program_order_by!]) {
    program(where: $whereClause, limit: $limit, order_by: $orderByClause) {
      ...programFields
    }
  }
  ${programFields}
`

export const getProgramContentCollectionQuery = (programContentFields: DocumentNode) => gql`
  query GET_PROGRAM_CONTENT_COLLECTION(
    $whereClause: program_content_bool_exp
    $limit: Int
    $orderByClause: [program_content_order_by!]
  ) {
    program_content(where: $whereClause, limit: $limit, order_by: $orderByClause) {
      ...programContentFields
    }
  }
  ${programContentFields}
`
export const getProgramPackageCollectionQuery = (programPackageFields: DocumentNode) => gql`
  query GET_PROGRAM_PACKAGE_COLLECTION(
    $whereClause: program_package_bool_exp
    $limit: Int
    $orderByClause: [program_package_order_by!]
  ) {
    program_package(where: $whereClause, limit: $limit, order_by: $orderByClause) {
      ...programPackageFields
    }
  }
  ${programPackageFields}
`

export const getActivityCollectionQuery = (activityFields: DocumentNode) => gql`
  query GET_ACTIVITY_COLLECTION($whereClause: activity_bool_exp, $limit: Int, $orderByClause: [activity_order_by!]) {
    activity(where: $whereClause, limit: $limit, order_by: $orderByClause) {
      ...activityFields
    }
  }
  ${activityFields}
`
