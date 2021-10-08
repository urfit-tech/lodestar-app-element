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
