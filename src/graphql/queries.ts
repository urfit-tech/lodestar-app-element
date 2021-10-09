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
