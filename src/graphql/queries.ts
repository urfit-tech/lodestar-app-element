import { gql } from '@apollo/client'
import { DocumentNode } from 'graphql'

export const getMemberCollectionQuery = (memberFields: DocumentNode) => gql`
  query GET_MEMBER_COLLECTION(
    $whereClause: member_public_bool_exp
    $limit: Int
    $orderByClause: [member_public_order_by!]
  ) {
    member_public(where: $whereClause, limit: $limit, order_by: $orderByClause) {
      ...memberFields
    }
  }
  ${memberFields}
`
export const getProjectCollectionQuery = (projectFields: DocumentNode) => gql`
  query GET_PROJECT_COLLECTION($whereClause: project_bool_exp, $limit: Int, $orderByClause: [project_order_by!]) {
    project(where: $whereClause, limit: $limit, order_by: $orderByClause) {
      ...projectFields
    }
  }
  ${projectFields}
`

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

export const getProgramPackageFamilyQuery = (fields: DocumentNode) => gql`
  query GET_PROGRAM_PACKAGE_FAMILY($programPackageId: uuid, $programPackagePlanId: uuid) {
    program_package(
      where: { id: { _eq: $programPackageId }, program_package_plans: { id: { _eq: $programPackagePlanId } } }
    ) {
      program_package_plans(where: { id: { _eq: $programPackagePlanId } }) {
        ...trackingProgramPackagePlanFields
      }
      ...trackingProgramPackageFields
    }
  }
  ${fields}
`

export const getProgramFamilyQuery = (fields: DocumentNode) => gql`
  query GET_PROGRAM_FAMILY(
    $programId: uuid
    $programPlanId: uuid
    $programContentSectionId: uuid
    $programContentId: uuid
  ) {
    program(
      where: {
        id: { _eq: $programId }
        program_plans: { id: { _eq: $programPlanId } }
        program_content_sections: {
          id: { _eq: $programContentSectionId }
          program_contents: { id: { _eq: $programContentId } }
        }
      }
    ) {
      program_plans(where: { id: { _eq: $programPlanId } }) {
        ...trackingProgramPlanFields
      }
      program_content_sections(
        where: { id: { _eq: $programContentSectionId }, program_contents: { id: { _eq: $programContentId } } }
      ) {
        ...trackingProgramContentSectionFields
        program_contents(where: { id: { _eq: $programContentId } }) {
          ...trackingProgramContentFields
        }
      }
      ...trackingProgramFields
    }
  }
  ${fields}
`

export const getActivityFamilyQuery = (fields: DocumentNode) => gql`
  query GET_ACTIVITY_FAMILY($activityId: uuid, $activityTicketId: uuid) {
    activity(where: { id: { _eq: $activityId }, activity_tickets: { id: { _eq: $activityTicketId } } }) {
      activity_tickets(where: { id: { _eq: $activityTicketId } }) {
        ...trackingActivityTicketFields
      }
      ...trackingActivityFields
    }
  }
  ${fields}
`

export const getPostCollectionQuery = (postFields: DocumentNode) => gql`
  query GET_POST_COLLECTION($whereClause: post_bool_exp, $limit: Int, $orderByClause: [post_order_by!]) {
    post(where: $whereClause, limit: $limit, order_by: $orderByClause) {
      ...postFields
    }
  }
  ${postFields}
`
