/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_RECENT_PROGRAM_PROGRESS
// ====================================================

export interface GET_RECENT_PROGRAM_PROGRESS_program_content_progress_program_content_program_content_section_program {
  __typename: 'program'
  id: any
  cover_url: string | null
}

export interface GET_RECENT_PROGRAM_PROGRESS_program_content_progress_program_content_program_content_section {
  __typename: 'program_content_section'
  /**
   * An object relationship
   */
  program: GET_RECENT_PROGRAM_PROGRESS_program_content_progress_program_content_program_content_section_program
}

export interface GET_RECENT_PROGRAM_PROGRESS_program_content_progress_program_content_program_content_progress {
  __typename: 'program_content_progress'
  id: any
  progress: any
  last_progress: any
}

export interface GET_RECENT_PROGRAM_PROGRESS_program_content_progress_program_content_program_content_videos {
  __typename: 'program_content_video'
  attachment_id: any
}

export interface GET_RECENT_PROGRAM_PROGRESS_program_content_progress_program_content {
  __typename: 'program_content'
  id: any
  title: string
  /**
   * sec
   */
  duration: any | null
  /**
   * An object relationship
   */
  program_content_section: GET_RECENT_PROGRAM_PROGRESS_program_content_progress_program_content_program_content_section
  /**
   * An array relationship
   */
  program_content_progress: GET_RECENT_PROGRAM_PROGRESS_program_content_progress_program_content_program_content_progress[]
  /**
   * An array relationship
   */
  program_content_videos: GET_RECENT_PROGRAM_PROGRESS_program_content_progress_program_content_program_content_videos[]
}

export interface GET_RECENT_PROGRAM_PROGRESS_program_content_progress {
  __typename: 'program_content_progress'
  /**
   * An object relationship
   */
  program_content: GET_RECENT_PROGRAM_PROGRESS_program_content_progress_program_content
}

export interface GET_RECENT_PROGRAM_PROGRESS {
  /**
   * fetch data from the table: "program_content_progress"
   */
  program_content_progress: GET_RECENT_PROGRAM_PROGRESS_program_content_progress[]
}

export interface GET_RECENT_PROGRAM_PROGRESSVariables {
  limit?: number | null
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_NEWEST_ACTIVITIES
// ====================================================

export interface GET_NEWEST_ACTIVITIES_activity {
  __typename: 'activity'
  id: any
}

export interface GET_NEWEST_ACTIVITIES {
  /**
   * fetch data from the table: "activity"
   */
  activity: GET_NEWEST_ACTIVITIES_activity[]
}

export interface GET_NEWEST_ACTIVITIESVariables {
  limit?: number | null
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_NEWEST_CREATOR
// ====================================================

export interface GET_NEWEST_CREATOR_creator {
  __typename: 'creator'
  id: string | null
}

export interface GET_NEWEST_CREATOR {
  /**
   * fetch data from the table: "creator"
   */
  creator: GET_NEWEST_CREATOR_creator[]
}

export interface GET_NEWEST_CREATORVariables {
  limit?: number | null
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PUBLISHED_CREATOR
// ====================================================

export interface GET_PUBLISHED_CREATOR_creator_member {
  __typename: 'member_public'
  title: string | null
  abstract: string | null
}

export interface GET_PUBLISHED_CREATOR_creator {
  __typename: 'creator'
  id: string | null
  name: string | null
  picture_url: string | null
  /**
   * An object relationship
   */
  member: GET_PUBLISHED_CREATOR_creator_member | null
}

export interface GET_PUBLISHED_CREATOR {
  /**
   * fetch data from the table: "creator"
   */
  creator: GET_PUBLISHED_CREATOR_creator[]
}

export interface GET_PUBLISHED_CREATORVariables {
  ids: string[]
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_APP
// ====================================================

export interface GET_APP_currency {
  __typename: 'currency'
  id: string
  name: string
  label: string
  unit: string
  minor_units: number | null
}

export interface GET_APP_app_by_pk_app_modules {
  __typename: 'app_module'
  id: any
  /**
   * activity | appointment | blog | invoice | learning_statistics | locale | member_card | merchandise | podcast | program_package | qrcode | social_connect | tempo_delivery | voucher | creator_display
   */
  module_id: string
}

export interface GET_APP_app_by_pk_app_navs_sub_app_navs {
  __typename: 'app_nav'
  id: any
  block: string
  position: number
  label: string
  icon: string | null
  href: string
  external: boolean
  locale: string
  tag: string | null
}

export interface GET_APP_app_by_pk_app_navs {
  __typename: 'app_nav'
  id: any
  block: string
  position: number
  label: string
  icon: string | null
  href: string
  external: boolean
  locale: string
  tag: string | null
  /**
   * An array relationship
   */
  sub_app_navs: GET_APP_app_by_pk_app_navs_sub_app_navs[]
}

export interface GET_APP_app_by_pk_app_settings {
  __typename: 'app_setting'
  key: string
  value: string
}

export interface GET_APP_app_by_pk_app_secrets {
  __typename: 'app_secret'
  key: string
  value: string
}

export interface GET_APP_app_by_pk_app_hosts {
  __typename: 'app_host'
  host: string
}

export interface GET_APP_app_by_pk {
  __typename: 'app'
  id: string
  name: string | null
  title: string | null
  description: string | null
  /**
   * An array relationship
   */
  app_modules: GET_APP_app_by_pk_app_modules[]
  /**
   * An array relationship
   */
  app_navs: GET_APP_app_by_pk_app_navs[]
  /**
   * An array relationship
   */
  app_settings: GET_APP_app_by_pk_app_settings[]
  /**
   * An array relationship
   */
  app_secrets: GET_APP_app_by_pk_app_secrets[]
  /**
   * An array relationship
   */
  app_hosts: GET_APP_app_by_pk_app_hosts[]
}

export interface GET_APP {
  /**
   * fetch data from the table: "currency"
   */
  currency: GET_APP_currency[]
  /**
   * fetch data from the table: "app" using primary key columns
   */
  app_by_pk: GET_APP_app_by_pk | null
}

export interface GET_APPVariables {
  appId: string
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROGRAM_COLLECTION
// ====================================================

export interface GET_PROGRAM_COLLECTION_program_program_categories_category {
  __typename: 'category'
  id: string
  name: string
}

export interface GET_PROGRAM_COLLECTION_program_program_categories {
  __typename: 'program_category'
  /**
   * An object relationship
   */
  category: GET_PROGRAM_COLLECTION_program_program_categories_category
}

export interface GET_PROGRAM_COLLECTION_program_program_roles {
  __typename: 'program_role'
  id: any
  /**
   * instructor / assistant
   */
  name: string
  member_id: string
}

export interface GET_PROGRAM_COLLECTION_program_program_plans_currency {
  __typename: 'currency'
  id: string
  label: string
  unit: string
  name: string
}

export interface GET_PROGRAM_COLLECTION_program_program_plans_program_plan_enrollments_aggregate_aggregate {
  __typename: 'program_plan_enrollment_aggregate_fields'
  count: number | null
}

export interface GET_PROGRAM_COLLECTION_program_program_plans_program_plan_enrollments_aggregate {
  __typename: 'program_plan_enrollment_aggregate'
  aggregate: GET_PROGRAM_COLLECTION_program_program_plans_program_plan_enrollments_aggregate_aggregate | null
}

export interface GET_PROGRAM_COLLECTION_program_program_plans {
  __typename: 'program_plan'
  id: any
  /**
   * 1 - subscribe all / 2 - subscribe from now / 3 - all
   */
  type: number
  title: string
  description: string | null
  gains: any | null
  /**
   * An object relationship
   */
  currency: GET_PROGRAM_COLLECTION_program_program_plans_currency
  list_price: any
  sale_price: any | null
  sold_at: any | null
  discount_down_price: any
  period_amount: any | null
  period_type: string | null
  started_at: any | null
  ended_at: any | null
  is_participants_visible: boolean
  published_at: any | null
  auto_renewed: boolean
  /**
   * An aggregated array relationship
   */
  program_plan_enrollments_aggregate: GET_PROGRAM_COLLECTION_program_program_plans_program_plan_enrollments_aggregate
}

export interface GET_PROGRAM_COLLECTION_program_program_enrollments_aggregate_aggregate {
  __typename: 'program_enrollment_aggregate_fields'
  count: number | null
}

export interface GET_PROGRAM_COLLECTION_program_program_enrollments_aggregate {
  __typename: 'program_enrollment_aggregate'
  aggregate: GET_PROGRAM_COLLECTION_program_program_enrollments_aggregate_aggregate | null
}

export interface GET_PROGRAM_COLLECTION_program_program_content_sections_program_contents {
  __typename: 'program_content'
  /**
   * sec
   */
  duration: any | null
}

export interface GET_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate_aggregate_sum {
  __typename: 'program_content_sum_fields'
  duration: any | null
}

export interface GET_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate_aggregate {
  __typename: 'program_content_aggregate_fields'
  sum: GET_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate_aggregate_sum | null
}

export interface GET_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate {
  __typename: 'program_content_aggregate'
  aggregate: GET_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate_aggregate | null
}

export interface GET_PROGRAM_COLLECTION_program_program_content_sections {
  __typename: 'program_content_section'
  /**
   * An array relationship
   */
  program_contents: GET_PROGRAM_COLLECTION_program_program_content_sections_program_contents[]
  /**
   * An aggregated array relationship
   */
  program_contents_aggregate: GET_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate
}

export interface GET_PROGRAM_COLLECTION_program {
  __typename: 'program'
  id: any
  cover_url: string | null
  title: string
  abstract: string | null
  list_price: any | null
  sale_price: any | null
  sold_at: any | null
  /**
   * An array relationship
   */
  program_categories: GET_PROGRAM_COLLECTION_program_program_categories[]
  /**
   * An array relationship
   */
  program_roles: GET_PROGRAM_COLLECTION_program_program_roles[]
  /**
   * An array relationship
   */
  program_plans: GET_PROGRAM_COLLECTION_program_program_plans[]
  /**
   * An aggregated array relationship
   */
  program_enrollments_aggregate: GET_PROGRAM_COLLECTION_program_program_enrollments_aggregate
  /**
   * An array relationship
   */
  program_content_sections: GET_PROGRAM_COLLECTION_program_program_content_sections[]
}

export interface GET_PROGRAM_COLLECTION {
  /**
   * fetch data from the table: "program"
   */
  program: GET_PROGRAM_COLLECTION_program[]
}

export interface GET_PROGRAM_COLLECTIONVariables {
  whereClause?: program_bool_exp | null
  limit?: number | null
  orderByClause?: program_order_by[] | null
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROGRAM_CONTENT_COLLECTION
// ====================================================

export interface GET_PROGRAM_CONTENT_COLLECTION_program_content_program_content_section_program {
  __typename: 'program'
  id: any
  cover_url: string | null
}

export interface GET_PROGRAM_CONTENT_COLLECTION_program_content_program_content_section {
  __typename: 'program_content_section'
  /**
   * An object relationship
   */
  program: GET_PROGRAM_CONTENT_COLLECTION_program_content_program_content_section_program
}

export interface GET_PROGRAM_CONTENT_COLLECTION_program_content_program_content_progress {
  __typename: 'program_content_progress'
  id: any
  progress: any
  last_progress: any
}

export interface GET_PROGRAM_CONTENT_COLLECTION_program_content_program_content_videos {
  __typename: 'program_content_video'
  attachment_id: any
}

export interface GET_PROGRAM_CONTENT_COLLECTION_program_content {
  __typename: 'program_content'
  id: any
  title: string
  /**
   * sec
   */
  duration: any | null
  /**
   * An object relationship
   */
  program_content_section: GET_PROGRAM_CONTENT_COLLECTION_program_content_program_content_section
  /**
   * An array relationship
   */
  program_content_progress: GET_PROGRAM_CONTENT_COLLECTION_program_content_program_content_progress[]
  /**
   * An array relationship
   */
  program_content_videos: GET_PROGRAM_CONTENT_COLLECTION_program_content_program_content_videos[]
}

export interface GET_PROGRAM_CONTENT_COLLECTION {
  /**
   * fetch data from the table: "program_content"
   */
  program_content: GET_PROGRAM_CONTENT_COLLECTION_program_content[]
}

export interface GET_PROGRAM_CONTENT_COLLECTIONVariables {
  whereClause?: program_content_bool_exp | null
  limit?: number | null
  orderByClause?: program_content_order_by[] | null
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ACTIVITY_COLLECTION
// ====================================================

export interface GET_ACTIVITY_COLLECTION_activity_activity_categories_category {
  __typename: 'category'
  id: string
  name: string
}

export interface GET_ACTIVITY_COLLECTION_activity_activity_categories {
  __typename: 'activity_category'
  /**
   * An object relationship
   */
  category: GET_ACTIVITY_COLLECTION_activity_activity_categories_category
}

export interface GET_ACTIVITY_COLLECTION_activity_activity_enrollments_aggregate_aggregate {
  __typename: 'activity_enrollment_aggregate_fields'
  count: number | null
}

export interface GET_ACTIVITY_COLLECTION_activity_activity_enrollments_aggregate {
  __typename: 'activity_enrollment_aggregate'
  aggregate: GET_ACTIVITY_COLLECTION_activity_activity_enrollments_aggregate_aggregate | null
}

export interface GET_ACTIVITY_COLLECTION_activity_activity_sessions {
  __typename: 'activity_session'
  started_at: any
  ended_at: any
}

export interface GET_ACTIVITY_COLLECTION_activity_activity_tickets {
  __typename: 'activity_ticket'
  /**
   * unlimited as 99999999
   */
  count: number
}

export interface GET_ACTIVITY_COLLECTION_activity {
  __typename: 'activity'
  id: any
  cover_url: string | null
  title: string
  published_at: any | null
  is_participants_visible: boolean
  /**
   * An array relationship
   */
  activity_categories: GET_ACTIVITY_COLLECTION_activity_activity_categories[]
  /**
   * An aggregated array relationship
   */
  activity_enrollments_aggregate: GET_ACTIVITY_COLLECTION_activity_activity_enrollments_aggregate
  /**
   * An array relationship
   */
  activity_sessions: GET_ACTIVITY_COLLECTION_activity_activity_sessions[]
  /**
   * An array relationship
   */
  activity_tickets: GET_ACTIVITY_COLLECTION_activity_activity_tickets[]
}

export interface GET_ACTIVITY_COLLECTION {
  /**
   * fetch data from the table: "activity"
   */
  activity: GET_ACTIVITY_COLLECTION_activity[]
}

export interface GET_ACTIVITY_COLLECTIONVariables {
  whereClause?: activity_bool_exp | null
  limit?: number | null
  orderByClause?: activity_order_by[] | null
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PUBLISHED_PROGRAM_COLLECTION
// ====================================================

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_roles {
  __typename: 'program_role'
  id: any
  member_id: string
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_categories_category {
  __typename: 'category'
  id: string
  name: string
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_categories {
  __typename: 'program_category'
  id: any
  /**
   * An object relationship
   */
  category: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_categories_category
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_plans {
  __typename: 'program_plan'
  id: any
  list_price: any
  sale_price: any | null
  sold_at: any | null
  period_amount: any | null
  period_type: string | null
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate_aggregate_sum {
  __typename: 'program_content_sum_fields'
  duration: any | null
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate_aggregate {
  __typename: 'program_content_aggregate_fields'
  sum: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate_aggregate_sum | null
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate {
  __typename: 'program_content_aggregate'
  aggregate: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate_aggregate | null
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_content_sections {
  __typename: 'program_content_section'
  id: any
  /**
   * An aggregated array relationship
   */
  program_contents_aggregate: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program {
  __typename: 'program'
  id: any
  cover_url: string | null
  title: string
  abstract: string | null
  support_locales: any | null
  published_at: any | null
  is_subscription: boolean
  is_sold_out: boolean | null
  is_private: boolean
  list_price: any | null
  sale_price: any | null
  sold_at: any | null
  /**
   * An array relationship
   */
  program_roles: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_roles[]
  /**
   * An array relationship
   */
  program_categories: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_categories[]
  /**
   * An array relationship
   */
  program_plans: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_plans[]
  /**
   * An array relationship
   */
  program_content_sections: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_content_sections[]
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION {
  /**
   * fetch data from the table: "program"
   */
  program: GET_PUBLISHED_PROGRAM_COLLECTION_program[]
}

export interface GET_PUBLISHED_PROGRAM_COLLECTIONVariables {
  ids?: any[] | null
  limit?: number | null
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROJECT_COLLECTION
// ====================================================

export interface GET_PROJECT_COLLECTION_project_project_sales {
  __typename: 'project_sales'
  total_sales: any | null
}

export interface GET_PROJECT_COLLECTION_project_project_plans_project_plan_enrollments_aggregate_aggregate {
  __typename: 'project_plan_enrollment_aggregate_fields'
  count: number | null
}

export interface GET_PROJECT_COLLECTION_project_project_plans_project_plan_enrollments_aggregate {
  __typename: 'project_plan_enrollment_aggregate'
  aggregate: GET_PROJECT_COLLECTION_project_project_plans_project_plan_enrollments_aggregate_aggregate | null
}

export interface GET_PROJECT_COLLECTION_project_project_plans {
  __typename: 'project_plan'
  id: any
  /**
   * An aggregated array relationship
   */
  project_plan_enrollments_aggregate: GET_PROJECT_COLLECTION_project_project_plans_project_plan_enrollments_aggregate
}

export interface GET_PROJECT_COLLECTION_project {
  __typename: 'project'
  id: any
  /**
   * funding / pre-order / on-sale / modular
   */
  type: string
  title: string
  cover_url: string | null
  preview_url: string | null
  abstract: string | null
  target_amount: any | null
  /**
   * funds / participants
   */
  target_unit: string
  expired_at: any | null
  is_participants_visible: boolean
  is_countdown_timer_visible: boolean
  /**
   * An object relationship
   */
  project_sales: GET_PROJECT_COLLECTION_project_project_sales | null
  /**
   * An array relationship
   */
  project_plans: GET_PROJECT_COLLECTION_project_project_plans[]
}

export interface GET_PROJECT_COLLECTION {
  /**
   * fetch data from the table: "project"
   */
  project: GET_PROJECT_COLLECTION_project[]
}

export interface GET_PROJECT_COLLECTIONVariables {
  condition: project_bool_exp
  limit?: number | null
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PUBLISHED_PODCAST_PROGRAM_COLLECTION
// ====================================================

export interface GET_PUBLISHED_PODCAST_PROGRAM_COLLECTION_podcast_program_podcast_program_roles_member {
  __typename: 'member_public'
  id: string | null
  picture_url: string | null
  name: string | null
  username: string | null
}

export interface GET_PUBLISHED_PODCAST_PROGRAM_COLLECTION_podcast_program_podcast_program_roles {
  __typename: 'podcast_program_role'
  id: any
  /**
   * An object relationship
   */
  member: GET_PUBLISHED_PODCAST_PROGRAM_COLLECTION_podcast_program_podcast_program_roles_member | null
}

export interface GET_PUBLISHED_PODCAST_PROGRAM_COLLECTION_podcast_program {
  __typename: 'podcast_program'
  id: any
  cover_url: string | null
  title: string
  duration_second: any
  list_price: any
  sale_price: any | null
  sold_at: any | null
  /**
   * An array relationship
   */
  podcast_program_roles: GET_PUBLISHED_PODCAST_PROGRAM_COLLECTION_podcast_program_podcast_program_roles[]
}

export interface GET_PUBLISHED_PODCAST_PROGRAM_COLLECTION {
  /**
   * fetch data from the table: "podcast_program"
   */
  podcast_program: GET_PUBLISHED_PODCAST_PROGRAM_COLLECTION_podcast_program[]
}

export interface GET_PUBLISHED_PODCAST_PROGRAM_COLLECTIONVariables {
  limit?: number | null
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PUBLIC_MEMBER
// ====================================================

export interface GET_PUBLIC_MEMBER_member_public {
  __typename: 'member_public'
  id: string | null
  picture_url: string | null
  name: string | null
  username: string | null
}

export interface GET_PUBLIC_MEMBER {
  /**
   * fetch data from the table: "member_public"
   */
  member_public: GET_PUBLIC_MEMBER_member_public[]
}

export interface GET_PUBLIC_MEMBERVariables {
  memberId: string
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_INSTRUCTOR_COLLECTION
// ====================================================

export interface GET_INSTRUCTOR_COLLECTION_instructor {
  __typename: 'member_public'
  id: string | null
  name: string | null
  abstract: string | null
  picture_url: string | null
  description: string | null
}

export interface GET_INSTRUCTOR_COLLECTION {
  /**
   * fetch data from the table: "member_public"
   */
  instructor: GET_INSTRUCTOR_COLLECTION_instructor[]
}

export interface GET_INSTRUCTOR_COLLECTIONVariables {
  appId: string
  limit?: number | null
  instructorIds?: string[] | null
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PUBLISHED_ACTIVITY_COLLECTION
// ====================================================

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_categories_category {
  __typename: 'category'
  id: string
  name: string
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_categories {
  __typename: 'activity_category'
  /**
   * An object relationship
   */
  category: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_categories_category
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_enrollments_aggregate_aggregate {
  __typename: 'activity_enrollment_aggregate_fields'
  count: number | null
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_enrollments_aggregate {
  __typename: 'activity_enrollment_aggregate'
  aggregate: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_enrollments_aggregate_aggregate | null
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_sessions_aggregate_aggregate_min {
  __typename: 'activity_session_min_fields'
  started_at: any | null
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_sessions_aggregate_aggregate_max {
  __typename: 'activity_session_max_fields'
  ended_at: any | null
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_sessions_aggregate_aggregate {
  __typename: 'activity_session_aggregate_fields'
  min: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_sessions_aggregate_aggregate_min | null
  max: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_sessions_aggregate_aggregate_max | null
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_sessions_aggregate {
  __typename: 'activity_session_aggregate'
  aggregate: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_sessions_aggregate_aggregate | null
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_tickets_aggregate_aggregate_sum {
  __typename: 'activity_ticket_sum_fields'
  count: number | null
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_tickets_aggregate_aggregate {
  __typename: 'activity_ticket_aggregate_fields'
  sum: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_tickets_aggregate_aggregate_sum | null
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_tickets_aggregate {
  __typename: 'activity_ticket_aggregate'
  aggregate: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_tickets_aggregate_aggregate | null
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity {
  __typename: 'activity'
  id: any
  cover_url: string | null
  title: string
  published_at: any | null
  is_participants_visible: boolean
  /**
   * An array relationship
   */
  activity_categories: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_categories[]
  /**
   * An aggregated array relationship
   */
  activity_enrollments_aggregate: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_enrollments_aggregate
  /**
   * An aggregated array relationship
   */
  activity_sessions_aggregate: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_sessions_aggregate
  /**
   * An aggregated array relationship
   */
  activity_tickets_aggregate: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_tickets_aggregate
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION {
  /**
   * fetch data from the table: "activity"
   */
  activity: GET_PUBLISHED_ACTIVITY_COLLECTION_activity[]
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTIONVariables {
  ids?: any[] | null
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: activityFields
// ====================================================

export interface activityFields_activity_categories_category {
  __typename: 'category'
  id: string
  name: string
}

export interface activityFields_activity_categories {
  __typename: 'activity_category'
  /**
   * An object relationship
   */
  category: activityFields_activity_categories_category
}

export interface activityFields_activity_enrollments_aggregate_aggregate {
  __typename: 'activity_enrollment_aggregate_fields'
  count: number | null
}

export interface activityFields_activity_enrollments_aggregate {
  __typename: 'activity_enrollment_aggregate'
  aggregate: activityFields_activity_enrollments_aggregate_aggregate | null
}

export interface activityFields_activity_sessions {
  __typename: 'activity_session'
  started_at: any
  ended_at: any
}

export interface activityFields_activity_tickets {
  __typename: 'activity_ticket'
  /**
   * unlimited as 99999999
   */
  count: number
}

export interface activityFields {
  __typename: 'activity'
  id: any
  cover_url: string | null
  title: string
  published_at: any | null
  is_participants_visible: boolean
  /**
   * An array relationship
   */
  activity_categories: activityFields_activity_categories[]
  /**
   * An aggregated array relationship
   */
  activity_enrollments_aggregate: activityFields_activity_enrollments_aggregate
  /**
   * An array relationship
   */
  activity_sessions: activityFields_activity_sessions[]
  /**
   * An array relationship
   */
  activity_tickets: activityFields_activity_tickets[]
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: programFields
// ====================================================

export interface programFields_program_categories_category {
  __typename: 'category'
  id: string
  name: string
}

export interface programFields_program_categories {
  __typename: 'program_category'
  /**
   * An object relationship
   */
  category: programFields_program_categories_category
}

export interface programFields_program_roles {
  __typename: 'program_role'
  id: any
  /**
   * instructor / assistant
   */
  name: string
  member_id: string
}

export interface programFields_program_plans_currency {
  __typename: 'currency'
  id: string
  label: string
  unit: string
  name: string
}

export interface programFields_program_plans_program_plan_enrollments_aggregate_aggregate {
  __typename: 'program_plan_enrollment_aggregate_fields'
  count: number | null
}

export interface programFields_program_plans_program_plan_enrollments_aggregate {
  __typename: 'program_plan_enrollment_aggregate'
  aggregate: programFields_program_plans_program_plan_enrollments_aggregate_aggregate | null
}

export interface programFields_program_plans {
  __typename: 'program_plan'
  id: any
  /**
   * 1 - subscribe all / 2 - subscribe from now / 3 - all
   */
  type: number
  title: string
  description: string | null
  gains: any | null
  /**
   * An object relationship
   */
  currency: programFields_program_plans_currency
  list_price: any
  sale_price: any | null
  sold_at: any | null
  discount_down_price: any
  period_amount: any | null
  period_type: string | null
  started_at: any | null
  ended_at: any | null
  is_participants_visible: boolean
  published_at: any | null
  auto_renewed: boolean
  /**
   * An aggregated array relationship
   */
  program_plan_enrollments_aggregate: programFields_program_plans_program_plan_enrollments_aggregate
}

export interface programFields_program_enrollments_aggregate_aggregate {
  __typename: 'program_enrollment_aggregate_fields'
  count: number | null
}

export interface programFields_program_enrollments_aggregate {
  __typename: 'program_enrollment_aggregate'
  aggregate: programFields_program_enrollments_aggregate_aggregate | null
}

export interface programFields_program_content_sections_program_contents {
  __typename: 'program_content'
  /**
   * sec
   */
  duration: any | null
}

export interface programFields_program_content_sections_program_contents_aggregate_aggregate_sum {
  __typename: 'program_content_sum_fields'
  duration: any | null
}

export interface programFields_program_content_sections_program_contents_aggregate_aggregate {
  __typename: 'program_content_aggregate_fields'
  sum: programFields_program_content_sections_program_contents_aggregate_aggregate_sum | null
}

export interface programFields_program_content_sections_program_contents_aggregate {
  __typename: 'program_content_aggregate'
  aggregate: programFields_program_content_sections_program_contents_aggregate_aggregate | null
}

export interface programFields_program_content_sections {
  __typename: 'program_content_section'
  /**
   * An array relationship
   */
  program_contents: programFields_program_content_sections_program_contents[]
  /**
   * An aggregated array relationship
   */
  program_contents_aggregate: programFields_program_content_sections_program_contents_aggregate
}

export interface programFields {
  __typename: 'program'
  id: any
  cover_url: string | null
  title: string
  abstract: string | null
  list_price: any | null
  sale_price: any | null
  sold_at: any | null
  /**
   * An array relationship
   */
  program_categories: programFields_program_categories[]
  /**
   * An array relationship
   */
  program_roles: programFields_program_roles[]
  /**
   * An array relationship
   */
  program_plans: programFields_program_plans[]
  /**
   * An aggregated array relationship
   */
  program_enrollments_aggregate: programFields_program_enrollments_aggregate
  /**
   * An array relationship
   */
  program_content_sections: programFields_program_content_sections[]
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: programContentFields
// ====================================================

export interface programContentFields_program_content_section_program {
  __typename: 'program'
  id: any
  cover_url: string | null
}

export interface programContentFields_program_content_section {
  __typename: 'program_content_section'
  /**
   * An object relationship
   */
  program: programContentFields_program_content_section_program
}

export interface programContentFields_program_content_progress {
  __typename: 'program_content_progress'
  id: any
  progress: any
  last_progress: any
}

export interface programContentFields_program_content_videos {
  __typename: 'program_content_video'
  attachment_id: any
}

export interface programContentFields {
  __typename: 'program_content'
  id: any
  title: string
  /**
   * sec
   */
  duration: any | null
  /**
   * An object relationship
   */
  program_content_section: programContentFields_program_content_section
  /**
   * An array relationship
   */
  program_content_progress: programContentFields_program_content_progress[]
  /**
   * An array relationship
   */
  program_content_videos: programContentFields_program_content_videos[]
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * column ordering options
 */
export enum order_by {
  asc = 'asc',
  asc_nulls_first = 'asc_nulls_first',
  asc_nulls_last = 'asc_nulls_last',
  desc = 'desc',
  desc_nulls_first = 'desc_nulls_first',
  desc_nulls_last = 'desc_nulls_last',
}

/**
 * expression to compare columns of type Boolean. All fields are combined with logical 'AND'.
 */
export interface Boolean_comparison_exp {
  _eq?: boolean | null
  _gt?: boolean | null
  _gte?: boolean | null
  _in?: boolean[] | null
  _is_null?: boolean | null
  _lt?: boolean | null
  _lte?: boolean | null
  _neq?: boolean | null
  _nin?: boolean[] | null
}

/**
 * expression to compare columns of type Int. All fields are combined with logical 'AND'.
 */
export interface Int_comparison_exp {
  _eq?: number | null
  _gt?: number | null
  _gte?: number | null
  _in?: number[] | null
  _is_null?: boolean | null
  _lt?: number | null
  _lte?: number | null
  _neq?: number | null
  _nin?: number[] | null
}

/**
 * expression to compare columns of type String. All fields are combined with logical 'AND'.
 */
export interface String_comparison_exp {
  _eq?: string | null
  _gt?: string | null
  _gte?: string | null
  _ilike?: string | null
  _in?: string[] | null
  _is_null?: boolean | null
  _like?: string | null
  _lt?: string | null
  _lte?: string | null
  _neq?: string | null
  _nilike?: string | null
  _nin?: string[] | null
  _nlike?: string | null
  _nsimilar?: string | null
  _similar?: string | null
}

/**
 * order by aggregate values of table "activity"
 */
export interface activity_aggregate_order_by {
  avg?: activity_avg_order_by | null
  count?: order_by | null
  max?: activity_max_order_by | null
  min?: activity_min_order_by | null
  stddev?: activity_stddev_order_by | null
  stddev_pop?: activity_stddev_pop_order_by | null
  stddev_samp?: activity_stddev_samp_order_by | null
  sum?: activity_sum_order_by | null
  var_pop?: activity_var_pop_order_by | null
  var_samp?: activity_var_samp_order_by | null
  variance?: activity_variance_order_by | null
}

/**
 * Boolean expression to filter rows from the table "activity_attendance". All fields are combined with a logical 'AND'.
 */
export interface activity_attendance_bool_exp {
  _and?: (activity_attendance_bool_exp | null)[] | null
  _not?: activity_attendance_bool_exp | null
  _or?: (activity_attendance_bool_exp | null)[] | null
  activity_session?: activity_session_bool_exp | null
  activity_session_id?: uuid_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  order_product?: order_product_bool_exp | null
  order_product_id?: uuid_comparison_exp | null
}

/**
 * order by avg() on columns of table "activity"
 */
export interface activity_avg_order_by {
  position?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "activity". All fields are combined with a logical 'AND'.
 */
export interface activity_bool_exp {
  _and?: (activity_bool_exp | null)[] | null
  _not?: activity_bool_exp | null
  _or?: (activity_bool_exp | null)[] | null
  activity_categories?: activity_category_bool_exp | null
  activity_enrollments?: activity_enrollment_bool_exp | null
  activity_sessions?: activity_session_bool_exp | null
  activity_tags?: activity_tag_bool_exp | null
  activity_tickets?: activity_ticket_bool_exp | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  cover_url?: String_comparison_exp | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_participants_visible?: Boolean_comparison_exp | null
  organizer?: member_public_bool_exp | null
  organizer_id?: String_comparison_exp | null
  package_items?: package_item_bool_exp | null
  position?: Int_comparison_exp | null
  published_at?: timestamptz_comparison_exp | null
  session_ticket_enrollment_count?: activity_session_ticket_enrollment_count_bool_exp | null
  support_locales?: jsonb_comparison_exp | null
  title?: String_comparison_exp | null
}

/**
 * order by aggregate values of table "activity_category"
 */
export interface activity_category_aggregate_order_by {
  avg?: activity_category_avg_order_by | null
  count?: order_by | null
  max?: activity_category_max_order_by | null
  min?: activity_category_min_order_by | null
  stddev?: activity_category_stddev_order_by | null
  stddev_pop?: activity_category_stddev_pop_order_by | null
  stddev_samp?: activity_category_stddev_samp_order_by | null
  sum?: activity_category_sum_order_by | null
  var_pop?: activity_category_var_pop_order_by | null
  var_samp?: activity_category_var_samp_order_by | null
  variance?: activity_category_variance_order_by | null
}

/**
 * order by avg() on columns of table "activity_category"
 */
export interface activity_category_avg_order_by {
  position?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "activity_category". All fields are combined with a logical 'AND'.
 */
export interface activity_category_bool_exp {
  _and?: (activity_category_bool_exp | null)[] | null
  _not?: activity_category_bool_exp | null
  _or?: (activity_category_bool_exp | null)[] | null
  activity?: activity_bool_exp | null
  activity_id?: uuid_comparison_exp | null
  category?: category_bool_exp | null
  category_id?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
}

/**
 * order by max() on columns of table "activity_category"
 */
export interface activity_category_max_order_by {
  activity_id?: order_by | null
  category_id?: order_by | null
  id?: order_by | null
  position?: order_by | null
}

/**
 * order by min() on columns of table "activity_category"
 */
export interface activity_category_min_order_by {
  activity_id?: order_by | null
  category_id?: order_by | null
  id?: order_by | null
  position?: order_by | null
}

/**
 * order by stddev() on columns of table "activity_category"
 */
export interface activity_category_stddev_order_by {
  position?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "activity_category"
 */
export interface activity_category_stddev_pop_order_by {
  position?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "activity_category"
 */
export interface activity_category_stddev_samp_order_by {
  position?: order_by | null
}

/**
 * order by sum() on columns of table "activity_category"
 */
export interface activity_category_sum_order_by {
  position?: order_by | null
}

/**
 * order by var_pop() on columns of table "activity_category"
 */
export interface activity_category_var_pop_order_by {
  position?: order_by | null
}

/**
 * order by var_samp() on columns of table "activity_category"
 */
export interface activity_category_var_samp_order_by {
  position?: order_by | null
}

/**
 * order by variance() on columns of table "activity_category"
 */
export interface activity_category_variance_order_by {
  position?: order_by | null
}

/**
 * order by aggregate values of table "activity_enrollment"
 */
export interface activity_enrollment_aggregate_order_by {
  count?: order_by | null
  max?: activity_enrollment_max_order_by | null
  min?: activity_enrollment_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "activity_enrollment". All fields are combined with a logical 'AND'.
 */
export interface activity_enrollment_bool_exp {
  _and?: (activity_enrollment_bool_exp | null)[] | null
  _not?: activity_enrollment_bool_exp | null
  _or?: (activity_enrollment_bool_exp | null)[] | null
  activity?: activity_bool_exp | null
  activity_id?: uuid_comparison_exp | null
  activity_session_id?: uuid_comparison_exp | null
  activity_ticket?: activity_ticket_bool_exp | null
  activity_ticket_id?: uuid_comparison_exp | null
  attended?: Boolean_comparison_exp | null
  member_email?: String_comparison_exp | null
  member_id?: String_comparison_exp | null
  member_name?: String_comparison_exp | null
  member_phone?: String_comparison_exp | null
  order_log_id?: String_comparison_exp | null
}

/**
 * order by max() on columns of table "activity_enrollment"
 */
export interface activity_enrollment_max_order_by {
  activity_id?: order_by | null
  activity_session_id?: order_by | null
  activity_ticket_id?: order_by | null
  member_email?: order_by | null
  member_id?: order_by | null
  member_name?: order_by | null
  member_phone?: order_by | null
  order_log_id?: order_by | null
}

/**
 * order by min() on columns of table "activity_enrollment"
 */
export interface activity_enrollment_min_order_by {
  activity_id?: order_by | null
  activity_session_id?: order_by | null
  activity_ticket_id?: order_by | null
  member_email?: order_by | null
  member_id?: order_by | null
  member_name?: order_by | null
  member_phone?: order_by | null
  order_log_id?: order_by | null
}

/**
 * order by max() on columns of table "activity"
 */
export interface activity_max_order_by {
  app_id?: order_by | null
  cover_url?: order_by | null
  description?: order_by | null
  id?: order_by | null
  organizer_id?: order_by | null
  position?: order_by | null
  published_at?: order_by | null
  title?: order_by | null
}

/**
 * order by min() on columns of table "activity"
 */
export interface activity_min_order_by {
  app_id?: order_by | null
  cover_url?: order_by | null
  description?: order_by | null
  id?: order_by | null
  organizer_id?: order_by | null
  position?: order_by | null
  published_at?: order_by | null
  title?: order_by | null
}

/**
 * ordering options when selecting data from "activity"
 */
export interface activity_order_by {
  activity_categories_aggregate?: activity_category_aggregate_order_by | null
  activity_enrollments_aggregate?: activity_enrollment_aggregate_order_by | null
  activity_sessions_aggregate?: activity_session_aggregate_order_by | null
  activity_tags_aggregate?: activity_tag_aggregate_order_by | null
  activity_tickets_aggregate?: activity_ticket_aggregate_order_by | null
  app?: app_order_by | null
  app_id?: order_by | null
  cover_url?: order_by | null
  description?: order_by | null
  id?: order_by | null
  is_participants_visible?: order_by | null
  organizer?: member_public_order_by | null
  organizer_id?: order_by | null
  package_items_aggregate?: package_item_aggregate_order_by | null
  position?: order_by | null
  published_at?: order_by | null
  session_ticket_enrollment_count_aggregate?: activity_session_ticket_enrollment_count_aggregate_order_by | null
  support_locales?: order_by | null
  title?: order_by | null
}

/**
 * order by aggregate values of table "activity_session"
 */
export interface activity_session_aggregate_order_by {
  avg?: activity_session_avg_order_by | null
  count?: order_by | null
  max?: activity_session_max_order_by | null
  min?: activity_session_min_order_by | null
  stddev?: activity_session_stddev_order_by | null
  stddev_pop?: activity_session_stddev_pop_order_by | null
  stddev_samp?: activity_session_stddev_samp_order_by | null
  sum?: activity_session_sum_order_by | null
  var_pop?: activity_session_var_pop_order_by | null
  var_samp?: activity_session_var_samp_order_by | null
  variance?: activity_session_variance_order_by | null
}

/**
 * order by avg() on columns of table "activity_session"
 */
export interface activity_session_avg_order_by {
  threshold?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "activity_session". All fields are combined with a logical 'AND'.
 */
export interface activity_session_bool_exp {
  _and?: (activity_session_bool_exp | null)[] | null
  _not?: activity_session_bool_exp | null
  _or?: (activity_session_bool_exp | null)[] | null
  activity?: activity_bool_exp | null
  activity_attendances?: activity_attendance_bool_exp | null
  activity_enrollments?: activity_enrollment_bool_exp | null
  activity_id?: uuid_comparison_exp | null
  activity_session_tickets?: activity_session_ticket_bool_exp | null
  description?: String_comparison_exp | null
  ended_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  location?: String_comparison_exp | null
  online_link?: String_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
  threshold?: numeric_comparison_exp | null
  ticket_enrollment_count?: activity_session_ticket_enrollment_count_bool_exp | null
  title?: String_comparison_exp | null
}

/**
 * order by max() on columns of table "activity_session"
 */
export interface activity_session_max_order_by {
  activity_id?: order_by | null
  description?: order_by | null
  ended_at?: order_by | null
  id?: order_by | null
  location?: order_by | null
  online_link?: order_by | null
  started_at?: order_by | null
  threshold?: order_by | null
  title?: order_by | null
}

/**
 * order by min() on columns of table "activity_session"
 */
export interface activity_session_min_order_by {
  activity_id?: order_by | null
  description?: order_by | null
  ended_at?: order_by | null
  id?: order_by | null
  location?: order_by | null
  online_link?: order_by | null
  started_at?: order_by | null
  threshold?: order_by | null
  title?: order_by | null
}

/**
 * order by stddev() on columns of table "activity_session"
 */
export interface activity_session_stddev_order_by {
  threshold?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "activity_session"
 */
export interface activity_session_stddev_pop_order_by {
  threshold?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "activity_session"
 */
export interface activity_session_stddev_samp_order_by {
  threshold?: order_by | null
}

/**
 * order by sum() on columns of table "activity_session"
 */
export interface activity_session_sum_order_by {
  threshold?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "activity_session_ticket". All fields are combined with a logical 'AND'.
 */
export interface activity_session_ticket_bool_exp {
  _and?: (activity_session_ticket_bool_exp | null)[] | null
  _not?: activity_session_ticket_bool_exp | null
  _or?: (activity_session_ticket_bool_exp | null)[] | null
  activity_session?: activity_session_bool_exp | null
  activity_session_id?: uuid_comparison_exp | null
  activity_session_type?: String_comparison_exp | null
  activity_ticket?: activity_ticket_bool_exp | null
  activity_ticket_id?: uuid_comparison_exp | null
  id?: uuid_comparison_exp | null
}

/**
 * order by aggregate values of table "activity_session_ticket_enrollment_count"
 */
export interface activity_session_ticket_enrollment_count_aggregate_order_by {
  avg?: activity_session_ticket_enrollment_count_avg_order_by | null
  count?: order_by | null
  max?: activity_session_ticket_enrollment_count_max_order_by | null
  min?: activity_session_ticket_enrollment_count_min_order_by | null
  stddev?: activity_session_ticket_enrollment_count_stddev_order_by | null
  stddev_pop?: activity_session_ticket_enrollment_count_stddev_pop_order_by | null
  stddev_samp?: activity_session_ticket_enrollment_count_stddev_samp_order_by | null
  sum?: activity_session_ticket_enrollment_count_sum_order_by | null
  var_pop?: activity_session_ticket_enrollment_count_var_pop_order_by | null
  var_samp?: activity_session_ticket_enrollment_count_var_samp_order_by | null
  variance?: activity_session_ticket_enrollment_count_variance_order_by | null
}

/**
 * order by avg() on columns of table "activity_session_ticket_enrollment_count"
 */
export interface activity_session_ticket_enrollment_count_avg_order_by {
  activity_offline_session_ticket_count?: order_by | null
  activity_online_session_ticket_count?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "activity_session_ticket_enrollment_count". All fields are combined with a logical 'AND'.
 */
export interface activity_session_ticket_enrollment_count_bool_exp {
  _and?: (activity_session_ticket_enrollment_count_bool_exp | null)[] | null
  _not?: activity_session_ticket_enrollment_count_bool_exp | null
  _or?: (activity_session_ticket_enrollment_count_bool_exp | null)[] | null
  activity?: activity_bool_exp | null
  activity_id?: uuid_comparison_exp | null
  activity_offline_session_ticket_count?: numeric_comparison_exp | null
  activity_online_session_ticket_count?: numeric_comparison_exp | null
  activity_session_id?: uuid_comparison_exp | null
}

/**
 * order by max() on columns of table "activity_session_ticket_enrollment_count"
 */
export interface activity_session_ticket_enrollment_count_max_order_by {
  activity_id?: order_by | null
  activity_offline_session_ticket_count?: order_by | null
  activity_online_session_ticket_count?: order_by | null
  activity_session_id?: order_by | null
}

/**
 * order by min() on columns of table "activity_session_ticket_enrollment_count"
 */
export interface activity_session_ticket_enrollment_count_min_order_by {
  activity_id?: order_by | null
  activity_offline_session_ticket_count?: order_by | null
  activity_online_session_ticket_count?: order_by | null
  activity_session_id?: order_by | null
}

/**
 * order by stddev() on columns of table "activity_session_ticket_enrollment_count"
 */
export interface activity_session_ticket_enrollment_count_stddev_order_by {
  activity_offline_session_ticket_count?: order_by | null
  activity_online_session_ticket_count?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "activity_session_ticket_enrollment_count"
 */
export interface activity_session_ticket_enrollment_count_stddev_pop_order_by {
  activity_offline_session_ticket_count?: order_by | null
  activity_online_session_ticket_count?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "activity_session_ticket_enrollment_count"
 */
export interface activity_session_ticket_enrollment_count_stddev_samp_order_by {
  activity_offline_session_ticket_count?: order_by | null
  activity_online_session_ticket_count?: order_by | null
}

/**
 * order by sum() on columns of table "activity_session_ticket_enrollment_count"
 */
export interface activity_session_ticket_enrollment_count_sum_order_by {
  activity_offline_session_ticket_count?: order_by | null
  activity_online_session_ticket_count?: order_by | null
}

/**
 * order by var_pop() on columns of table "activity_session_ticket_enrollment_count"
 */
export interface activity_session_ticket_enrollment_count_var_pop_order_by {
  activity_offline_session_ticket_count?: order_by | null
  activity_online_session_ticket_count?: order_by | null
}

/**
 * order by var_samp() on columns of table "activity_session_ticket_enrollment_count"
 */
export interface activity_session_ticket_enrollment_count_var_samp_order_by {
  activity_offline_session_ticket_count?: order_by | null
  activity_online_session_ticket_count?: order_by | null
}

/**
 * order by variance() on columns of table "activity_session_ticket_enrollment_count"
 */
export interface activity_session_ticket_enrollment_count_variance_order_by {
  activity_offline_session_ticket_count?: order_by | null
  activity_online_session_ticket_count?: order_by | null
}

/**
 * order by var_pop() on columns of table "activity_session"
 */
export interface activity_session_var_pop_order_by {
  threshold?: order_by | null
}

/**
 * order by var_samp() on columns of table "activity_session"
 */
export interface activity_session_var_samp_order_by {
  threshold?: order_by | null
}

/**
 * order by variance() on columns of table "activity_session"
 */
export interface activity_session_variance_order_by {
  threshold?: order_by | null
}

/**
 * order by stddev() on columns of table "activity"
 */
export interface activity_stddev_order_by {
  position?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "activity"
 */
export interface activity_stddev_pop_order_by {
  position?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "activity"
 */
export interface activity_stddev_samp_order_by {
  position?: order_by | null
}

/**
 * order by sum() on columns of table "activity"
 */
export interface activity_sum_order_by {
  position?: order_by | null
}

/**
 * order by aggregate values of table "activity_tag"
 */
export interface activity_tag_aggregate_order_by {
  avg?: activity_tag_avg_order_by | null
  count?: order_by | null
  max?: activity_tag_max_order_by | null
  min?: activity_tag_min_order_by | null
  stddev?: activity_tag_stddev_order_by | null
  stddev_pop?: activity_tag_stddev_pop_order_by | null
  stddev_samp?: activity_tag_stddev_samp_order_by | null
  sum?: activity_tag_sum_order_by | null
  var_pop?: activity_tag_var_pop_order_by | null
  var_samp?: activity_tag_var_samp_order_by | null
  variance?: activity_tag_variance_order_by | null
}

/**
 * order by avg() on columns of table "activity_tag"
 */
export interface activity_tag_avg_order_by {
  position?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "activity_tag". All fields are combined with a logical 'AND'.
 */
export interface activity_tag_bool_exp {
  _and?: (activity_tag_bool_exp | null)[] | null
  _not?: activity_tag_bool_exp | null
  _or?: (activity_tag_bool_exp | null)[] | null
  activity?: activity_bool_exp | null
  activity_id?: uuid_comparison_exp | null
  id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  tag?: tag_bool_exp | null
  tag_name?: String_comparison_exp | null
}

/**
 * order by max() on columns of table "activity_tag"
 */
export interface activity_tag_max_order_by {
  activity_id?: order_by | null
  id?: order_by | null
  position?: order_by | null
  tag_name?: order_by | null
}

/**
 * order by min() on columns of table "activity_tag"
 */
export interface activity_tag_min_order_by {
  activity_id?: order_by | null
  id?: order_by | null
  position?: order_by | null
  tag_name?: order_by | null
}

/**
 * order by stddev() on columns of table "activity_tag"
 */
export interface activity_tag_stddev_order_by {
  position?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "activity_tag"
 */
export interface activity_tag_stddev_pop_order_by {
  position?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "activity_tag"
 */
export interface activity_tag_stddev_samp_order_by {
  position?: order_by | null
}

/**
 * order by sum() on columns of table "activity_tag"
 */
export interface activity_tag_sum_order_by {
  position?: order_by | null
}

/**
 * order by var_pop() on columns of table "activity_tag"
 */
export interface activity_tag_var_pop_order_by {
  position?: order_by | null
}

/**
 * order by var_samp() on columns of table "activity_tag"
 */
export interface activity_tag_var_samp_order_by {
  position?: order_by | null
}

/**
 * order by variance() on columns of table "activity_tag"
 */
export interface activity_tag_variance_order_by {
  position?: order_by | null
}

/**
 * order by aggregate values of table "activity_ticket"
 */
export interface activity_ticket_aggregate_order_by {
  avg?: activity_ticket_avg_order_by | null
  count?: order_by | null
  max?: activity_ticket_max_order_by | null
  min?: activity_ticket_min_order_by | null
  stddev?: activity_ticket_stddev_order_by | null
  stddev_pop?: activity_ticket_stddev_pop_order_by | null
  stddev_samp?: activity_ticket_stddev_samp_order_by | null
  sum?: activity_ticket_sum_order_by | null
  var_pop?: activity_ticket_var_pop_order_by | null
  var_samp?: activity_ticket_var_samp_order_by | null
  variance?: activity_ticket_variance_order_by | null
}

/**
 * order by avg() on columns of table "activity_ticket"
 */
export interface activity_ticket_avg_order_by {
  count?: order_by | null
  price?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "activity_ticket". All fields are combined with a logical 'AND'.
 */
export interface activity_ticket_bool_exp {
  _and?: (activity_ticket_bool_exp | null)[] | null
  _not?: activity_ticket_bool_exp | null
  _or?: (activity_ticket_bool_exp | null)[] | null
  activity?: activity_bool_exp | null
  activity_enrollments?: activity_enrollment_bool_exp | null
  activity_id?: uuid_comparison_exp | null
  activity_session_tickets?: activity_session_ticket_bool_exp | null
  activity_ticket_enrollments?: activity_ticket_enrollment_bool_exp | null
  count?: Int_comparison_exp | null
  currency?: currency_bool_exp | null
  currency_id?: String_comparison_exp | null
  description?: String_comparison_exp | null
  ended_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_published?: Boolean_comparison_exp | null
  price?: numeric_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
  title?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "activity_ticket_enrollment". All fields are combined with a logical 'AND'.
 */
export interface activity_ticket_enrollment_bool_exp {
  _and?: (activity_ticket_enrollment_bool_exp | null)[] | null
  _not?: activity_ticket_enrollment_bool_exp | null
  _or?: (activity_ticket_enrollment_bool_exp | null)[] | null
  activity_ticket?: activity_ticket_bool_exp | null
  activity_ticket_id?: uuid_comparison_exp | null
  member_id?: String_comparison_exp | null
  order_log?: order_log_bool_exp | null
  order_log_id?: String_comparison_exp | null
  order_product_id?: uuid_comparison_exp | null
}

/**
 * order by max() on columns of table "activity_ticket"
 */
export interface activity_ticket_max_order_by {
  activity_id?: order_by | null
  count?: order_by | null
  currency_id?: order_by | null
  description?: order_by | null
  ended_at?: order_by | null
  id?: order_by | null
  price?: order_by | null
  started_at?: order_by | null
  title?: order_by | null
}

/**
 * order by min() on columns of table "activity_ticket"
 */
export interface activity_ticket_min_order_by {
  activity_id?: order_by | null
  count?: order_by | null
  currency_id?: order_by | null
  description?: order_by | null
  ended_at?: order_by | null
  id?: order_by | null
  price?: order_by | null
  started_at?: order_by | null
  title?: order_by | null
}

/**
 * order by stddev() on columns of table "activity_ticket"
 */
export interface activity_ticket_stddev_order_by {
  count?: order_by | null
  price?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "activity_ticket"
 */
export interface activity_ticket_stddev_pop_order_by {
  count?: order_by | null
  price?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "activity_ticket"
 */
export interface activity_ticket_stddev_samp_order_by {
  count?: order_by | null
  price?: order_by | null
}

/**
 * order by sum() on columns of table "activity_ticket"
 */
export interface activity_ticket_sum_order_by {
  count?: order_by | null
  price?: order_by | null
}

/**
 * order by var_pop() on columns of table "activity_ticket"
 */
export interface activity_ticket_var_pop_order_by {
  count?: order_by | null
  price?: order_by | null
}

/**
 * order by var_samp() on columns of table "activity_ticket"
 */
export interface activity_ticket_var_samp_order_by {
  count?: order_by | null
  price?: order_by | null
}

/**
 * order by variance() on columns of table "activity_ticket"
 */
export interface activity_ticket_variance_order_by {
  count?: order_by | null
  price?: order_by | null
}

/**
 * order by var_pop() on columns of table "activity"
 */
export interface activity_var_pop_order_by {
  position?: order_by | null
}

/**
 * order by var_samp() on columns of table "activity"
 */
export interface activity_var_samp_order_by {
  position?: order_by | null
}

/**
 * order by variance() on columns of table "activity"
 */
export interface activity_variance_order_by {
  position?: order_by | null
}

/**
 * order by aggregate values of table "app_admin"
 */
export interface app_admin_aggregate_order_by {
  avg?: app_admin_avg_order_by | null
  count?: order_by | null
  max?: app_admin_max_order_by | null
  min?: app_admin_min_order_by | null
  stddev?: app_admin_stddev_order_by | null
  stddev_pop?: app_admin_stddev_pop_order_by | null
  stddev_samp?: app_admin_stddev_samp_order_by | null
  sum?: app_admin_sum_order_by | null
  var_pop?: app_admin_var_pop_order_by | null
  var_samp?: app_admin_var_samp_order_by | null
  variance?: app_admin_variance_order_by | null
}

/**
 * order by avg() on columns of table "app_admin"
 */
export interface app_admin_avg_order_by {
  position?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "app_admin". All fields are combined with a logical 'AND'.
 */
export interface app_admin_bool_exp {
  _and?: (app_admin_bool_exp | null)[] | null
  _not?: app_admin_bool_exp | null
  _or?: (app_admin_bool_exp | null)[] | null
  api_host?: String_comparison_exp | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  host?: String_comparison_exp | null
  position?: Int_comparison_exp | null
}

/**
 * order by max() on columns of table "app_admin"
 */
export interface app_admin_max_order_by {
  api_host?: order_by | null
  app_id?: order_by | null
  host?: order_by | null
  position?: order_by | null
}

/**
 * order by min() on columns of table "app_admin"
 */
export interface app_admin_min_order_by {
  api_host?: order_by | null
  app_id?: order_by | null
  host?: order_by | null
  position?: order_by | null
}

/**
 * order by stddev() on columns of table "app_admin"
 */
export interface app_admin_stddev_order_by {
  position?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "app_admin"
 */
export interface app_admin_stddev_pop_order_by {
  position?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "app_admin"
 */
export interface app_admin_stddev_samp_order_by {
  position?: order_by | null
}

/**
 * order by sum() on columns of table "app_admin"
 */
export interface app_admin_sum_order_by {
  position?: order_by | null
}

/**
 * order by var_pop() on columns of table "app_admin"
 */
export interface app_admin_var_pop_order_by {
  position?: order_by | null
}

/**
 * order by var_samp() on columns of table "app_admin"
 */
export interface app_admin_var_samp_order_by {
  position?: order_by | null
}

/**
 * order by variance() on columns of table "app_admin"
 */
export interface app_admin_variance_order_by {
  position?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "app". All fields are combined with a logical 'AND'.
 */
export interface app_bool_exp {
  _and?: (app_bool_exp | null)[] | null
  _not?: app_bool_exp | null
  _or?: (app_bool_exp | null)[] | null
  activities?: activity_bool_exp | null
  app_admins?: app_admin_bool_exp | null
  app_hosts?: app_host_bool_exp | null
  app_modules?: app_module_bool_exp | null
  app_navs?: app_nav_bool_exp | null
  app_secrets?: app_secret_bool_exp | null
  app_settings?: app_setting_bool_exp | null
  cards?: card_bool_exp | null
  cart_items?: cart_item_bool_exp | null
  comments?: comment_bool_exp | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  id?: String_comparison_exp | null
  issues?: issue_bool_exp | null
  members?: member_bool_exp | null
  merchandises?: merchandise_bool_exp | null
  name?: String_comparison_exp | null
  packages?: package_bool_exp | null
  podcasts?: podcast_bool_exp | null
  point_discount_ratio?: numeric_comparison_exp | null
  point_exchange_rate?: numeric_comparison_exp | null
  point_validity_period?: numeric_comparison_exp | null
  posts?: post_bool_exp | null
  program_packages?: program_package_bool_exp | null
  programs?: program_bool_exp | null
  properties?: property_bool_exp | null
  sharing_codes?: sharing_code_bool_exp | null
  title?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
  vimeo_project_id?: String_comparison_exp | null
  voucher_plans?: voucher_plan_bool_exp | null
}

/**
 * order by aggregate values of table "app_host"
 */
export interface app_host_aggregate_order_by {
  avg?: app_host_avg_order_by | null
  count?: order_by | null
  max?: app_host_max_order_by | null
  min?: app_host_min_order_by | null
  stddev?: app_host_stddev_order_by | null
  stddev_pop?: app_host_stddev_pop_order_by | null
  stddev_samp?: app_host_stddev_samp_order_by | null
  sum?: app_host_sum_order_by | null
  var_pop?: app_host_var_pop_order_by | null
  var_samp?: app_host_var_samp_order_by | null
  variance?: app_host_variance_order_by | null
}

/**
 * order by avg() on columns of table "app_host"
 */
export interface app_host_avg_order_by {
  priority?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "app_host". All fields are combined with a logical 'AND'.
 */
export interface app_host_bool_exp {
  _and?: (app_host_bool_exp | null)[] | null
  _not?: app_host_bool_exp | null
  _or?: (app_host_bool_exp | null)[] | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  host?: String_comparison_exp | null
  priority?: Int_comparison_exp | null
}

/**
 * order by max() on columns of table "app_host"
 */
export interface app_host_max_order_by {
  app_id?: order_by | null
  host?: order_by | null
  priority?: order_by | null
}

/**
 * order by min() on columns of table "app_host"
 */
export interface app_host_min_order_by {
  app_id?: order_by | null
  host?: order_by | null
  priority?: order_by | null
}

/**
 * order by stddev() on columns of table "app_host"
 */
export interface app_host_stddev_order_by {
  priority?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "app_host"
 */
export interface app_host_stddev_pop_order_by {
  priority?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "app_host"
 */
export interface app_host_stddev_samp_order_by {
  priority?: order_by | null
}

/**
 * order by sum() on columns of table "app_host"
 */
export interface app_host_sum_order_by {
  priority?: order_by | null
}

/**
 * order by var_pop() on columns of table "app_host"
 */
export interface app_host_var_pop_order_by {
  priority?: order_by | null
}

/**
 * order by var_samp() on columns of table "app_host"
 */
export interface app_host_var_samp_order_by {
  priority?: order_by | null
}

/**
 * order by variance() on columns of table "app_host"
 */
export interface app_host_variance_order_by {
  priority?: order_by | null
}

/**
 * order by aggregate values of table "app_module"
 */
export interface app_module_aggregate_order_by {
  count?: order_by | null
  max?: app_module_max_order_by | null
  min?: app_module_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "app_module". All fields are combined with a logical 'AND'.
 */
export interface app_module_bool_exp {
  _and?: (app_module_bool_exp | null)[] | null
  _not?: app_module_bool_exp | null
  _or?: (app_module_bool_exp | null)[] | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  module?: module_bool_exp | null
  module_id?: String_comparison_exp | null
}

/**
 * order by max() on columns of table "app_module"
 */
export interface app_module_max_order_by {
  app_id?: order_by | null
  created_at?: order_by | null
  id?: order_by | null
  module_id?: order_by | null
}

/**
 * order by min() on columns of table "app_module"
 */
export interface app_module_min_order_by {
  app_id?: order_by | null
  created_at?: order_by | null
  id?: order_by | null
  module_id?: order_by | null
}

/**
 * order by aggregate values of table "app_nav"
 */
export interface app_nav_aggregate_order_by {
  avg?: app_nav_avg_order_by | null
  count?: order_by | null
  max?: app_nav_max_order_by | null
  min?: app_nav_min_order_by | null
  stddev?: app_nav_stddev_order_by | null
  stddev_pop?: app_nav_stddev_pop_order_by | null
  stddev_samp?: app_nav_stddev_samp_order_by | null
  sum?: app_nav_sum_order_by | null
  var_pop?: app_nav_var_pop_order_by | null
  var_samp?: app_nav_var_samp_order_by | null
  variance?: app_nav_variance_order_by | null
}

/**
 * order by avg() on columns of table "app_nav"
 */
export interface app_nav_avg_order_by {
  position?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "app_nav". All fields are combined with a logical 'AND'.
 */
export interface app_nav_bool_exp {
  _and?: (app_nav_bool_exp | null)[] | null
  _not?: app_nav_bool_exp | null
  _or?: (app_nav_bool_exp | null)[] | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  block?: String_comparison_exp | null
  external?: Boolean_comparison_exp | null
  href?: String_comparison_exp | null
  icon?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  label?: String_comparison_exp | null
  locale?: String_comparison_exp | null
  options?: jsonb_comparison_exp | null
  parent_id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  sub_app_navs?: app_nav_bool_exp | null
  tag?: String_comparison_exp | null
}

/**
 * order by max() on columns of table "app_nav"
 */
export interface app_nav_max_order_by {
  app_id?: order_by | null
  block?: order_by | null
  href?: order_by | null
  icon?: order_by | null
  id?: order_by | null
  label?: order_by | null
  locale?: order_by | null
  parent_id?: order_by | null
  position?: order_by | null
  tag?: order_by | null
}

/**
 * order by min() on columns of table "app_nav"
 */
export interface app_nav_min_order_by {
  app_id?: order_by | null
  block?: order_by | null
  href?: order_by | null
  icon?: order_by | null
  id?: order_by | null
  label?: order_by | null
  locale?: order_by | null
  parent_id?: order_by | null
  position?: order_by | null
  tag?: order_by | null
}

/**
 * order by stddev() on columns of table "app_nav"
 */
export interface app_nav_stddev_order_by {
  position?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "app_nav"
 */
export interface app_nav_stddev_pop_order_by {
  position?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "app_nav"
 */
export interface app_nav_stddev_samp_order_by {
  position?: order_by | null
}

/**
 * order by sum() on columns of table "app_nav"
 */
export interface app_nav_sum_order_by {
  position?: order_by | null
}

/**
 * order by var_pop() on columns of table "app_nav"
 */
export interface app_nav_var_pop_order_by {
  position?: order_by | null
}

/**
 * order by var_samp() on columns of table "app_nav"
 */
export interface app_nav_var_samp_order_by {
  position?: order_by | null
}

/**
 * order by variance() on columns of table "app_nav"
 */
export interface app_nav_variance_order_by {
  position?: order_by | null
}

/**
 * ordering options when selecting data from "app"
 */
export interface app_order_by {
  activities_aggregate?: activity_aggregate_order_by | null
  app_admins_aggregate?: app_admin_aggregate_order_by | null
  app_hosts_aggregate?: app_host_aggregate_order_by | null
  app_modules_aggregate?: app_module_aggregate_order_by | null
  app_navs_aggregate?: app_nav_aggregate_order_by | null
  app_secrets_aggregate?: app_secret_aggregate_order_by | null
  app_settings_aggregate?: app_setting_aggregate_order_by | null
  cards_aggregate?: card_aggregate_order_by | null
  cart_items_aggregate?: cart_item_aggregate_order_by | null
  comments_aggregate?: comment_aggregate_order_by | null
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  issues_aggregate?: issue_aggregate_order_by | null
  members_aggregate?: member_aggregate_order_by | null
  merchandises_aggregate?: merchandise_aggregate_order_by | null
  name?: order_by | null
  packages_aggregate?: package_aggregate_order_by | null
  podcasts_aggregate?: podcast_aggregate_order_by | null
  point_discount_ratio?: order_by | null
  point_exchange_rate?: order_by | null
  point_validity_period?: order_by | null
  posts_aggregate?: post_aggregate_order_by | null
  program_packages_aggregate?: program_package_aggregate_order_by | null
  programs_aggregate?: program_aggregate_order_by | null
  properties_aggregate?: property_aggregate_order_by | null
  sharing_codes_aggregate?: sharing_code_aggregate_order_by | null
  title?: order_by | null
  updated_at?: order_by | null
  vimeo_project_id?: order_by | null
  voucher_plans_aggregate?: voucher_plan_aggregate_order_by | null
}

/**
 * Boolean expression to filter rows from the table "app_page". All fields are combined with a logical 'AND'.
 */
export interface app_page_bool_exp {
  _and?: (app_page_bool_exp | null)[] | null
  _not?: app_page_bool_exp | null
  _or?: (app_page_bool_exp | null)[] | null
  app_id?: String_comparison_exp | null
  app_page_sections?: app_page_section_bool_exp | null
  craft_data?: jsonb_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  editor?: member_bool_exp | null
  editor_id?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_deleted?: Boolean_comparison_exp | null
  options?: jsonb_comparison_exp | null
  path?: String_comparison_exp | null
  published_at?: timestamptz_comparison_exp | null
  title?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "app_page_section". All fields are combined with a logical 'AND'.
 */
export interface app_page_section_bool_exp {
  _and?: (app_page_section_bool_exp | null)[] | null
  _not?: app_page_section_bool_exp | null
  _or?: (app_page_section_bool_exp | null)[] | null
  app_page?: app_page_bool_exp | null
  app_page_id?: uuid_comparison_exp | null
  id?: uuid_comparison_exp | null
  options?: jsonb_comparison_exp | null
  position?: numeric_comparison_exp | null
  type?: String_comparison_exp | null
}

/**
 * order by aggregate values of table "app_secret"
 */
export interface app_secret_aggregate_order_by {
  count?: order_by | null
  max?: app_secret_max_order_by | null
  min?: app_secret_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "app_secret". All fields are combined with a logical 'AND'.
 */
export interface app_secret_bool_exp {
  _and?: (app_secret_bool_exp | null)[] | null
  _not?: app_secret_bool_exp | null
  _or?: (app_secret_bool_exp | null)[] | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  key?: String_comparison_exp | null
  setting?: setting_bool_exp | null
  value?: String_comparison_exp | null
}

/**
 * order by max() on columns of table "app_secret"
 */
export interface app_secret_max_order_by {
  app_id?: order_by | null
  id?: order_by | null
  key?: order_by | null
  value?: order_by | null
}

/**
 * order by min() on columns of table "app_secret"
 */
export interface app_secret_min_order_by {
  app_id?: order_by | null
  id?: order_by | null
  key?: order_by | null
  value?: order_by | null
}

/**
 * order by aggregate values of table "app_setting"
 */
export interface app_setting_aggregate_order_by {
  count?: order_by | null
  max?: app_setting_max_order_by | null
  min?: app_setting_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "app_setting". All fields are combined with a logical 'AND'.
 */
export interface app_setting_bool_exp {
  _and?: (app_setting_bool_exp | null)[] | null
  _not?: app_setting_bool_exp | null
  _or?: (app_setting_bool_exp | null)[] | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  key?: String_comparison_exp | null
  setting?: setting_bool_exp | null
  value?: String_comparison_exp | null
}

/**
 * order by max() on columns of table "app_setting"
 */
export interface app_setting_max_order_by {
  app_id?: order_by | null
  id?: order_by | null
  key?: order_by | null
  value?: order_by | null
}

/**
 * order by min() on columns of table "app_setting"
 */
export interface app_setting_min_order_by {
  app_id?: order_by | null
  id?: order_by | null
  key?: order_by | null
  value?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "appointment_enrollment". All fields are combined with a logical 'AND'.
 */
export interface appointment_enrollment_bool_exp {
  _and?: (appointment_enrollment_bool_exp | null)[] | null
  _not?: appointment_enrollment_bool_exp | null
  _or?: (appointment_enrollment_bool_exp | null)[] | null
  appointment_plan?: appointment_plan_bool_exp | null
  appointment_plan_id?: uuid_comparison_exp | null
  canceled_at?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  ended_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  issue?: String_comparison_exp | null
  join_url?: String_comparison_exp | null
  member?: member_public_bool_exp | null
  member_email?: String_comparison_exp | null
  member_id?: String_comparison_exp | null
  member_name?: String_comparison_exp | null
  member_phone?: String_comparison_exp | null
  order_product?: order_product_bool_exp | null
  order_product_id?: uuid_comparison_exp | null
  result?: String_comparison_exp | null
  start_url?: String_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "appointment_period". All fields are combined with a logical 'AND'.
 */
export interface appointment_period_bool_exp {
  _and?: (appointment_period_bool_exp | null)[] | null
  _not?: appointment_period_bool_exp | null
  _or?: (appointment_period_bool_exp | null)[] | null
  appointment_plan?: appointment_plan_bool_exp | null
  appointment_plan_id?: uuid_comparison_exp | null
  appointment_schedule?: appointment_schedule_bool_exp | null
  appointment_schedule_id?: uuid_comparison_exp | null
  available?: Boolean_comparison_exp | null
  booked?: Boolean_comparison_exp | null
  ended_at?: timestamptz_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
}

/**
 * order by aggregate values of table "appointment_plan"
 */
export interface appointment_plan_aggregate_order_by {
  avg?: appointment_plan_avg_order_by | null
  count?: order_by | null
  max?: appointment_plan_max_order_by | null
  min?: appointment_plan_min_order_by | null
  stddev?: appointment_plan_stddev_order_by | null
  stddev_pop?: appointment_plan_stddev_pop_order_by | null
  stddev_samp?: appointment_plan_stddev_samp_order_by | null
  sum?: appointment_plan_sum_order_by | null
  var_pop?: appointment_plan_var_pop_order_by | null
  var_samp?: appointment_plan_var_samp_order_by | null
  variance?: appointment_plan_variance_order_by | null
}

/**
 * order by avg() on columns of table "appointment_plan"
 */
export interface appointment_plan_avg_order_by {
  duration?: order_by | null
  price?: order_by | null
  reservation_amount?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "appointment_plan". All fields are combined with a logical 'AND'.
 */
export interface appointment_plan_bool_exp {
  _and?: (appointment_plan_bool_exp | null)[] | null
  _not?: appointment_plan_bool_exp | null
  _or?: (appointment_plan_bool_exp | null)[] | null
  appointment_enrollments?: appointment_enrollment_bool_exp | null
  appointment_periods?: appointment_period_bool_exp | null
  appointment_schedules?: appointment_schedule_bool_exp | null
  created_at?: timestamptz_comparison_exp | null
  creator?: member_public_bool_exp | null
  creator_id?: String_comparison_exp | null
  currency?: currency_bool_exp | null
  currency_id?: String_comparison_exp | null
  description?: String_comparison_exp | null
  duration?: numeric_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_private?: Boolean_comparison_exp | null
  phone?: String_comparison_exp | null
  price?: numeric_comparison_exp | null
  published_at?: timestamptz_comparison_exp | null
  reservation_amount?: numeric_comparison_exp | null
  reservation_type?: String_comparison_exp | null
  support_locales?: jsonb_comparison_exp | null
  title?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by max() on columns of table "appointment_plan"
 */
export interface appointment_plan_max_order_by {
  created_at?: order_by | null
  creator_id?: order_by | null
  currency_id?: order_by | null
  description?: order_by | null
  duration?: order_by | null
  id?: order_by | null
  phone?: order_by | null
  price?: order_by | null
  published_at?: order_by | null
  reservation_amount?: order_by | null
  reservation_type?: order_by | null
  title?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "appointment_plan"
 */
export interface appointment_plan_min_order_by {
  created_at?: order_by | null
  creator_id?: order_by | null
  currency_id?: order_by | null
  description?: order_by | null
  duration?: order_by | null
  id?: order_by | null
  phone?: order_by | null
  price?: order_by | null
  published_at?: order_by | null
  reservation_amount?: order_by | null
  reservation_type?: order_by | null
  title?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by stddev() on columns of table "appointment_plan"
 */
export interface appointment_plan_stddev_order_by {
  duration?: order_by | null
  price?: order_by | null
  reservation_amount?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "appointment_plan"
 */
export interface appointment_plan_stddev_pop_order_by {
  duration?: order_by | null
  price?: order_by | null
  reservation_amount?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "appointment_plan"
 */
export interface appointment_plan_stddev_samp_order_by {
  duration?: order_by | null
  price?: order_by | null
  reservation_amount?: order_by | null
}

/**
 * order by sum() on columns of table "appointment_plan"
 */
export interface appointment_plan_sum_order_by {
  duration?: order_by | null
  price?: order_by | null
  reservation_amount?: order_by | null
}

/**
 * order by var_pop() on columns of table "appointment_plan"
 */
export interface appointment_plan_var_pop_order_by {
  duration?: order_by | null
  price?: order_by | null
  reservation_amount?: order_by | null
}

/**
 * order by var_samp() on columns of table "appointment_plan"
 */
export interface appointment_plan_var_samp_order_by {
  duration?: order_by | null
  price?: order_by | null
  reservation_amount?: order_by | null
}

/**
 * order by variance() on columns of table "appointment_plan"
 */
export interface appointment_plan_variance_order_by {
  duration?: order_by | null
  price?: order_by | null
  reservation_amount?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "appointment_schedule". All fields are combined with a logical 'AND'.
 */
export interface appointment_schedule_bool_exp {
  _and?: (appointment_schedule_bool_exp | null)[] | null
  _not?: appointment_schedule_bool_exp | null
  _or?: (appointment_schedule_bool_exp | null)[] | null
  appointment_plan?: appointment_plan_bool_exp | null
  appointment_plan_id?: uuid_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  excludes?: jsonb_comparison_exp | null
  id?: uuid_comparison_exp | null
  interval_amount?: Int_comparison_exp | null
  interval_type?: String_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "attachment". All fields are combined with a logical 'AND'.
 */
export interface attachment_bool_exp {
  _and?: (attachment_bool_exp | null)[] | null
  _not?: attachment_bool_exp | null
  _or?: (attachment_bool_exp | null)[] | null
  app_id?: String_comparison_exp | null
  author?: member_bool_exp | null
  author_id?: String_comparison_exp | null
  content_type?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  data?: jsonb_comparison_exp | null
  duration?: numeric_comparison_exp | null
  filename?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_deleted?: Boolean_comparison_exp | null
  name?: String_comparison_exp | null
  options?: jsonb_comparison_exp | null
  size?: numeric_comparison_exp | null
  status?: String_comparison_exp | null
  target?: String_comparison_exp | null
  thumbnail_url?: String_comparison_exp | null
  type?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "attend". All fields are combined with a logical 'AND'.
 */
export interface attend_bool_exp {
  _and?: (attend_bool_exp | null)[] | null
  _not?: attend_bool_exp | null
  _or?: (attend_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  ended_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * expression to compare columns of type bigint. All fields are combined with logical 'AND'.
 */
export interface bigint_comparison_exp {
  _eq?: any | null
  _gt?: any | null
  _gte?: any | null
  _in?: any[] | null
  _is_null?: boolean | null
  _lt?: any | null
  _lte?: any | null
  _neq?: any | null
  _nin?: any[] | null
}

/**
 * order by aggregate values of table "card"
 */
export interface card_aggregate_order_by {
  count?: order_by | null
  max?: card_max_order_by | null
  min?: card_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "card". All fields are combined with a logical 'AND'.
 */
export interface card_bool_exp {
  _and?: (card_bool_exp | null)[] | null
  _not?: card_bool_exp | null
  _or?: (card_bool_exp | null)[] | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  card_discounts?: card_discount_bool_exp | null
  card_enrollments?: card_enrollment_bool_exp | null
  creator?: member_public_bool_exp | null
  creator_id?: String_comparison_exp | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  template?: String_comparison_exp | null
  title?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "card_discount". All fields are combined with a logical 'AND'.
 */
export interface card_discount_bool_exp {
  _and?: (card_discount_bool_exp | null)[] | null
  _not?: card_discount_bool_exp | null
  _or?: (card_discount_bool_exp | null)[] | null
  amount?: numeric_comparison_exp | null
  card?: card_bool_exp | null
  card_id?: uuid_comparison_exp | null
  id?: uuid_comparison_exp | null
  product?: product_bool_exp | null
  product_id?: String_comparison_exp | null
  type?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "card_enrollment". All fields are combined with a logical 'AND'.
 */
export interface card_enrollment_bool_exp {
  _and?: (card_enrollment_bool_exp | null)[] | null
  _not?: card_enrollment_bool_exp | null
  _or?: (card_enrollment_bool_exp | null)[] | null
  card?: card_bool_exp | null
  card_id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by max() on columns of table "card"
 */
export interface card_max_order_by {
  app_id?: order_by | null
  creator_id?: order_by | null
  description?: order_by | null
  id?: order_by | null
  template?: order_by | null
  title?: order_by | null
}

/**
 * order by min() on columns of table "card"
 */
export interface card_min_order_by {
  app_id?: order_by | null
  creator_id?: order_by | null
  description?: order_by | null
  id?: order_by | null
  template?: order_by | null
  title?: order_by | null
}

/**
 * order by aggregate values of table "cart_item"
 */
export interface cart_item_aggregate_order_by {
  count?: order_by | null
  max?: cart_item_max_order_by | null
  min?: cart_item_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "cart_item". All fields are combined with a logical 'AND'.
 */
export interface cart_item_bool_exp {
  _and?: (cart_item_bool_exp | null)[] | null
  _not?: cart_item_bool_exp | null
  _or?: (cart_item_bool_exp | null)[] | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  class?: String_comparison_exp | null
  fingerprint?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  target?: jsonb_comparison_exp | null
}

/**
 * order by max() on columns of table "cart_item"
 */
export interface cart_item_max_order_by {
  app_id?: order_by | null
  class?: order_by | null
  fingerprint?: order_by | null
  id?: order_by | null
}

/**
 * order by min() on columns of table "cart_item"
 */
export interface cart_item_min_order_by {
  app_id?: order_by | null
  class?: order_by | null
  fingerprint?: order_by | null
  id?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "cart_product". All fields are combined with a logical 'AND'.
 */
export interface cart_product_bool_exp {
  _and?: (cart_product_bool_exp | null)[] | null
  _not?: cart_product_bool_exp | null
  _or?: (cart_product_bool_exp | null)[] | null
  app_id?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member_id?: String_comparison_exp | null
  product?: product_bool_exp | null
  product_id?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "category". All fields are combined with a logical 'AND'.
 */
export interface category_bool_exp {
  _and?: (category_bool_exp | null)[] | null
  _not?: category_bool_exp | null
  _or?: (category_bool_exp | null)[] | null
  activity_categories?: activity_category_bool_exp | null
  app_id?: String_comparison_exp | null
  class?: String_comparison_exp | null
  creator_categories?: creator_category_bool_exp | null
  id?: String_comparison_exp | null
  member_categories?: member_category_bool_exp | null
  member_tasks?: member_task_bool_exp | null
  merchandise_categories?: merchandise_category_bool_exp | null
  name?: String_comparison_exp | null
  podcast_program_categories?: podcast_program_category_bool_exp | null
  position?: Int_comparison_exp | null
  post_categories?: post_category_bool_exp | null
  program_categories?: program_category_bool_exp | null
  program_package_categories?: program_package_category_bool_exp | null
  project_categories?: project_category_bool_exp | null
}

/**
 * Boolean expression to filter rows from the table "coin_log". All fields are combined with a logical 'AND'.
 */
export interface coin_log_bool_exp {
  _and?: (coin_log_bool_exp | null)[] | null
  _not?: coin_log_bool_exp | null
  _or?: (coin_log_bool_exp | null)[] | null
  amount?: numeric_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  ended_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  note?: String_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
  title?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "coin_status". All fields are combined with a logical 'AND'.
 */
export interface coin_status_bool_exp {
  _and?: (coin_status_bool_exp | null)[] | null
  _not?: coin_status_bool_exp | null
  _or?: (coin_status_bool_exp | null)[] | null
  amount?: numeric_comparison_exp | null
  coin_id?: uuid_comparison_exp | null
  coin_log?: coin_log_bool_exp | null
  member_id?: String_comparison_exp | null
  remaining?: numeric_comparison_exp | null
  used_coins?: numeric_comparison_exp | null
}

/**
 * order by aggregate values of table "comment"
 */
export interface comment_aggregate_order_by {
  count?: order_by | null
  max?: comment_max_order_by | null
  min?: comment_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "comment". All fields are combined with a logical 'AND'.
 */
export interface comment_bool_exp {
  _and?: (comment_bool_exp | null)[] | null
  _not?: comment_bool_exp | null
  _or?: (comment_bool_exp | null)[] | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  comment_reactions?: comment_reaction_bool_exp | null
  comment_replies?: comment_reply_bool_exp | null
  content?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  thread_id?: String_comparison_exp | null
}

/**
 * order by max() on columns of table "comment"
 */
export interface comment_max_order_by {
  app_id?: order_by | null
  content?: order_by | null
  created_at?: order_by | null
  id?: order_by | null
  member_id?: order_by | null
  thread_id?: order_by | null
}

/**
 * order by min() on columns of table "comment"
 */
export interface comment_min_order_by {
  app_id?: order_by | null
  content?: order_by | null
  created_at?: order_by | null
  id?: order_by | null
  member_id?: order_by | null
  thread_id?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "comment_reaction". All fields are combined with a logical 'AND'.
 */
export interface comment_reaction_bool_exp {
  _and?: (comment_reaction_bool_exp | null)[] | null
  _not?: comment_reaction_bool_exp | null
  _or?: (comment_reaction_bool_exp | null)[] | null
  comment?: comment_bool_exp | null
  comment_id?: uuid_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "comment_reply". All fields are combined with a logical 'AND'.
 */
export interface comment_reply_bool_exp {
  _and?: (comment_reply_bool_exp | null)[] | null
  _not?: comment_reply_bool_exp | null
  _or?: (comment_reply_bool_exp | null)[] | null
  comment?: comment_bool_exp | null
  comment_id?: uuid_comparison_exp | null
  comment_reply_reactions?: comment_reply_reaction_bool_exp | null
  content?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "comment_reply_reaction". All fields are combined with a logical 'AND'.
 */
export interface comment_reply_reaction_bool_exp {
  _and?: (comment_reply_reaction_bool_exp | null)[] | null
  _not?: comment_reply_reaction_bool_exp | null
  _or?: (comment_reply_reaction_bool_exp | null)[] | null
  comment_reply?: comment_reply_bool_exp | null
  comment_reply_id?: uuid_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "contract". All fields are combined with a logical 'AND'.
 */
export interface contract_bool_exp {
  _and?: (contract_bool_exp | null)[] | null
  _not?: contract_bool_exp | null
  _or?: (contract_bool_exp | null)[] | null
  app_id?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  deliverables?: String_comparison_exp | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  member_contracts?: member_contract_bool_exp | null
  name?: String_comparison_exp | null
  options?: jsonb_comparison_exp | null
  published_at?: timestamptz_comparison_exp | null
  revocation?: String_comparison_exp | null
  template?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "coupon". All fields are combined with a logical 'AND'.
 */
export interface coupon_bool_exp {
  _and?: (coupon_bool_exp | null)[] | null
  _not?: coupon_bool_exp | null
  _or?: (coupon_bool_exp | null)[] | null
  coupon_code?: coupon_code_bool_exp | null
  coupon_code_id?: uuid_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  order_logs?: order_log_bool_exp | null
  status?: coupon_status_bool_exp | null
}

/**
 * Boolean expression to filter rows from the table "coupon_code". All fields are combined with a logical 'AND'.
 */
export interface coupon_code_bool_exp {
  _and?: (coupon_code_bool_exp | null)[] | null
  _not?: coupon_code_bool_exp | null
  _or?: (coupon_code_bool_exp | null)[] | null
  app_id?: String_comparison_exp | null
  code?: String_comparison_exp | null
  count?: Int_comparison_exp | null
  coupon_plan?: coupon_plan_bool_exp | null
  coupon_plan_id?: uuid_comparison_exp | null
  coupons?: coupon_bool_exp | null
  id?: uuid_comparison_exp | null
  remaining?: Int_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "coupon_plan". All fields are combined with a logical 'AND'.
 */
export interface coupon_plan_bool_exp {
  _and?: (coupon_plan_bool_exp | null)[] | null
  _not?: coupon_plan_bool_exp | null
  _or?: (coupon_plan_bool_exp | null)[] | null
  amount?: numeric_comparison_exp | null
  constraint?: numeric_comparison_exp | null
  coupon_codes?: coupon_code_bool_exp | null
  coupon_plan_products?: coupon_plan_product_bool_exp | null
  description?: String_comparison_exp | null
  ended_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  scope?: jsonb_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
  title?: String_comparison_exp | null
  type?: Int_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "coupon_plan_product". All fields are combined with a logical 'AND'.
 */
export interface coupon_plan_product_bool_exp {
  _and?: (coupon_plan_product_bool_exp | null)[] | null
  _not?: coupon_plan_product_bool_exp | null
  _or?: (coupon_plan_product_bool_exp | null)[] | null
  coupon_plan?: coupon_plan_bool_exp | null
  coupon_plan_id?: uuid_comparison_exp | null
  id?: uuid_comparison_exp | null
  product?: product_bool_exp | null
  product_id?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "coupon_status". All fields are combined with a logical 'AND'.
 */
export interface coupon_status_bool_exp {
  _and?: (coupon_status_bool_exp | null)[] | null
  _not?: coupon_status_bool_exp | null
  _or?: (coupon_status_bool_exp | null)[] | null
  coupon?: coupon_bool_exp | null
  coupon_id?: uuid_comparison_exp | null
  outdated?: Boolean_comparison_exp | null
  used?: Boolean_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "creator". All fields are combined with a logical 'AND'.
 */
export interface creator_bool_exp {
  _and?: (creator_bool_exp | null)[] | null
  _not?: creator_bool_exp | null
  _or?: (creator_bool_exp | null)[] | null
  block_id?: String_comparison_exp | null
  creator_categories?: creator_category_bool_exp | null
  id?: String_comparison_exp | null
  member?: member_public_bool_exp | null
  member_specialities?: member_speciality_bool_exp | null
  name?: String_comparison_exp | null
  picture_url?: String_comparison_exp | null
  position?: Int_comparison_exp | null
  published_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "creator_category". All fields are combined with a logical 'AND'.
 */
export interface creator_category_bool_exp {
  _and?: (creator_category_bool_exp | null)[] | null
  _not?: creator_category_bool_exp | null
  _or?: (creator_category_bool_exp | null)[] | null
  category?: category_bool_exp | null
  category_id?: String_comparison_exp | null
  creator?: creator_bool_exp | null
  creator_id?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  position?: Int_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "creator_display". All fields are combined with a logical 'AND'.
 */
export interface creator_display_bool_exp {
  _and?: (creator_display_bool_exp | null)[] | null
  _not?: creator_display_bool_exp | null
  _or?: (creator_display_bool_exp | null)[] | null
  block_id?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  position?: Int_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "currency". All fields are combined with a logical 'AND'.
 */
export interface currency_bool_exp {
  _and?: (currency_bool_exp | null)[] | null
  _not?: currency_bool_exp | null
  _or?: (currency_bool_exp | null)[] | null
  appointment_plans?: appointment_plan_bool_exp | null
  id?: String_comparison_exp | null
  label?: String_comparison_exp | null
  minor_units?: Int_comparison_exp | null
  name?: String_comparison_exp | null
  order_products?: order_product_bool_exp | null
  program_plans?: program_plan_bool_exp | null
  unit?: String_comparison_exp | null
}

/**
 * ordering options when selecting data from "currency"
 */
export interface currency_order_by {
  appointment_plans_aggregate?: appointment_plan_aggregate_order_by | null
  id?: order_by | null
  label?: order_by | null
  minor_units?: order_by | null
  name?: order_by | null
  order_products_aggregate?: order_product_aggregate_order_by | null
  program_plans_aggregate?: program_plan_aggregate_order_by | null
  unit?: order_by | null
}

/**
 * order by aggregate values of table "exercise"
 */
export interface exercise_aggregate_order_by {
  count?: order_by | null
  max?: exercise_max_order_by | null
  min?: exercise_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "exercise". All fields are combined with a logical 'AND'.
 */
export interface exercise_bool_exp {
  _and?: (exercise_bool_exp | null)[] | null
  _not?: exercise_bool_exp | null
  _or?: (exercise_bool_exp | null)[] | null
  answer?: jsonb_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  program_content?: program_content_bool_exp | null
  program_content_id?: uuid_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by max() on columns of table "exercise"
 */
export interface exercise_max_order_by {
  created_at?: order_by | null
  id?: order_by | null
  member_id?: order_by | null
  program_content_id?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "exercise"
 */
export interface exercise_min_order_by {
  created_at?: order_by | null
  id?: order_by | null
  member_id?: order_by | null
  program_content_id?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by aggregate values of table "issue"
 */
export interface issue_aggregate_order_by {
  count?: order_by | null
  max?: issue_max_order_by | null
  min?: issue_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "issue". All fields are combined with a logical 'AND'.
 */
export interface issue_bool_exp {
  _and?: (issue_bool_exp | null)[] | null
  _not?: issue_bool_exp | null
  _or?: (issue_bool_exp | null)[] | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  issue_enrollment?: issue_enrollment_bool_exp | null
  issue_reactions?: issue_reaction_bool_exp | null
  issue_replies?: issue_reply_bool_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  solved_at?: timestamptz_comparison_exp | null
  thread_id?: String_comparison_exp | null
  title?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "issue_enrollment". All fields are combined with a logical 'AND'.
 */
export interface issue_enrollment_bool_exp {
  _and?: (issue_enrollment_bool_exp | null)[] | null
  _not?: issue_enrollment_bool_exp | null
  _or?: (issue_enrollment_bool_exp | null)[] | null
  issue?: issue_bool_exp | null
  issue_id?: uuid_comparison_exp | null
  program?: program_bool_exp | null
  program_content_id?: uuid_comparison_exp | null
  program_content_section_id?: uuid_comparison_exp | null
  program_id?: uuid_comparison_exp | null
  program_roles?: program_role_bool_exp | null
}

/**
 * order by max() on columns of table "issue"
 */
export interface issue_max_order_by {
  app_id?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  member_id?: order_by | null
  solved_at?: order_by | null
  thread_id?: order_by | null
  title?: order_by | null
}

/**
 * order by min() on columns of table "issue"
 */
export interface issue_min_order_by {
  app_id?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  member_id?: order_by | null
  solved_at?: order_by | null
  thread_id?: order_by | null
  title?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "issue_reaction". All fields are combined with a logical 'AND'.
 */
export interface issue_reaction_bool_exp {
  _and?: (issue_reaction_bool_exp | null)[] | null
  _not?: issue_reaction_bool_exp | null
  _or?: (issue_reaction_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  issue?: issue_bool_exp | null
  issue_id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  public_member?: member_public_bool_exp | null
}

/**
 * Boolean expression to filter rows from the table "issue_reply". All fields are combined with a logical 'AND'.
 */
export interface issue_reply_bool_exp {
  _and?: (issue_reply_bool_exp | null)[] | null
  _not?: issue_reply_bool_exp | null
  _or?: (issue_reply_bool_exp | null)[] | null
  content?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  issue?: issue_bool_exp | null
  issue_id?: uuid_comparison_exp | null
  issue_reply_reactions?: issue_reply_reaction_bool_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "issue_reply_reaction". All fields are combined with a logical 'AND'.
 */
export interface issue_reply_reaction_bool_exp {
  _and?: (issue_reply_reaction_bool_exp | null)[] | null
  _not?: issue_reply_reaction_bool_exp | null
  _or?: (issue_reply_reaction_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  issue_reply?: issue_reply_bool_exp | null
  issue_reply_id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  public_member?: member_public_bool_exp | null
}

/**
 * expression to compare columns of type jsonb. All fields are combined with logical 'AND'.
 */
export interface jsonb_comparison_exp {
  _contained_in?: any | null
  _contains?: any | null
  _eq?: any | null
  _gt?: any | null
  _gte?: any | null
  _has_key?: string | null
  _has_keys_all?: string[] | null
  _has_keys_any?: string[] | null
  _in?: any[] | null
  _is_null?: boolean | null
  _lt?: any | null
  _lte?: any | null
  _neq?: any | null
  _nin?: any[] | null
}

/**
 * Boolean expression to filter rows from the table "media". All fields are combined with a logical 'AND'.
 */
export interface media_bool_exp {
  _and?: (media_bool_exp | null)[] | null
  _not?: media_bool_exp | null
  _or?: (media_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  metadata?: jsonb_comparison_exp | null
  name?: String_comparison_exp | null
  resource_url?: String_comparison_exp | null
  size?: Int_comparison_exp | null
  type?: String_comparison_exp | null
}

/**
 * order by aggregate values of table "member"
 */
export interface member_aggregate_order_by {
  avg?: member_avg_order_by | null
  count?: order_by | null
  max?: member_max_order_by | null
  min?: member_min_order_by | null
  stddev?: member_stddev_order_by | null
  stddev_pop?: member_stddev_pop_order_by | null
  stddev_samp?: member_stddev_samp_order_by | null
  sum?: member_sum_order_by | null
  var_pop?: member_var_pop_order_by | null
  var_samp?: member_var_samp_order_by | null
  variance?: member_variance_order_by | null
}

/**
 * order by avg() on columns of table "member"
 */
export interface member_avg_order_by {
  star?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "member". All fields are combined with a logical 'AND'.
 */
export interface member_bool_exp {
  _and?: (member_bool_exp | null)[] | null
  _not?: member_bool_exp | null
  _or?: (member_bool_exp | null)[] | null
  abstract?: String_comparison_exp | null
  activities?: activity_bool_exp | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  app_pages?: app_page_bool_exp | null
  appointment_plans?: appointment_plan_bool_exp | null
  assignRulesBySourceMemberId?: xuemi_assign_rule_bool_exp | null
  assignRulesByTargetMemberId?: xuemi_assign_rule_bool_exp | null
  assign_rules?: xuemi_assign_rule_bool_exp | null
  assigned_at?: timestamptz_comparison_exp | null
  attachments?: attachment_bool_exp | null
  attends?: attend_bool_exp | null
  coin_logs?: coin_log_bool_exp | null
  coin_statuses?: coin_status_bool_exp | null
  comment_reactions?: comment_reaction_bool_exp | null
  comment_replies?: comment_reply_bool_exp | null
  comment_reply_reactions?: comment_reply_reaction_bool_exp | null
  comments?: comment_bool_exp | null
  commonhealth_user_id?: String_comparison_exp | null
  coupons?: coupon_bool_exp | null
  created_at?: timestamptz_comparison_exp | null
  creator_categories?: creator_category_bool_exp | null
  creator_displays?: creator_display_bool_exp | null
  description?: String_comparison_exp | null
  email?: String_comparison_exp | null
  exercises?: exercise_bool_exp | null
  facebook_user_id?: String_comparison_exp | null
  google_user_id?: String_comparison_exp | null
  id?: String_comparison_exp | null
  issue_reactions?: issue_reaction_bool_exp | null
  issue_replies?: issue_reply_bool_exp | null
  issue_reply_reactions?: issue_reply_reaction_bool_exp | null
  issues?: issue_bool_exp | null
  line_user_id?: String_comparison_exp | null
  logined_at?: timestamptz_comparison_exp | null
  manager?: member_bool_exp | null
  manager_id?: String_comparison_exp | null
  media?: media_bool_exp | null
  memberContractsByAuthorId?: member_contract_bool_exp | null
  memberNotesByAuthorId?: member_note_bool_exp | null
  memberTasksByExecutorId?: member_task_bool_exp | null
  member_cards?: member_card_bool_exp | null
  member_categories?: member_category_bool_exp | null
  member_contracts?: member_contract_bool_exp | null
  member_notes?: member_note_bool_exp | null
  member_oauths?: member_oauth_bool_exp | null
  member_permission_extras?: member_permission_extra_bool_exp | null
  member_permission_groups?: member_permission_group_bool_exp | null
  member_permissions?: member_permission_bool_exp | null
  member_phones?: member_phone_bool_exp | null
  member_properties?: member_property_bool_exp | null
  member_shops?: member_shop_bool_exp | null
  member_socials?: member_social_bool_exp | null
  member_specialities?: member_speciality_bool_exp | null
  member_tags?: member_tag_bool_exp | null
  member_tasks?: member_task_bool_exp | null
  members?: member_bool_exp | null
  merchandises?: merchandise_bool_exp | null
  metadata?: jsonb_comparison_exp | null
  name?: String_comparison_exp | null
  notifications?: notification_bool_exp | null
  notificationsByTargetMembereId?: notification_bool_exp | null
  order_contacts?: order_contact_bool_exp | null
  order_executors?: order_executor_bool_exp | null
  order_logs?: order_log_bool_exp | null
  passhash?: String_comparison_exp | null
  picture_url?: String_comparison_exp | null
  playlists?: playlist_bool_exp | null
  podcast_plans?: podcast_plan_bool_exp | null
  podcast_program_roles?: podcast_program_role_bool_exp | null
  podcast_programs?: podcast_program_bool_exp | null
  podcasts?: podcast_bool_exp | null
  point_logs?: point_log_bool_exp | null
  point_status?: point_status_bool_exp | null
  practices?: practice_bool_exp | null
  program_content_enrollments?: program_content_enrollment_bool_exp | null
  program_content_progresses?: program_content_progress_bool_exp | null
  program_roles?: program_role_bool_exp | null
  program_tempo_deliveries?: program_tempo_delivery_bool_exp | null
  refresh_token?: uuid_comparison_exp | null
  reviews?: review_bool_exp | null
  role?: String_comparison_exp | null
  roles_deprecated?: jsonb_comparison_exp | null
  star?: numeric_comparison_exp | null
  title?: String_comparison_exp | null
  username?: String_comparison_exp | null
  vouchers?: voucher_bool_exp | null
  youtube_channel_ids?: jsonb_comparison_exp | null
  zoom_user_id_deprecate?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "member_card". All fields are combined with a logical 'AND'.
 */
export interface member_card_bool_exp {
  _and?: (member_card_bool_exp | null)[] | null
  _not?: member_card_bool_exp | null
  _or?: (member_card_bool_exp | null)[] | null
  card_holder?: jsonb_comparison_exp | null
  card_identifier?: String_comparison_exp | null
  card_info?: jsonb_comparison_exp | null
  card_secret?: jsonb_comparison_exp | null
  id?: String_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "member_category". All fields are combined with a logical 'AND'.
 */
export interface member_category_bool_exp {
  _and?: (member_category_bool_exp | null)[] | null
  _not?: member_category_bool_exp | null
  _or?: (member_category_bool_exp | null)[] | null
  category?: category_bool_exp | null
  category_id?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  position?: Int_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "member_contract". All fields are combined with a logical 'AND'.
 */
export interface member_contract_bool_exp {
  _and?: (member_contract_bool_exp | null)[] | null
  _not?: member_contract_bool_exp | null
  _or?: (member_contract_bool_exp | null)[] | null
  agreed_at?: timestamptz_comparison_exp | null
  agreed_ip?: String_comparison_exp | null
  agreed_options?: jsonb_comparison_exp | null
  author?: member_bool_exp | null
  author_id?: String_comparison_exp | null
  contract?: contract_bool_exp | null
  contract_id?: uuid_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  ended_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  options?: jsonb_comparison_exp | null
  revocation_values?: jsonb_comparison_exp | null
  revoked_at?: timestamptz_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
  values?: jsonb_comparison_exp | null
}

/**
 * order by max() on columns of table "member"
 */
export interface member_max_order_by {
  abstract?: order_by | null
  app_id?: order_by | null
  assigned_at?: order_by | null
  commonhealth_user_id?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  email?: order_by | null
  facebook_user_id?: order_by | null
  google_user_id?: order_by | null
  id?: order_by | null
  line_user_id?: order_by | null
  logined_at?: order_by | null
  manager_id?: order_by | null
  name?: order_by | null
  passhash?: order_by | null
  picture_url?: order_by | null
  refresh_token?: order_by | null
  role?: order_by | null
  star?: order_by | null
  title?: order_by | null
  username?: order_by | null
  zoom_user_id_deprecate?: order_by | null
}

/**
 * order by min() on columns of table "member"
 */
export interface member_min_order_by {
  abstract?: order_by | null
  app_id?: order_by | null
  assigned_at?: order_by | null
  commonhealth_user_id?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  email?: order_by | null
  facebook_user_id?: order_by | null
  google_user_id?: order_by | null
  id?: order_by | null
  line_user_id?: order_by | null
  logined_at?: order_by | null
  manager_id?: order_by | null
  name?: order_by | null
  passhash?: order_by | null
  picture_url?: order_by | null
  refresh_token?: order_by | null
  role?: order_by | null
  star?: order_by | null
  title?: order_by | null
  username?: order_by | null
  zoom_user_id_deprecate?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "member_note_attachment". All fields are combined with a logical 'AND'.
 */
export interface member_note_attachment_bool_exp {
  _and?: (member_note_attachment_bool_exp | null)[] | null
  _not?: member_note_attachment_bool_exp | null
  _or?: (member_note_attachment_bool_exp | null)[] | null
  app_id?: String_comparison_exp | null
  attachment?: attachment_bool_exp | null
  attachment_id?: uuid_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  data?: jsonb_comparison_exp | null
  member_note?: member_note_bool_exp | null
  member_note_id?: String_comparison_exp | null
  options?: jsonb_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "member_note". All fields are combined with a logical 'AND'.
 */
export interface member_note_bool_exp {
  _and?: (member_note_bool_exp | null)[] | null
  _not?: member_note_bool_exp | null
  _or?: (member_note_bool_exp | null)[] | null
  author?: member_bool_exp | null
  author_id?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  deleted_at?: timestamptz_comparison_exp | null
  deleted_from?: String_comparison_exp | null
  description?: String_comparison_exp | null
  duration?: Int_comparison_exp | null
  id?: String_comparison_exp | null
  member?: member_bool_exp | null
  memberByAuthorId?: member_bool_exp | null
  memberByDeleteFrom?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  member_note_attachments?: member_note_attachment_bool_exp | null
  metadata?: jsonb_comparison_exp | null
  note?: String_comparison_exp | null
  rejected_at?: timestamptz_comparison_exp | null
  status?: String_comparison_exp | null
  type?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "member_oauth". All fields are combined with a logical 'AND'.
 */
export interface member_oauth_bool_exp {
  _and?: (member_oauth_bool_exp | null)[] | null
  _not?: member_oauth_bool_exp | null
  _or?: (member_oauth_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  provider?: String_comparison_exp | null
  provider_user_id?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "member_permission". All fields are combined with a logical 'AND'.
 */
export interface member_permission_bool_exp {
  _and?: (member_permission_bool_exp | null)[] | null
  _not?: member_permission_bool_exp | null
  _or?: (member_permission_bool_exp | null)[] | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  permission_id?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "member_permission_extra". All fields are combined with a logical 'AND'.
 */
export interface member_permission_extra_bool_exp {
  _and?: (member_permission_extra_bool_exp | null)[] | null
  _not?: member_permission_extra_bool_exp | null
  _or?: (member_permission_extra_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  permission?: permission_bool_exp | null
  permission_id?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "member_permission_group". All fields are combined with a logical 'AND'.
 */
export interface member_permission_group_bool_exp {
  _and?: (member_permission_group_bool_exp | null)[] | null
  _not?: member_permission_group_bool_exp | null
  _or?: (member_permission_group_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  permission_group?: permission_group_bool_exp | null
  permission_group_id?: uuid_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "member_phone". All fields are combined with a logical 'AND'.
 */
export interface member_phone_bool_exp {
  _and?: (member_phone_bool_exp | null)[] | null
  _not?: member_phone_bool_exp | null
  _or?: (member_phone_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_primary?: Boolean_comparison_exp | null
  is_valid?: Boolean_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  phone?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "member_property". All fields are combined with a logical 'AND'.
 */
export interface member_property_bool_exp {
  _and?: (member_property_bool_exp | null)[] | null
  _not?: member_property_bool_exp | null
  _or?: (member_property_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  property?: property_bool_exp | null
  property_id?: uuid_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
  value?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "member_public". All fields are combined with a logical 'AND'.
 */
export interface member_public_bool_exp {
  _and?: (member_public_bool_exp | null)[] | null
  _not?: member_public_bool_exp | null
  _or?: (member_public_bool_exp | null)[] | null
  abstract?: String_comparison_exp | null
  app_id?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  email?: String_comparison_exp | null
  id?: String_comparison_exp | null
  member_specialities?: member_speciality_bool_exp | null
  metadata?: jsonb_comparison_exp | null
  name?: String_comparison_exp | null
  picture_url?: String_comparison_exp | null
  role?: String_comparison_exp | null
  roles?: jsonb_comparison_exp | null
  tag_names?: jsonb_comparison_exp | null
  title?: String_comparison_exp | null
  username?: String_comparison_exp | null
  zoom_user_id?: String_comparison_exp | null
}

/**
 * ordering options when selecting data from "member_public"
 */
export interface member_public_order_by {
  abstract?: order_by | null
  app_id?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  email?: order_by | null
  id?: order_by | null
  member_specialities_aggregate?: member_speciality_aggregate_order_by | null
  metadata?: order_by | null
  name?: order_by | null
  picture_url?: order_by | null
  role?: order_by | null
  roles?: order_by | null
  tag_names?: order_by | null
  title?: order_by | null
  username?: order_by | null
  zoom_user_id?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "member_shop". All fields are combined with a logical 'AND'.
 */
export interface member_shop_bool_exp {
  _and?: (member_shop_bool_exp | null)[] | null
  _not?: member_shop_bool_exp | null
  _or?: (member_shop_bool_exp | null)[] | null
  cover_url?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_public_bool_exp | null
  member_id?: String_comparison_exp | null
  merchandises?: merchandise_bool_exp | null
  published_at?: timestamptz_comparison_exp | null
  shipping_methods?: jsonb_comparison_exp | null
  title?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "member_social". All fields are combined with a logical 'AND'.
 */
export interface member_social_bool_exp {
  _and?: (member_social_bool_exp | null)[] | null
  _not?: member_social_bool_exp | null
  _or?: (member_social_bool_exp | null)[] | null
  channel_id?: String_comparison_exp | null
  channel_url?: String_comparison_exp | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  name?: String_comparison_exp | null
  profile_url?: String_comparison_exp | null
  social_cards?: social_card_bool_exp | null
  type?: String_comparison_exp | null
}

/**
 * order by aggregate values of table "member_speciality"
 */
export interface member_speciality_aggregate_order_by {
  count?: order_by | null
  max?: member_speciality_max_order_by | null
  min?: member_speciality_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "member_speciality". All fields are combined with a logical 'AND'.
 */
export interface member_speciality_bool_exp {
  _and?: (member_speciality_bool_exp | null)[] | null
  _not?: member_speciality_bool_exp | null
  _or?: (member_speciality_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  tag?: tag_bool_exp | null
  tag_name?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by max() on columns of table "member_speciality"
 */
export interface member_speciality_max_order_by {
  created_at?: order_by | null
  id?: order_by | null
  member_id?: order_by | null
  tag_name?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "member_speciality"
 */
export interface member_speciality_min_order_by {
  created_at?: order_by | null
  id?: order_by | null
  member_id?: order_by | null
  tag_name?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by stddev() on columns of table "member"
 */
export interface member_stddev_order_by {
  star?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "member"
 */
export interface member_stddev_pop_order_by {
  star?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "member"
 */
export interface member_stddev_samp_order_by {
  star?: order_by | null
}

/**
 * order by sum() on columns of table "member"
 */
export interface member_sum_order_by {
  star?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "member_tag". All fields are combined with a logical 'AND'.
 */
export interface member_tag_bool_exp {
  _and?: (member_tag_bool_exp | null)[] | null
  _not?: member_tag_bool_exp | null
  _or?: (member_tag_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  tag?: tag_bool_exp | null
  tag_name?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "member_task". All fields are combined with a logical 'AND'.
 */
export interface member_task_bool_exp {
  _and?: (member_task_bool_exp | null)[] | null
  _not?: member_task_bool_exp | null
  _or?: (member_task_bool_exp | null)[] | null
  author?: member_bool_exp | null
  author_id?: String_comparison_exp | null
  category?: category_bool_exp | null
  category_id?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  due_at?: timestamptz_comparison_exp | null
  executor?: member_bool_exp | null
  executor_id?: String_comparison_exp | null
  id?: String_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  priority?: String_comparison_exp | null
  status?: String_comparison_exp | null
  title?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by var_pop() on columns of table "member"
 */
export interface member_var_pop_order_by {
  star?: order_by | null
}

/**
 * order by var_samp() on columns of table "member"
 */
export interface member_var_samp_order_by {
  star?: order_by | null
}

/**
 * order by variance() on columns of table "member"
 */
export interface member_variance_order_by {
  star?: order_by | null
}

/**
 * order by aggregate values of table "merchandise"
 */
export interface merchandise_aggregate_order_by {
  avg?: merchandise_avg_order_by | null
  count?: order_by | null
  max?: merchandise_max_order_by | null
  min?: merchandise_min_order_by | null
  stddev?: merchandise_stddev_order_by | null
  stddev_pop?: merchandise_stddev_pop_order_by | null
  stddev_samp?: merchandise_stddev_samp_order_by | null
  sum?: merchandise_sum_order_by | null
  var_pop?: merchandise_var_pop_order_by | null
  var_samp?: merchandise_var_samp_order_by | null
  variance?: merchandise_variance_order_by | null
}

/**
 * order by avg() on columns of table "merchandise"
 */
export interface merchandise_avg_order_by {
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "merchandise". All fields are combined with a logical 'AND'.
 */
export interface merchandise_bool_exp {
  _and?: (merchandise_bool_exp | null)[] | null
  _not?: merchandise_bool_exp | null
  _or?: (merchandise_bool_exp | null)[] | null
  abstract?: String_comparison_exp | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  ended_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_countdown_timer_visible?: Boolean_comparison_exp | null
  is_customized?: Boolean_comparison_exp | null
  is_deleted?: Boolean_comparison_exp | null
  is_limited?: Boolean_comparison_exp | null
  is_physical?: Boolean_comparison_exp | null
  link?: String_comparison_exp | null
  list_price?: numeric_comparison_exp | null
  member?: member_public_bool_exp | null
  member_id?: String_comparison_exp | null
  member_shop?: member_shop_bool_exp | null
  member_shop_id?: uuid_comparison_exp | null
  merchandise_categories?: merchandise_category_bool_exp | null
  merchandise_files?: merchandise_file_bool_exp | null
  merchandise_imgs?: merchandise_img_bool_exp | null
  merchandise_inventory_status?: merchandise_inventory_status_bool_exp | null
  merchandise_specs?: merchandise_spec_bool_exp | null
  merchandise_tags?: merchandise_tag_bool_exp | null
  meta?: String_comparison_exp | null
  position?: Int_comparison_exp | null
  post_merchandises?: post_merchandise_bool_exp | null
  published_at?: timestamptz_comparison_exp | null
  sale_price?: numeric_comparison_exp | null
  sold_at?: timestamptz_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
  title?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "merchandise_category". All fields are combined with a logical 'AND'.
 */
export interface merchandise_category_bool_exp {
  _and?: (merchandise_category_bool_exp | null)[] | null
  _not?: merchandise_category_bool_exp | null
  _or?: (merchandise_category_bool_exp | null)[] | null
  category?: category_bool_exp | null
  category_id?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  merchandise?: merchandise_bool_exp | null
  merchandise_id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "merchandise_file". All fields are combined with a logical 'AND'.
 */
export interface merchandise_file_bool_exp {
  _and?: (merchandise_file_bool_exp | null)[] | null
  _not?: merchandise_file_bool_exp | null
  _or?: (merchandise_file_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  data?: jsonb_comparison_exp | null
  id?: uuid_comparison_exp | null
  merchandise?: merchandise_bool_exp | null
  merchandise_id?: uuid_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "merchandise_img". All fields are combined with a logical 'AND'.
 */
export interface merchandise_img_bool_exp {
  _and?: (merchandise_img_bool_exp | null)[] | null
  _not?: merchandise_img_bool_exp | null
  _or?: (merchandise_img_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  merchandise?: merchandise_bool_exp | null
  merchandise_id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  type?: String_comparison_exp | null
  url?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "merchandise_inventory_status". All fields are combined with a logical 'AND'.
 */
export interface merchandise_inventory_status_bool_exp {
  _and?: (merchandise_inventory_status_bool_exp | null)[] | null
  _not?: merchandise_inventory_status_bool_exp | null
  _or?: (merchandise_inventory_status_bool_exp | null)[] | null
  buyable_quantity?: bigint_comparison_exp | null
  delivered_quantity?: bigint_comparison_exp | null
  merchandise?: merchandise_bool_exp | null
  merchandise_id?: uuid_comparison_exp | null
  total_quantity?: bigint_comparison_exp | null
  undelivered_quantity?: bigint_comparison_exp | null
}

/**
 * order by max() on columns of table "merchandise"
 */
export interface merchandise_max_order_by {
  abstract?: order_by | null
  app_id?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  ended_at?: order_by | null
  id?: order_by | null
  link?: order_by | null
  list_price?: order_by | null
  member_id?: order_by | null
  member_shop_id?: order_by | null
  meta?: order_by | null
  position?: order_by | null
  published_at?: order_by | null
  sale_price?: order_by | null
  sold_at?: order_by | null
  started_at?: order_by | null
  title?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "merchandise"
 */
export interface merchandise_min_order_by {
  abstract?: order_by | null
  app_id?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  ended_at?: order_by | null
  id?: order_by | null
  link?: order_by | null
  list_price?: order_by | null
  member_id?: order_by | null
  member_shop_id?: order_by | null
  meta?: order_by | null
  position?: order_by | null
  published_at?: order_by | null
  sale_price?: order_by | null
  sold_at?: order_by | null
  started_at?: order_by | null
  title?: order_by | null
  updated_at?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "merchandise_spec". All fields are combined with a logical 'AND'.
 */
export interface merchandise_spec_bool_exp {
  _and?: (merchandise_spec_bool_exp | null)[] | null
  _not?: merchandise_spec_bool_exp | null
  _or?: (merchandise_spec_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_deleted?: Boolean_comparison_exp | null
  list_price?: numeric_comparison_exp | null
  merchandise?: merchandise_bool_exp | null
  merchandise_id?: uuid_comparison_exp | null
  merchandise_spec_files?: merchandise_spec_file_bool_exp | null
  merchandise_spec_inventory_status?: merchandise_spec_inventory_status_bool_exp | null
  quota?: Int_comparison_exp | null
  sale_price?: numeric_comparison_exp | null
  title?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "merchandise_spec_file". All fields are combined with a logical 'AND'.
 */
export interface merchandise_spec_file_bool_exp {
  _and?: (merchandise_spec_file_bool_exp | null)[] | null
  _not?: merchandise_spec_file_bool_exp | null
  _or?: (merchandise_spec_file_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  data?: jsonb_comparison_exp | null
  id?: uuid_comparison_exp | null
  merchandise_spec?: merchandise_spec_bool_exp | null
  merchandise_spec_id?: uuid_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "merchandise_spec_inventory_status". All fields are combined with a logical 'AND'.
 */
export interface merchandise_spec_inventory_status_bool_exp {
  _and?: (merchandise_spec_inventory_status_bool_exp | null)[] | null
  _not?: merchandise_spec_inventory_status_bool_exp | null
  _or?: (merchandise_spec_inventory_status_bool_exp | null)[] | null
  buyable_quantity?: bigint_comparison_exp | null
  delivered_quantity?: bigint_comparison_exp | null
  merchandise_spec?: merchandise_spec_bool_exp | null
  merchandise_spec_id?: uuid_comparison_exp | null
  total_quantity?: bigint_comparison_exp | null
  undelivered_quantity?: bigint_comparison_exp | null
  unpaid_quantity?: bigint_comparison_exp | null
}

/**
 * order by stddev() on columns of table "merchandise"
 */
export interface merchandise_stddev_order_by {
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "merchandise"
 */
export interface merchandise_stddev_pop_order_by {
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "merchandise"
 */
export interface merchandise_stddev_samp_order_by {
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by sum() on columns of table "merchandise"
 */
export interface merchandise_sum_order_by {
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "merchandise_tag". All fields are combined with a logical 'AND'.
 */
export interface merchandise_tag_bool_exp {
  _and?: (merchandise_tag_bool_exp | null)[] | null
  _not?: merchandise_tag_bool_exp | null
  _or?: (merchandise_tag_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  merchandise?: merchandise_bool_exp | null
  merchandise_id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  tag?: tag_bool_exp | null
  tag_name?: String_comparison_exp | null
}

/**
 * order by var_pop() on columns of table "merchandise"
 */
export interface merchandise_var_pop_order_by {
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by var_samp() on columns of table "merchandise"
 */
export interface merchandise_var_samp_order_by {
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by variance() on columns of table "merchandise"
 */
export interface merchandise_variance_order_by {
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "module". All fields are combined with a logical 'AND'.
 */
export interface module_bool_exp {
  _and?: (module_bool_exp | null)[] | null
  _not?: module_bool_exp | null
  _or?: (module_bool_exp | null)[] | null
  abstract?: String_comparison_exp | null
  app_modules?: app_module_bool_exp | null
  category_name?: String_comparison_exp | null
  id?: String_comparison_exp | null
  name?: String_comparison_exp | null
  settings?: setting_bool_exp | null
}

/**
 * Boolean expression to filter rows from the table "notification". All fields are combined with a logical 'AND'.
 */
export interface notification_bool_exp {
  _and?: (notification_bool_exp | null)[] | null
  _not?: notification_bool_exp | null
  _or?: (notification_bool_exp | null)[] | null
  avatar?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  extra?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  read_at?: timestamptz_comparison_exp | null
  reference_url?: String_comparison_exp | null
  sourceMember?: member_bool_exp | null
  source_member_id?: String_comparison_exp | null
  targetMember?: member_bool_exp | null
  target_member_id?: String_comparison_exp | null
  type?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * expression to compare columns of type numeric. All fields are combined with logical 'AND'.
 */
export interface numeric_comparison_exp {
  _eq?: any | null
  _gt?: any | null
  _gte?: any | null
  _in?: any[] | null
  _is_null?: boolean | null
  _lt?: any | null
  _lte?: any | null
  _neq?: any | null
  _nin?: any[] | null
}

/**
 * Boolean expression to filter rows from the table "order_contact". All fields are combined with a logical 'AND'.
 */
export interface order_contact_bool_exp {
  _and?: (order_contact_bool_exp | null)[] | null
  _not?: order_contact_bool_exp | null
  _or?: (order_contact_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_public_bool_exp | null
  member_id?: String_comparison_exp | null
  message?: String_comparison_exp | null
  order_id?: String_comparison_exp | null
  order_log?: order_log_bool_exp | null
  read_at?: timestamptz_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "order_discount". All fields are combined with a logical 'AND'.
 */
export interface order_discount_bool_exp {
  _and?: (order_discount_bool_exp | null)[] | null
  _not?: order_discount_bool_exp | null
  _or?: (order_discount_bool_exp | null)[] | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  name?: String_comparison_exp | null
  options?: jsonb_comparison_exp | null
  order_id?: String_comparison_exp | null
  order_log?: order_log_bool_exp | null
  price?: numeric_comparison_exp | null
  target?: String_comparison_exp | null
  type?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "order_executor". All fields are combined with a logical 'AND'.
 */
export interface order_executor_bool_exp {
  _and?: (order_executor_bool_exp | null)[] | null
  _not?: order_executor_bool_exp | null
  _or?: (order_executor_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  order_id?: String_comparison_exp | null
  order_log?: order_log_bool_exp | null
  ratio?: numeric_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "order_log". All fields are combined with a logical 'AND'.
 */
export interface order_log_bool_exp {
  _and?: (order_log_bool_exp | null)[] | null
  _not?: order_log_bool_exp | null
  _or?: (order_log_bool_exp | null)[] | null
  auto_renewed_at?: timestamptz_comparison_exp | null
  coupon?: coupon_bool_exp | null
  created_at?: timestamptz_comparison_exp | null
  custom_id?: String_comparison_exp | null
  deliver_message?: String_comparison_exp | null
  delivered_at?: timestamptz_comparison_exp | null
  discount_coupon_id?: uuid_comparison_exp | null
  discount_point?: numeric_comparison_exp | null
  discount_price?: numeric_comparison_exp | null
  discount_type?: Int_comparison_exp | null
  expired_at?: timestamptz_comparison_exp | null
  id?: String_comparison_exp | null
  invoice?: jsonb_comparison_exp | null
  is_deleted?: Boolean_comparison_exp | null
  last_paid_at?: timestamptz_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  message?: String_comparison_exp | null
  options?: jsonb_comparison_exp | null
  order_contacts?: order_contact_bool_exp | null
  order_discounts?: order_discount_bool_exp | null
  order_executors?: order_executor_bool_exp | null
  order_products?: order_product_bool_exp | null
  parent_order_id?: String_comparison_exp | null
  parent_order_log?: order_log_bool_exp | null
  payment_logs?: payment_log_bool_exp | null
  payment_model?: jsonb_comparison_exp | null
  retried_at?: timestamptz_comparison_exp | null
  shipping?: jsonb_comparison_exp | null
  status?: String_comparison_exp | null
  sub_order_logs?: order_log_bool_exp | null
  transferred_at?: timestamptz_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "order_payment_status". All fields are combined with a logical 'AND'.
 */
export interface order_payment_status_bool_exp {
  _and?: (order_payment_status_bool_exp | null)[] | null
  _not?: order_payment_status_bool_exp | null
  _or?: (order_payment_status_bool_exp | null)[] | null
  last_paid_at?: timestamptz_comparison_exp | null
  member_id?: String_comparison_exp | null
  order_id?: String_comparison_exp | null
  order_log?: order_log_bool_exp | null
  status?: String_comparison_exp | null
}

/**
 * order by aggregate values of table "order_product"
 */
export interface order_product_aggregate_order_by {
  avg?: order_product_avg_order_by | null
  count?: order_by | null
  max?: order_product_max_order_by | null
  min?: order_product_min_order_by | null
  stddev?: order_product_stddev_order_by | null
  stddev_pop?: order_product_stddev_pop_order_by | null
  stddev_samp?: order_product_stddev_samp_order_by | null
  sum?: order_product_sum_order_by | null
  var_pop?: order_product_var_pop_order_by | null
  var_samp?: order_product_var_samp_order_by | null
  variance?: order_product_variance_order_by | null
}

/**
 * order by avg() on columns of table "order_product"
 */
export interface order_product_avg_order_by {
  accumulated_errors?: order_by | null
  price?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "order_product". All fields are combined with a logical 'AND'.
 */
export interface order_product_bool_exp {
  _and?: (order_product_bool_exp | null)[] | null
  _not?: order_product_bool_exp | null
  _or?: (order_product_bool_exp | null)[] | null
  accumulated_errors?: Int_comparison_exp | null
  activity_attendances?: activity_attendance_bool_exp | null
  auto_renewed?: Boolean_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  currency?: currency_bool_exp | null
  currency_id?: String_comparison_exp | null
  deliverables?: jsonb_comparison_exp | null
  description?: String_comparison_exp | null
  ended_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  name?: String_comparison_exp | null
  options?: jsonb_comparison_exp | null
  order_id?: String_comparison_exp | null
  order_log?: order_log_bool_exp | null
  order_product_files?: order_product_file_bool_exp | null
  price?: numeric_comparison_exp | null
  product?: product_bool_exp | null
  product_id?: String_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "order_product_file". All fields are combined with a logical 'AND'.
 */
export interface order_product_file_bool_exp {
  _and?: (order_product_file_bool_exp | null)[] | null
  _not?: order_product_file_bool_exp | null
  _or?: (order_product_file_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  data?: jsonb_comparison_exp | null
  id?: uuid_comparison_exp | null
  order_product?: order_product_bool_exp | null
  order_product_id?: uuid_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by max() on columns of table "order_product"
 */
export interface order_product_max_order_by {
  accumulated_errors?: order_by | null
  created_at?: order_by | null
  currency_id?: order_by | null
  description?: order_by | null
  ended_at?: order_by | null
  id?: order_by | null
  name?: order_by | null
  order_id?: order_by | null
  price?: order_by | null
  product_id?: order_by | null
  started_at?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "order_product"
 */
export interface order_product_min_order_by {
  accumulated_errors?: order_by | null
  created_at?: order_by | null
  currency_id?: order_by | null
  description?: order_by | null
  ended_at?: order_by | null
  id?: order_by | null
  name?: order_by | null
  order_id?: order_by | null
  price?: order_by | null
  product_id?: order_by | null
  started_at?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by stddev() on columns of table "order_product"
 */
export interface order_product_stddev_order_by {
  accumulated_errors?: order_by | null
  price?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "order_product"
 */
export interface order_product_stddev_pop_order_by {
  accumulated_errors?: order_by | null
  price?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "order_product"
 */
export interface order_product_stddev_samp_order_by {
  accumulated_errors?: order_by | null
  price?: order_by | null
}

/**
 * order by sum() on columns of table "order_product"
 */
export interface order_product_sum_order_by {
  accumulated_errors?: order_by | null
  price?: order_by | null
}

/**
 * order by var_pop() on columns of table "order_product"
 */
export interface order_product_var_pop_order_by {
  accumulated_errors?: order_by | null
  price?: order_by | null
}

/**
 * order by var_samp() on columns of table "order_product"
 */
export interface order_product_var_samp_order_by {
  accumulated_errors?: order_by | null
  price?: order_by | null
}

/**
 * order by variance() on columns of table "order_product"
 */
export interface order_product_variance_order_by {
  accumulated_errors?: order_by | null
  price?: order_by | null
}

/**
 * order by aggregate values of table "package"
 */
export interface package_aggregate_order_by {
  count?: order_by | null
  max?: package_max_order_by | null
  min?: package_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "package". All fields are combined with a logical 'AND'.
 */
export interface package_bool_exp {
  _and?: (package_bool_exp | null)[] | null
  _not?: package_bool_exp | null
  _or?: (package_bool_exp | null)[] | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  elements?: jsonb_comparison_exp | null
  id?: uuid_comparison_exp | null
  package_sections?: package_section_bool_exp | null
  title?: String_comparison_exp | null
}

/**
 * order by aggregate values of table "package_item"
 */
export interface package_item_aggregate_order_by {
  count?: order_by | null
  max?: package_item_max_order_by | null
  min?: package_item_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "package_item". All fields are combined with a logical 'AND'.
 */
export interface package_item_bool_exp {
  _and?: (package_item_bool_exp | null)[] | null
  _not?: package_item_bool_exp | null
  _or?: (package_item_bool_exp | null)[] | null
  activity?: activity_bool_exp | null
  activity_id?: uuid_comparison_exp | null
  id?: uuid_comparison_exp | null
  merchandise_id?: uuid_comparison_exp | null
  package_item_group?: package_item_group_bool_exp | null
  package_item_group_id?: uuid_comparison_exp | null
  program?: program_bool_exp | null
  program_id?: uuid_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "package_item_group". All fields are combined with a logical 'AND'.
 */
export interface package_item_group_bool_exp {
  _and?: (package_item_group_bool_exp | null)[] | null
  _not?: package_item_group_bool_exp | null
  _or?: (package_item_group_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  package_items?: package_item_bool_exp | null
  package_section?: package_section_bool_exp | null
  package_section_id?: uuid_comparison_exp | null
  subtitle?: String_comparison_exp | null
  title?: String_comparison_exp | null
  type?: String_comparison_exp | null
  with_filter?: Boolean_comparison_exp | null
}

/**
 * order by max() on columns of table "package_item"
 */
export interface package_item_max_order_by {
  activity_id?: order_by | null
  id?: order_by | null
  merchandise_id?: order_by | null
  package_item_group_id?: order_by | null
  program_id?: order_by | null
}

/**
 * order by min() on columns of table "package_item"
 */
export interface package_item_min_order_by {
  activity_id?: order_by | null
  id?: order_by | null
  merchandise_id?: order_by | null
  package_item_group_id?: order_by | null
  program_id?: order_by | null
}

/**
 * order by max() on columns of table "package"
 */
export interface package_max_order_by {
  app_id?: order_by | null
  id?: order_by | null
  title?: order_by | null
}

/**
 * order by min() on columns of table "package"
 */
export interface package_min_order_by {
  app_id?: order_by | null
  id?: order_by | null
  title?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "package_section". All fields are combined with a logical 'AND'.
 */
export interface package_section_bool_exp {
  _and?: (package_section_bool_exp | null)[] | null
  _not?: package_section_bool_exp | null
  _or?: (package_section_bool_exp | null)[] | null
  block?: Boolean_comparison_exp | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  package?: package_bool_exp | null
  package_id?: uuid_comparison_exp | null
  package_item_groups?: package_item_group_bool_exp | null
  position?: Int_comparison_exp | null
  subtitle?: String_comparison_exp | null
  title?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "payment_log". All fields are combined with a logical 'AND'.
 */
export interface payment_log_bool_exp {
  _and?: (payment_log_bool_exp | null)[] | null
  _not?: payment_log_bool_exp | null
  _or?: (payment_log_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  custom_no?: String_comparison_exp | null
  gateway?: String_comparison_exp | null
  method?: String_comparison_exp | null
  no?: numeric_comparison_exp | null
  options?: jsonb_comparison_exp | null
  order_id?: String_comparison_exp | null
  order_log?: order_log_bool_exp | null
  order_payment_status?: order_payment_status_bool_exp | null
  paid_at?: timestamptz_comparison_exp | null
  payment_due_at?: timestamptz_comparison_exp | null
  price?: numeric_comparison_exp | null
  status?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "permission". All fields are combined with a logical 'AND'.
 */
export interface permission_bool_exp {
  _and?: (permission_bool_exp | null)[] | null
  _not?: permission_bool_exp | null
  _or?: (permission_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  group?: String_comparison_exp | null
  id?: String_comparison_exp | null
  member_permission_extras?: member_permission_extra_bool_exp | null
  role_permissions?: role_permission_bool_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "permission_group". All fields are combined with a logical 'AND'.
 */
export interface permission_group_bool_exp {
  _and?: (permission_group_bool_exp | null)[] | null
  _not?: permission_group_bool_exp | null
  _or?: (permission_group_bool_exp | null)[] | null
  app_id?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  name?: String_comparison_exp | null
  permission_group_permissions?: permission_group_permission_bool_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "permission_group_permission". All fields are combined with a logical 'AND'.
 */
export interface permission_group_permission_bool_exp {
  _and?: (permission_group_permission_bool_exp | null)[] | null
  _not?: permission_group_permission_bool_exp | null
  _or?: (permission_group_permission_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  permission?: permission_bool_exp | null
  permission_group?: permission_group_bool_exp | null
  permission_group_id?: uuid_comparison_exp | null
  permission_id?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "playlist". All fields are combined with a logical 'AND'.
 */
export interface playlist_bool_exp {
  _and?: (playlist_bool_exp | null)[] | null
  _not?: playlist_bool_exp | null
  _or?: (playlist_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  playlist_podcast_programs?: playlist_podcast_program_bool_exp | null
  position?: Int_comparison_exp | null
  title?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "playlist_podcast_program". All fields are combined with a logical 'AND'.
 */
export interface playlist_podcast_program_bool_exp {
  _and?: (playlist_podcast_program_bool_exp | null)[] | null
  _not?: playlist_podcast_program_bool_exp | null
  _or?: (playlist_podcast_program_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  playlist?: playlist_bool_exp | null
  playlist_id?: uuid_comparison_exp | null
  podcast_program?: podcast_program_bool_exp | null
  podcast_program_id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by aggregate values of table "podcast"
 */
export interface podcast_aggregate_order_by {
  count?: order_by | null
  max?: podcast_max_order_by | null
  min?: podcast_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "podcast". All fields are combined with a logical 'AND'.
 */
export interface podcast_bool_exp {
  _and?: (podcast_bool_exp | null)[] | null
  _not?: podcast_bool_exp | null
  _or?: (podcast_bool_exp | null)[] | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  instructor_id?: String_comparison_exp | null
  member?: member_bool_exp | null
  podcast_plans?: podcast_plan_bool_exp | null
  podcast_programs?: podcast_program_bool_exp | null
}

/**
 * order by max() on columns of table "podcast"
 */
export interface podcast_max_order_by {
  app_id?: order_by | null
  id?: order_by | null
  instructor_id?: order_by | null
}

/**
 * order by min() on columns of table "podcast"
 */
export interface podcast_min_order_by {
  app_id?: order_by | null
  id?: order_by | null
  instructor_id?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "podcast_plan". All fields are combined with a logical 'AND'.
 */
export interface podcast_plan_bool_exp {
  _and?: (podcast_plan_bool_exp | null)[] | null
  _not?: podcast_plan_bool_exp | null
  _or?: (podcast_plan_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  creator?: member_public_bool_exp | null
  creator_id?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_subscription?: Boolean_comparison_exp | null
  list_price?: numeric_comparison_exp | null
  period_amount?: numeric_comparison_exp | null
  period_type?: String_comparison_exp | null
  podcast?: podcast_bool_exp | null
  podcast_id?: uuid_comparison_exp | null
  podcast_plan_enrollments?: podcast_plan_enrollment_bool_exp | null
  position?: Int_comparison_exp | null
  published_at?: timestamptz_comparison_exp | null
  sale_price?: numeric_comparison_exp | null
  sold_at?: timestamptz_comparison_exp | null
  title?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "podcast_plan_enrollment". All fields are combined with a logical 'AND'.
 */
export interface podcast_plan_enrollment_bool_exp {
  _and?: (podcast_plan_enrollment_bool_exp | null)[] | null
  _not?: podcast_plan_enrollment_bool_exp | null
  _or?: (podcast_plan_enrollment_bool_exp | null)[] | null
  member_id?: String_comparison_exp | null
  podcast_plan?: podcast_plan_bool_exp | null
  podcast_plan_id?: uuid_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "podcast_program_audio". All fields are combined with a logical 'AND'.
 */
export interface podcast_program_audio_bool_exp {
  _and?: (podcast_program_audio_bool_exp | null)[] | null
  _not?: podcast_program_audio_bool_exp | null
  _or?: (podcast_program_audio_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  data?: jsonb_comparison_exp | null
  deleted_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  podcast_program?: podcast_program_bool_exp | null
  podcast_program_id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "podcast_program_body". All fields are combined with a logical 'AND'.
 */
export interface podcast_program_body_bool_exp {
  _and?: (podcast_program_body_bool_exp | null)[] | null
  _not?: podcast_program_body_bool_exp | null
  _or?: (podcast_program_body_bool_exp | null)[] | null
  data?: jsonb_comparison_exp | null
  deleted_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  podcast_program?: podcast_program_bool_exp | null
  podcast_program_id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "podcast_program". All fields are combined with a logical 'AND'.
 */
export interface podcast_program_bool_exp {
  _and?: (podcast_program_bool_exp | null)[] | null
  _not?: podcast_program_bool_exp | null
  _or?: (podcast_program_bool_exp | null)[] | null
  abstract?: String_comparison_exp | null
  content_type?: String_comparison_exp | null
  cover_url?: String_comparison_exp | null
  creator?: member_public_bool_exp | null
  creator_id?: String_comparison_exp | null
  duration?: numeric_comparison_exp | null
  duration_second?: numeric_comparison_exp | null
  filename?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  list_price?: numeric_comparison_exp | null
  playlist_podcast_programs?: playlist_podcast_program_bool_exp | null
  podcast?: podcast_bool_exp | null
  podcast_id?: uuid_comparison_exp | null
  podcast_program_audios?: podcast_program_audio_bool_exp | null
  podcast_program_bodies?: podcast_program_body_bool_exp | null
  podcast_program_body?: podcast_program_body_bool_exp | null
  podcast_program_categories?: podcast_program_category_bool_exp | null
  podcast_program_enrollments?: podcast_program_enrollment_bool_exp | null
  podcast_program_roles?: podcast_program_role_bool_exp | null
  podcast_program_tags?: podcast_program_tag_bool_exp | null
  published_at?: timestamptz_comparison_exp | null
  sale_price?: numeric_comparison_exp | null
  sold_at?: timestamptz_comparison_exp | null
  support_locales?: jsonb_comparison_exp | null
  title?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "podcast_program_category". All fields are combined with a logical 'AND'.
 */
export interface podcast_program_category_bool_exp {
  _and?: (podcast_program_category_bool_exp | null)[] | null
  _not?: podcast_program_category_bool_exp | null
  _or?: (podcast_program_category_bool_exp | null)[] | null
  category?: category_bool_exp | null
  category_id?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  podcast_program?: podcast_program_bool_exp | null
  podcast_program_id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "podcast_program_enrollment". All fields are combined with a logical 'AND'.
 */
export interface podcast_program_enrollment_bool_exp {
  _and?: (podcast_program_enrollment_bool_exp | null)[] | null
  _not?: podcast_program_enrollment_bool_exp | null
  _or?: (podcast_program_enrollment_bool_exp | null)[] | null
  member_id?: String_comparison_exp | null
  podcast_program?: podcast_program_bool_exp | null
  podcast_program_id?: uuid_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "podcast_program_role". All fields are combined with a logical 'AND'.
 */
export interface podcast_program_role_bool_exp {
  _and?: (podcast_program_role_bool_exp | null)[] | null
  _not?: podcast_program_role_bool_exp | null
  _or?: (podcast_program_role_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  member?: member_public_bool_exp | null
  member_id?: String_comparison_exp | null
  name?: String_comparison_exp | null
  podcast_program?: podcast_program_bool_exp | null
  podcast_program_id?: uuid_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "podcast_program_tag". All fields are combined with a logical 'AND'.
 */
export interface podcast_program_tag_bool_exp {
  _and?: (podcast_program_tag_bool_exp | null)[] | null
  _not?: podcast_program_tag_bool_exp | null
  _or?: (podcast_program_tag_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  podcast_program?: podcast_program_bool_exp | null
  podcast_program_id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  tag?: tag_bool_exp | null
  tag_name?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "point_log". All fields are combined with a logical 'AND'.
 */
export interface point_log_bool_exp {
  _and?: (point_log_bool_exp | null)[] | null
  _not?: point_log_bool_exp | null
  _or?: (point_log_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  ended_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  note?: String_comparison_exp | null
  point?: numeric_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "point_status". All fields are combined with a logical 'AND'.
 */
export interface point_status_bool_exp {
  _and?: (point_status_bool_exp | null)[] | null
  _not?: point_status_bool_exp | null
  _or?: (point_status_bool_exp | null)[] | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  points?: numeric_comparison_exp | null
}

/**
 * order by aggregate values of table "post"
 */
export interface post_aggregate_order_by {
  avg?: post_avg_order_by | null
  count?: order_by | null
  max?: post_max_order_by | null
  min?: post_min_order_by | null
  stddev?: post_stddev_order_by | null
  stddev_pop?: post_stddev_pop_order_by | null
  stddev_samp?: post_stddev_samp_order_by | null
  sum?: post_sum_order_by | null
  var_pop?: post_var_pop_order_by | null
  var_samp?: post_var_samp_order_by | null
  variance?: post_variance_order_by | null
}

/**
 * order by avg() on columns of table "post"
 */
export interface post_avg_order_by {
  position?: order_by | null
  views?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "post". All fields are combined with a logical 'AND'.
 */
export interface post_bool_exp {
  _and?: (post_bool_exp | null)[] | null
  _not?: post_bool_exp | null
  _or?: (post_bool_exp | null)[] | null
  abstract?: String_comparison_exp | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  code_name?: String_comparison_exp | null
  cover_url?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_deleted?: Boolean_comparison_exp | null
  position?: Int_comparison_exp | null
  post_categories?: post_category_bool_exp | null
  post_merchandises?: post_merchandise_bool_exp | null
  post_roles?: post_role_bool_exp | null
  post_tags?: post_tag_bool_exp | null
  published_at?: timestamptz_comparison_exp | null
  title?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
  video_url?: String_comparison_exp | null
  views?: Int_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "post_category". All fields are combined with a logical 'AND'.
 */
export interface post_category_bool_exp {
  _and?: (post_category_bool_exp | null)[] | null
  _not?: post_category_bool_exp | null
  _or?: (post_category_bool_exp | null)[] | null
  category?: category_bool_exp | null
  category_id?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  post?: post_bool_exp | null
  post_id?: uuid_comparison_exp | null
}

/**
 * order by max() on columns of table "post"
 */
export interface post_max_order_by {
  abstract?: order_by | null
  app_id?: order_by | null
  code_name?: order_by | null
  cover_url?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  position?: order_by | null
  published_at?: order_by | null
  title?: order_by | null
  updated_at?: order_by | null
  video_url?: order_by | null
  views?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "post_merchandise". All fields are combined with a logical 'AND'.
 */
export interface post_merchandise_bool_exp {
  _and?: (post_merchandise_bool_exp | null)[] | null
  _not?: post_merchandise_bool_exp | null
  _or?: (post_merchandise_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  merchandise?: merchandise_bool_exp | null
  merchandise_id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  post?: post_bool_exp | null
  post_id?: uuid_comparison_exp | null
}

/**
 * order by min() on columns of table "post"
 */
export interface post_min_order_by {
  abstract?: order_by | null
  app_id?: order_by | null
  code_name?: order_by | null
  cover_url?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  position?: order_by | null
  published_at?: order_by | null
  title?: order_by | null
  updated_at?: order_by | null
  video_url?: order_by | null
  views?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "post_role". All fields are combined with a logical 'AND'.
 */
export interface post_role_bool_exp {
  _and?: (post_role_bool_exp | null)[] | null
  _not?: post_role_bool_exp | null
  _or?: (post_role_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  member?: member_public_bool_exp | null
  member_id?: String_comparison_exp | null
  name?: String_comparison_exp | null
  position?: Int_comparison_exp | null
  post?: post_bool_exp | null
  post_id?: uuid_comparison_exp | null
}

/**
 * order by stddev() on columns of table "post"
 */
export interface post_stddev_order_by {
  position?: order_by | null
  views?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "post"
 */
export interface post_stddev_pop_order_by {
  position?: order_by | null
  views?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "post"
 */
export interface post_stddev_samp_order_by {
  position?: order_by | null
  views?: order_by | null
}

/**
 * order by sum() on columns of table "post"
 */
export interface post_sum_order_by {
  position?: order_by | null
  views?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "post_tag". All fields are combined with a logical 'AND'.
 */
export interface post_tag_bool_exp {
  _and?: (post_tag_bool_exp | null)[] | null
  _not?: post_tag_bool_exp | null
  _or?: (post_tag_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  post?: post_bool_exp | null
  post_id?: uuid_comparison_exp | null
  tag?: tag_bool_exp | null
  tag_name?: String_comparison_exp | null
}

/**
 * order by var_pop() on columns of table "post"
 */
export interface post_var_pop_order_by {
  position?: order_by | null
  views?: order_by | null
}

/**
 * order by var_samp() on columns of table "post"
 */
export interface post_var_samp_order_by {
  position?: order_by | null
  views?: order_by | null
}

/**
 * order by variance() on columns of table "post"
 */
export interface post_variance_order_by {
  position?: order_by | null
  views?: order_by | null
}

/**
 * order by aggregate values of table "practice"
 */
export interface practice_aggregate_order_by {
  count?: order_by | null
  max?: practice_max_order_by | null
  min?: practice_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "practice_attachment". All fields are combined with a logical 'AND'.
 */
export interface practice_attachment_bool_exp {
  _and?: (practice_attachment_bool_exp | null)[] | null
  _not?: practice_attachment_bool_exp | null
  _or?: (practice_attachment_bool_exp | null)[] | null
  app_id?: String_comparison_exp | null
  attachment?: attachment_bool_exp | null
  attachment_id?: uuid_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  data?: jsonb_comparison_exp | null
  options?: jsonb_comparison_exp | null
  practice?: practice_bool_exp | null
  practice_id?: uuid_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "practice". All fields are combined with a logical 'AND'.
 */
export interface practice_bool_exp {
  _and?: (practice_bool_exp | null)[] | null
  _not?: practice_bool_exp | null
  _or?: (practice_bool_exp | null)[] | null
  cover_url?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_deleted?: Boolean_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  practice_attachments?: practice_attachment_bool_exp | null
  practice_issues?: practice_issue_bool_exp | null
  practice_reactions?: practice_reaction_bool_exp | null
  program_content?: program_content_bool_exp | null
  program_content_id?: uuid_comparison_exp | null
  reviewed_at?: timestamptz_comparison_exp | null
  title?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "practice_issue". All fields are combined with a logical 'AND'.
 */
export interface practice_issue_bool_exp {
  _and?: (practice_issue_bool_exp | null)[] | null
  _not?: practice_issue_bool_exp | null
  _or?: (practice_issue_bool_exp | null)[] | null
  issue?: issue_bool_exp | null
  issue_id?: uuid_comparison_exp | null
  practice?: practice_bool_exp | null
  practice_id?: uuid_comparison_exp | null
}

/**
 * order by max() on columns of table "practice"
 */
export interface practice_max_order_by {
  cover_url?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  member_id?: order_by | null
  program_content_id?: order_by | null
  reviewed_at?: order_by | null
  title?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "practice"
 */
export interface practice_min_order_by {
  cover_url?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  member_id?: order_by | null
  program_content_id?: order_by | null
  reviewed_at?: order_by | null
  title?: order_by | null
  updated_at?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "practice_reaction". All fields are combined with a logical 'AND'.
 */
export interface practice_reaction_bool_exp {
  _and?: (practice_reaction_bool_exp | null)[] | null
  _not?: practice_reaction_bool_exp | null
  _or?: (practice_reaction_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  practice?: practice_bool_exp | null
  practice_id?: uuid_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "product". All fields are combined with a logical 'AND'.
 */
export interface product_bool_exp {
  _and?: (product_bool_exp | null)[] | null
  _not?: product_bool_exp | null
  _or?: (product_bool_exp | null)[] | null
  card_discounts?: card_discount_bool_exp | null
  cart_products?: cart_product_bool_exp | null
  coupon_plan_products?: coupon_plan_product_bool_exp | null
  id?: String_comparison_exp | null
  order_products?: order_product_bool_exp | null
  product_enrollments?: product_enrollment_bool_exp | null
  product_inventories?: product_inventory_bool_exp | null
  product_inventory_status?: product_inventory_status_bool_exp | null
  product_owner?: product_owner_bool_exp | null
  sku?: String_comparison_exp | null
  target?: String_comparison_exp | null
  type?: String_comparison_exp | null
  voucher_plan_products?: voucher_plan_product_bool_exp | null
}

/**
 * Boolean expression to filter rows from the table "product_enrollment". All fields are combined with a logical 'AND'.
 */
export interface product_enrollment_bool_exp {
  _and?: (product_enrollment_bool_exp | null)[] | null
  _not?: product_enrollment_bool_exp | null
  _or?: (product_enrollment_bool_exp | null)[] | null
  is_physical?: Boolean_comparison_exp | null
  member?: member_public_bool_exp | null
  member_id?: String_comparison_exp | null
  product?: product_bool_exp | null
  product_id?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "product_inventory". All fields are combined with a logical 'AND'.
 */
export interface product_inventory_bool_exp {
  _and?: (product_inventory_bool_exp | null)[] | null
  _not?: product_inventory_bool_exp | null
  _or?: (product_inventory_bool_exp | null)[] | null
  comment?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  product?: product_bool_exp | null
  product_id?: String_comparison_exp | null
  quantity?: Int_comparison_exp | null
  specification?: String_comparison_exp | null
  status?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "product_inventory_status". All fields are combined with a logical 'AND'.
 */
export interface product_inventory_status_bool_exp {
  _and?: (product_inventory_status_bool_exp | null)[] | null
  _not?: product_inventory_status_bool_exp | null
  _or?: (product_inventory_status_bool_exp | null)[] | null
  buyable_quantity?: bigint_comparison_exp | null
  delivered_quantity?: bigint_comparison_exp | null
  product?: product_bool_exp | null
  product_id?: String_comparison_exp | null
  total_quantity?: bigint_comparison_exp | null
  undelivered_quantity?: bigint_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "product_owner". All fields are combined with a logical 'AND'.
 */
export interface product_owner_bool_exp {
  _and?: (product_owner_bool_exp | null)[] | null
  _not?: product_owner_bool_exp | null
  _or?: (product_owner_bool_exp | null)[] | null
  member?: member_public_bool_exp | null
  member_id?: String_comparison_exp | null
  product?: product_bool_exp | null
  product_id?: String_comparison_exp | null
  target?: String_comparison_exp | null
  type?: String_comparison_exp | null
}

/**
 * order by aggregate values of table "program"
 */
export interface program_aggregate_order_by {
  avg?: program_avg_order_by | null
  count?: order_by | null
  max?: program_max_order_by | null
  min?: program_min_order_by | null
  stddev?: program_stddev_order_by | null
  stddev_pop?: program_stddev_pop_order_by | null
  stddev_samp?: program_stddev_samp_order_by | null
  sum?: program_sum_order_by | null
  var_pop?: program_var_pop_order_by | null
  var_samp?: program_var_samp_order_by | null
  variance?: program_variance_order_by | null
}

/**
 * order by aggregate values of table "program_announcement"
 */
export interface program_announcement_aggregate_order_by {
  count?: order_by | null
  max?: program_announcement_max_order_by | null
  min?: program_announcement_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_announcement". All fields are combined with a logical 'AND'.
 */
export interface program_announcement_bool_exp {
  _and?: (program_announcement_bool_exp | null)[] | null
  _not?: program_announcement_bool_exp | null
  _or?: (program_announcement_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  program?: program_bool_exp | null
  program_id?: uuid_comparison_exp | null
  published_at?: timestamptz_comparison_exp | null
  title?: String_comparison_exp | null
}

/**
 * order by max() on columns of table "program_announcement"
 */
export interface program_announcement_max_order_by {
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  program_id?: order_by | null
  published_at?: order_by | null
  title?: order_by | null
}

/**
 * order by min() on columns of table "program_announcement"
 */
export interface program_announcement_min_order_by {
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  program_id?: order_by | null
  published_at?: order_by | null
  title?: order_by | null
}

/**
 * order by aggregate values of table "program_approval"
 */
export interface program_approval_aggregate_order_by {
  count?: order_by | null
  max?: program_approval_max_order_by | null
  min?: program_approval_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_approval". All fields are combined with a logical 'AND'.
 */
export interface program_approval_bool_exp {
  _and?: (program_approval_bool_exp | null)[] | null
  _not?: program_approval_bool_exp | null
  _or?: (program_approval_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  feedback?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  program?: program_bool_exp | null
  program_id?: uuid_comparison_exp | null
  status?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by max() on columns of table "program_approval"
 */
export interface program_approval_max_order_by {
  created_at?: order_by | null
  description?: order_by | null
  feedback?: order_by | null
  id?: order_by | null
  program_id?: order_by | null
  status?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "program_approval"
 */
export interface program_approval_min_order_by {
  created_at?: order_by | null
  description?: order_by | null
  feedback?: order_by | null
  id?: order_by | null
  program_id?: order_by | null
  status?: order_by | null
  updated_at?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_approval_status". All fields are combined with a logical 'AND'.
 */
export interface program_approval_status_bool_exp {
  _and?: (program_approval_status_bool_exp | null)[] | null
  _not?: program_approval_status_bool_exp | null
  _or?: (program_approval_status_bool_exp | null)[] | null
  program?: program_bool_exp | null
  program_id?: uuid_comparison_exp | null
  status?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * ordering options when selecting data from "program_approval_status"
 */
export interface program_approval_status_order_by {
  program?: program_order_by | null
  program_id?: order_by | null
  status?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by avg() on columns of table "program"
 */
export interface program_avg_order_by {
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "program". All fields are combined with a logical 'AND'.
 */
export interface program_bool_exp {
  _and?: (program_bool_exp | null)[] | null
  _not?: program_bool_exp | null
  _or?: (program_bool_exp | null)[] | null
  abstract?: String_comparison_exp | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  cover_url?: String_comparison_exp | null
  cover_video_url?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  editors?: program_editor_bool_exp | null
  id?: uuid_comparison_exp | null
  in_advance?: Boolean_comparison_exp | null
  is_countdown_timer_visible?: Boolean_comparison_exp | null
  is_deleted?: Boolean_comparison_exp | null
  is_introduction_section_visible?: Boolean_comparison_exp | null
  is_issues_open?: Boolean_comparison_exp | null
  is_private?: Boolean_comparison_exp | null
  is_sold_out?: Boolean_comparison_exp | null
  is_subscription?: Boolean_comparison_exp | null
  list_price?: numeric_comparison_exp | null
  package_items?: package_item_bool_exp | null
  position?: Int_comparison_exp | null
  program_announcements?: program_announcement_bool_exp | null
  program_approval_status?: program_approval_status_bool_exp | null
  program_approvals?: program_approval_bool_exp | null
  program_categories?: program_category_bool_exp | null
  program_content_enrollments?: program_content_enrollment_bool_exp | null
  program_content_progress_enrollments?: program_content_progress_enrollment_bool_exp | null
  program_content_sections?: program_content_section_bool_exp | null
  program_enrollments?: program_enrollment_bool_exp | null
  program_package_programs?: program_package_program_bool_exp | null
  program_plans?: program_plan_bool_exp | null
  program_related_items?: program_related_item_bool_exp | null
  program_roles?: program_role_bool_exp | null
  program_tags?: program_tag_bool_exp | null
  published_at?: timestamptz_comparison_exp | null
  sale_price?: numeric_comparison_exp | null
  sold_at?: timestamptz_comparison_exp | null
  support_locales?: jsonb_comparison_exp | null
  title?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by aggregate values of table "program_category"
 */
export interface program_category_aggregate_order_by {
  avg?: program_category_avg_order_by | null
  count?: order_by | null
  max?: program_category_max_order_by | null
  min?: program_category_min_order_by | null
  stddev?: program_category_stddev_order_by | null
  stddev_pop?: program_category_stddev_pop_order_by | null
  stddev_samp?: program_category_stddev_samp_order_by | null
  sum?: program_category_sum_order_by | null
  var_pop?: program_category_var_pop_order_by | null
  var_samp?: program_category_var_samp_order_by | null
  variance?: program_category_variance_order_by | null
}

/**
 * order by avg() on columns of table "program_category"
 */
export interface program_category_avg_order_by {
  position?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_category". All fields are combined with a logical 'AND'.
 */
export interface program_category_bool_exp {
  _and?: (program_category_bool_exp | null)[] | null
  _not?: program_category_bool_exp | null
  _or?: (program_category_bool_exp | null)[] | null
  category?: category_bool_exp | null
  category_id?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  program?: program_bool_exp | null
  program_id?: uuid_comparison_exp | null
}

/**
 * order by max() on columns of table "program_category"
 */
export interface program_category_max_order_by {
  category_id?: order_by | null
  id?: order_by | null
  position?: order_by | null
  program_id?: order_by | null
}

/**
 * order by min() on columns of table "program_category"
 */
export interface program_category_min_order_by {
  category_id?: order_by | null
  id?: order_by | null
  position?: order_by | null
  program_id?: order_by | null
}

/**
 * order by stddev() on columns of table "program_category"
 */
export interface program_category_stddev_order_by {
  position?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "program_category"
 */
export interface program_category_stddev_pop_order_by {
  position?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "program_category"
 */
export interface program_category_stddev_samp_order_by {
  position?: order_by | null
}

/**
 * order by sum() on columns of table "program_category"
 */
export interface program_category_sum_order_by {
  position?: order_by | null
}

/**
 * order by var_pop() on columns of table "program_category"
 */
export interface program_category_var_pop_order_by {
  position?: order_by | null
}

/**
 * order by var_samp() on columns of table "program_category"
 */
export interface program_category_var_samp_order_by {
  position?: order_by | null
}

/**
 * order by variance() on columns of table "program_category"
 */
export interface program_category_variance_order_by {
  position?: order_by | null
}

/**
 * order by aggregate values of table "program_content"
 */
export interface program_content_aggregate_order_by {
  avg?: program_content_avg_order_by | null
  count?: order_by | null
  max?: program_content_max_order_by | null
  min?: program_content_min_order_by | null
  stddev?: program_content_stddev_order_by | null
  stddev_pop?: program_content_stddev_pop_order_by | null
  stddev_samp?: program_content_stddev_samp_order_by | null
  sum?: program_content_sum_order_by | null
  var_pop?: program_content_var_pop_order_by | null
  var_samp?: program_content_var_samp_order_by | null
  variance?: program_content_variance_order_by | null
}

/**
 * order by aggregate values of table "program_content_attachment"
 */
export interface program_content_attachment_aggregate_order_by {
  count?: order_by | null
  max?: program_content_attachment_max_order_by | null
  min?: program_content_attachment_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_content_attachment". All fields are combined with a logical 'AND'.
 */
export interface program_content_attachment_bool_exp {
  _and?: (program_content_attachment_bool_exp | null)[] | null
  _not?: program_content_attachment_bool_exp | null
  _or?: (program_content_attachment_bool_exp | null)[] | null
  app_id?: String_comparison_exp | null
  attachment?: attachment_bool_exp | null
  attachment_id?: uuid_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  data?: jsonb_comparison_exp | null
  options?: jsonb_comparison_exp | null
  program_content?: program_content_bool_exp | null
  program_content_id?: uuid_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by max() on columns of table "program_content_attachment"
 */
export interface program_content_attachment_max_order_by {
  app_id?: order_by | null
  attachment_id?: order_by | null
  created_at?: order_by | null
  program_content_id?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "program_content_attachment"
 */
export interface program_content_attachment_min_order_by {
  app_id?: order_by | null
  attachment_id?: order_by | null
  created_at?: order_by | null
  program_content_id?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by avg() on columns of table "program_content"
 */
export interface program_content_avg_order_by {
  duration?: order_by | null
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_content_body". All fields are combined with a logical 'AND'.
 */
export interface program_content_body_bool_exp {
  _and?: (program_content_body_bool_exp | null)[] | null
  _not?: program_content_body_bool_exp | null
  _or?: (program_content_body_bool_exp | null)[] | null
  data?: jsonb_comparison_exp | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  program_contents?: program_content_bool_exp | null
  type?: String_comparison_exp | null
}

/**
 * ordering options when selecting data from "program_content_body"
 */
export interface program_content_body_order_by {
  data?: order_by | null
  description?: order_by | null
  id?: order_by | null
  program_contents_aggregate?: program_content_aggregate_order_by | null
  type?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_content". All fields are combined with a logical 'AND'.
 */
export interface program_content_bool_exp {
  _and?: (program_content_bool_exp | null)[] | null
  _not?: program_content_bool_exp | null
  _or?: (program_content_bool_exp | null)[] | null
  abstract?: String_comparison_exp | null
  content_body_id?: uuid_comparison_exp | null
  content_section_id?: uuid_comparison_exp | null
  content_type?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  duration?: numeric_comparison_exp | null
  enrollments?: program_content_enrollment_bool_exp | null
  exercises?: exercise_bool_exp | null
  id?: uuid_comparison_exp | null
  is_notify_update?: Boolean_comparison_exp | null
  list_price?: numeric_comparison_exp | null
  metadata?: jsonb_comparison_exp | null
  notified_at?: timestamptz_comparison_exp | null
  position?: Int_comparison_exp | null
  practices?: practice_bool_exp | null
  program_content_attachments?: program_content_attachment_bool_exp | null
  program_content_body?: program_content_body_bool_exp | null
  program_content_materials?: program_content_material_bool_exp | null
  program_content_plans?: program_content_plan_bool_exp | null
  program_content_progress?: program_content_progress_bool_exp | null
  program_content_section?: program_content_section_bool_exp | null
  program_content_type?: program_content_type_bool_exp | null
  program_content_videos?: program_content_video_bool_exp | null
  published_at?: timestamptz_comparison_exp | null
  sale_free?: program_content_sale_free_bool_exp | null
  sale_price?: numeric_comparison_exp | null
  sold_at?: timestamptz_comparison_exp | null
  title?: String_comparison_exp | null
}

/**
 * order by aggregate values of table "program_content_enrollment"
 */
export interface program_content_enrollment_aggregate_order_by {
  count?: order_by | null
  max?: program_content_enrollment_max_order_by | null
  min?: program_content_enrollment_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_content_enrollment". All fields are combined with a logical 'AND'.
 */
export interface program_content_enrollment_bool_exp {
  _and?: (program_content_enrollment_bool_exp | null)[] | null
  _not?: program_content_enrollment_bool_exp | null
  _or?: (program_content_enrollment_bool_exp | null)[] | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  program?: program_bool_exp | null
  program_content?: program_content_bool_exp | null
  program_content_id?: uuid_comparison_exp | null
  program_id?: uuid_comparison_exp | null
}

/**
 * order by max() on columns of table "program_content_enrollment"
 */
export interface program_content_enrollment_max_order_by {
  member_id?: order_by | null
  program_content_id?: order_by | null
  program_id?: order_by | null
}

/**
 * order by min() on columns of table "program_content_enrollment"
 */
export interface program_content_enrollment_min_order_by {
  member_id?: order_by | null
  program_content_id?: order_by | null
  program_id?: order_by | null
}

/**
 * order by aggregate values of table "program_content_material"
 */
export interface program_content_material_aggregate_order_by {
  count?: order_by | null
  max?: program_content_material_max_order_by | null
  min?: program_content_material_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_content_material". All fields are combined with a logical 'AND'.
 */
export interface program_content_material_bool_exp {
  _and?: (program_content_material_bool_exp | null)[] | null
  _not?: program_content_material_bool_exp | null
  _or?: (program_content_material_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  data?: jsonb_comparison_exp | null
  id?: uuid_comparison_exp | null
  program_content_id?: uuid_comparison_exp | null
  program_contents?: program_content_bool_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by max() on columns of table "program_content_material"
 */
export interface program_content_material_max_order_by {
  created_at?: order_by | null
  id?: order_by | null
  program_content_id?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "program_content_material"
 */
export interface program_content_material_min_order_by {
  created_at?: order_by | null
  id?: order_by | null
  program_content_id?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by max() on columns of table "program_content"
 */
export interface program_content_max_order_by {
  abstract?: order_by | null
  content_body_id?: order_by | null
  content_section_id?: order_by | null
  content_type?: order_by | null
  created_at?: order_by | null
  duration?: order_by | null
  id?: order_by | null
  list_price?: order_by | null
  notified_at?: order_by | null
  position?: order_by | null
  published_at?: order_by | null
  sale_price?: order_by | null
  sold_at?: order_by | null
  title?: order_by | null
}

/**
 * order by min() on columns of table "program_content"
 */
export interface program_content_min_order_by {
  abstract?: order_by | null
  content_body_id?: order_by | null
  content_section_id?: order_by | null
  content_type?: order_by | null
  created_at?: order_by | null
  duration?: order_by | null
  id?: order_by | null
  list_price?: order_by | null
  notified_at?: order_by | null
  position?: order_by | null
  published_at?: order_by | null
  sale_price?: order_by | null
  sold_at?: order_by | null
  title?: order_by | null
}

/**
 * ordering options when selecting data from "program_content"
 */
export interface program_content_order_by {
  abstract?: order_by | null
  content_body_id?: order_by | null
  content_section_id?: order_by | null
  content_type?: order_by | null
  created_at?: order_by | null
  duration?: order_by | null
  enrollments_aggregate?: program_content_enrollment_aggregate_order_by | null
  exercises_aggregate?: exercise_aggregate_order_by | null
  id?: order_by | null
  is_notify_update?: order_by | null
  list_price?: order_by | null
  metadata?: order_by | null
  notified_at?: order_by | null
  position?: order_by | null
  practices_aggregate?: practice_aggregate_order_by | null
  program_content_attachments_aggregate?: program_content_attachment_aggregate_order_by | null
  program_content_body?: program_content_body_order_by | null
  program_content_materials_aggregate?: program_content_material_aggregate_order_by | null
  program_content_plans_aggregate?: program_content_plan_aggregate_order_by | null
  program_content_progress_aggregate?: program_content_progress_aggregate_order_by | null
  program_content_section?: program_content_section_order_by | null
  program_content_type?: program_content_type_order_by | null
  program_content_videos_aggregate?: program_content_video_aggregate_order_by | null
  published_at?: order_by | null
  sale_free?: program_content_sale_free_order_by | null
  sale_price?: order_by | null
  sold_at?: order_by | null
  title?: order_by | null
}

/**
 * order by aggregate values of table "program_content_plan"
 */
export interface program_content_plan_aggregate_order_by {
  count?: order_by | null
  max?: program_content_plan_max_order_by | null
  min?: program_content_plan_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_content_plan". All fields are combined with a logical 'AND'.
 */
export interface program_content_plan_bool_exp {
  _and?: (program_content_plan_bool_exp | null)[] | null
  _not?: program_content_plan_bool_exp | null
  _or?: (program_content_plan_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  program_content?: program_content_bool_exp | null
  program_content_id?: uuid_comparison_exp | null
  program_plan?: program_plan_bool_exp | null
  program_plan_id?: uuid_comparison_exp | null
}

/**
 * order by max() on columns of table "program_content_plan"
 */
export interface program_content_plan_max_order_by {
  id?: order_by | null
  program_content_id?: order_by | null
  program_plan_id?: order_by | null
}

/**
 * order by min() on columns of table "program_content_plan"
 */
export interface program_content_plan_min_order_by {
  id?: order_by | null
  program_content_id?: order_by | null
  program_plan_id?: order_by | null
}

/**
 * order by aggregate values of table "program_content_progress"
 */
export interface program_content_progress_aggregate_order_by {
  avg?: program_content_progress_avg_order_by | null
  count?: order_by | null
  max?: program_content_progress_max_order_by | null
  min?: program_content_progress_min_order_by | null
  stddev?: program_content_progress_stddev_order_by | null
  stddev_pop?: program_content_progress_stddev_pop_order_by | null
  stddev_samp?: program_content_progress_stddev_samp_order_by | null
  sum?: program_content_progress_sum_order_by | null
  var_pop?: program_content_progress_var_pop_order_by | null
  var_samp?: program_content_progress_var_samp_order_by | null
  variance?: program_content_progress_variance_order_by | null
}

/**
 * order by avg() on columns of table "program_content_progress"
 */
export interface program_content_progress_avg_order_by {
  last_progress?: order_by | null
  progress?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_content_progress". All fields are combined with a logical 'AND'.
 */
export interface program_content_progress_bool_exp {
  _and?: (program_content_progress_bool_exp | null)[] | null
  _not?: program_content_progress_bool_exp | null
  _or?: (program_content_progress_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  last_progress?: numeric_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  program_content?: program_content_bool_exp | null
  program_content_id?: uuid_comparison_exp | null
  progress?: numeric_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by aggregate values of table "program_content_progress_enrollment"
 */
export interface program_content_progress_enrollment_aggregate_order_by {
  avg?: program_content_progress_enrollment_avg_order_by | null
  count?: order_by | null
  max?: program_content_progress_enrollment_max_order_by | null
  min?: program_content_progress_enrollment_min_order_by | null
  stddev?: program_content_progress_enrollment_stddev_order_by | null
  stddev_pop?: program_content_progress_enrollment_stddev_pop_order_by | null
  stddev_samp?: program_content_progress_enrollment_stddev_samp_order_by | null
  sum?: program_content_progress_enrollment_sum_order_by | null
  var_pop?: program_content_progress_enrollment_var_pop_order_by | null
  var_samp?: program_content_progress_enrollment_var_samp_order_by | null
  variance?: program_content_progress_enrollment_variance_order_by | null
}

/**
 * order by avg() on columns of table "program_content_progress_enrollment"
 */
export interface program_content_progress_enrollment_avg_order_by {
  last_progress?: order_by | null
  progress?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_content_progress_enrollment". All fields are combined with a logical 'AND'.
 */
export interface program_content_progress_enrollment_bool_exp {
  _and?: (program_content_progress_enrollment_bool_exp | null)[] | null
  _not?: program_content_progress_enrollment_bool_exp | null
  _or?: (program_content_progress_enrollment_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  last_progress?: numeric_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  program_content_id?: uuid_comparison_exp | null
  program_content_section_id?: uuid_comparison_exp | null
  program_id?: uuid_comparison_exp | null
  progress?: numeric_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by max() on columns of table "program_content_progress_enrollment"
 */
export interface program_content_progress_enrollment_max_order_by {
  created_at?: order_by | null
  id?: order_by | null
  last_progress?: order_by | null
  member_id?: order_by | null
  program_content_id?: order_by | null
  program_content_section_id?: order_by | null
  program_id?: order_by | null
  progress?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "program_content_progress_enrollment"
 */
export interface program_content_progress_enrollment_min_order_by {
  created_at?: order_by | null
  id?: order_by | null
  last_progress?: order_by | null
  member_id?: order_by | null
  program_content_id?: order_by | null
  program_content_section_id?: order_by | null
  program_id?: order_by | null
  progress?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by stddev() on columns of table "program_content_progress_enrollment"
 */
export interface program_content_progress_enrollment_stddev_order_by {
  last_progress?: order_by | null
  progress?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "program_content_progress_enrollment"
 */
export interface program_content_progress_enrollment_stddev_pop_order_by {
  last_progress?: order_by | null
  progress?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "program_content_progress_enrollment"
 */
export interface program_content_progress_enrollment_stddev_samp_order_by {
  last_progress?: order_by | null
  progress?: order_by | null
}

/**
 * order by sum() on columns of table "program_content_progress_enrollment"
 */
export interface program_content_progress_enrollment_sum_order_by {
  last_progress?: order_by | null
  progress?: order_by | null
}

/**
 * order by var_pop() on columns of table "program_content_progress_enrollment"
 */
export interface program_content_progress_enrollment_var_pop_order_by {
  last_progress?: order_by | null
  progress?: order_by | null
}

/**
 * order by var_samp() on columns of table "program_content_progress_enrollment"
 */
export interface program_content_progress_enrollment_var_samp_order_by {
  last_progress?: order_by | null
  progress?: order_by | null
}

/**
 * order by variance() on columns of table "program_content_progress_enrollment"
 */
export interface program_content_progress_enrollment_variance_order_by {
  last_progress?: order_by | null
  progress?: order_by | null
}

/**
 * order by max() on columns of table "program_content_progress"
 */
export interface program_content_progress_max_order_by {
  created_at?: order_by | null
  id?: order_by | null
  last_progress?: order_by | null
  member_id?: order_by | null
  program_content_id?: order_by | null
  progress?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "program_content_progress"
 */
export interface program_content_progress_min_order_by {
  created_at?: order_by | null
  id?: order_by | null
  last_progress?: order_by | null
  member_id?: order_by | null
  program_content_id?: order_by | null
  progress?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by stddev() on columns of table "program_content_progress"
 */
export interface program_content_progress_stddev_order_by {
  last_progress?: order_by | null
  progress?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "program_content_progress"
 */
export interface program_content_progress_stddev_pop_order_by {
  last_progress?: order_by | null
  progress?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "program_content_progress"
 */
export interface program_content_progress_stddev_samp_order_by {
  last_progress?: order_by | null
  progress?: order_by | null
}

/**
 * order by sum() on columns of table "program_content_progress"
 */
export interface program_content_progress_sum_order_by {
  last_progress?: order_by | null
  progress?: order_by | null
}

/**
 * order by var_pop() on columns of table "program_content_progress"
 */
export interface program_content_progress_var_pop_order_by {
  last_progress?: order_by | null
  progress?: order_by | null
}

/**
 * order by var_samp() on columns of table "program_content_progress"
 */
export interface program_content_progress_var_samp_order_by {
  last_progress?: order_by | null
  progress?: order_by | null
}

/**
 * order by variance() on columns of table "program_content_progress"
 */
export interface program_content_progress_variance_order_by {
  last_progress?: order_by | null
  progress?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_content_sale_free". All fields are combined with a logical 'AND'.
 */
export interface program_content_sale_free_bool_exp {
  _and?: (program_content_sale_free_bool_exp | null)[] | null
  _not?: program_content_sale_free_bool_exp | null
  _or?: (program_content_sale_free_bool_exp | null)[] | null
  is_sale_free_by_program?: Boolean_comparison_exp | null
  is_sale_free_by_program_content?: Boolean_comparison_exp | null
  is_sale_free_by_program_plan?: Boolean_comparison_exp | null
  program?: program_bool_exp | null
  program_content?: program_content_bool_exp | null
  program_content_id?: uuid_comparison_exp | null
  program_id?: uuid_comparison_exp | null
  program_plan?: program_plan_bool_exp | null
  program_plan_id?: uuid_comparison_exp | null
}

/**
 * ordering options when selecting data from "program_content_sale_free"
 */
export interface program_content_sale_free_order_by {
  is_sale_free_by_program?: order_by | null
  is_sale_free_by_program_content?: order_by | null
  is_sale_free_by_program_plan?: order_by | null
  program?: program_order_by | null
  program_content?: program_content_order_by | null
  program_content_id?: order_by | null
  program_id?: order_by | null
  program_plan?: program_plan_order_by | null
  program_plan_id?: order_by | null
}

/**
 * order by aggregate values of table "program_content_section"
 */
export interface program_content_section_aggregate_order_by {
  avg?: program_content_section_avg_order_by | null
  count?: order_by | null
  max?: program_content_section_max_order_by | null
  min?: program_content_section_min_order_by | null
  stddev?: program_content_section_stddev_order_by | null
  stddev_pop?: program_content_section_stddev_pop_order_by | null
  stddev_samp?: program_content_section_stddev_samp_order_by | null
  sum?: program_content_section_sum_order_by | null
  var_pop?: program_content_section_var_pop_order_by | null
  var_samp?: program_content_section_var_samp_order_by | null
  variance?: program_content_section_variance_order_by | null
}

/**
 * order by avg() on columns of table "program_content_section"
 */
export interface program_content_section_avg_order_by {
  position?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_content_section". All fields are combined with a logical 'AND'.
 */
export interface program_content_section_bool_exp {
  _and?: (program_content_section_bool_exp | null)[] | null
  _not?: program_content_section_bool_exp | null
  _or?: (program_content_section_bool_exp | null)[] | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  program?: program_bool_exp | null
  program_contents?: program_content_bool_exp | null
  program_id?: uuid_comparison_exp | null
  title?: String_comparison_exp | null
}

/**
 * order by max() on columns of table "program_content_section"
 */
export interface program_content_section_max_order_by {
  description?: order_by | null
  id?: order_by | null
  position?: order_by | null
  program_id?: order_by | null
  title?: order_by | null
}

/**
 * order by min() on columns of table "program_content_section"
 */
export interface program_content_section_min_order_by {
  description?: order_by | null
  id?: order_by | null
  position?: order_by | null
  program_id?: order_by | null
  title?: order_by | null
}

/**
 * ordering options when selecting data from "program_content_section"
 */
export interface program_content_section_order_by {
  description?: order_by | null
  id?: order_by | null
  position?: order_by | null
  program?: program_order_by | null
  program_contents_aggregate?: program_content_aggregate_order_by | null
  program_id?: order_by | null
  title?: order_by | null
}

/**
 * order by stddev() on columns of table "program_content_section"
 */
export interface program_content_section_stddev_order_by {
  position?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "program_content_section"
 */
export interface program_content_section_stddev_pop_order_by {
  position?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "program_content_section"
 */
export interface program_content_section_stddev_samp_order_by {
  position?: order_by | null
}

/**
 * order by sum() on columns of table "program_content_section"
 */
export interface program_content_section_sum_order_by {
  position?: order_by | null
}

/**
 * order by var_pop() on columns of table "program_content_section"
 */
export interface program_content_section_var_pop_order_by {
  position?: order_by | null
}

/**
 * order by var_samp() on columns of table "program_content_section"
 */
export interface program_content_section_var_samp_order_by {
  position?: order_by | null
}

/**
 * order by variance() on columns of table "program_content_section"
 */
export interface program_content_section_variance_order_by {
  position?: order_by | null
}

/**
 * order by stddev() on columns of table "program_content"
 */
export interface program_content_stddev_order_by {
  duration?: order_by | null
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "program_content"
 */
export interface program_content_stddev_pop_order_by {
  duration?: order_by | null
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "program_content"
 */
export interface program_content_stddev_samp_order_by {
  duration?: order_by | null
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by sum() on columns of table "program_content"
 */
export interface program_content_sum_order_by {
  duration?: order_by | null
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_content_type". All fields are combined with a logical 'AND'.
 */
export interface program_content_type_bool_exp {
  _and?: (program_content_type_bool_exp | null)[] | null
  _not?: program_content_type_bool_exp | null
  _or?: (program_content_type_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  program_content?: program_content_bool_exp | null
  type?: String_comparison_exp | null
}

/**
 * ordering options when selecting data from "program_content_type"
 */
export interface program_content_type_order_by {
  id?: order_by | null
  program_content?: program_content_order_by | null
  type?: order_by | null
}

/**
 * order by var_pop() on columns of table "program_content"
 */
export interface program_content_var_pop_order_by {
  duration?: order_by | null
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by var_samp() on columns of table "program_content"
 */
export interface program_content_var_samp_order_by {
  duration?: order_by | null
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by variance() on columns of table "program_content"
 */
export interface program_content_variance_order_by {
  duration?: order_by | null
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by aggregate values of table "program_content_video"
 */
export interface program_content_video_aggregate_order_by {
  count?: order_by | null
  max?: program_content_video_max_order_by | null
  min?: program_content_video_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_content_video". All fields are combined with a logical 'AND'.
 */
export interface program_content_video_bool_exp {
  _and?: (program_content_video_bool_exp | null)[] | null
  _not?: program_content_video_bool_exp | null
  _or?: (program_content_video_bool_exp | null)[] | null
  attachment?: attachment_bool_exp | null
  attachment_id?: uuid_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  program_content?: program_content_bool_exp | null
  program_content_id?: uuid_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by max() on columns of table "program_content_video"
 */
export interface program_content_video_max_order_by {
  attachment_id?: order_by | null
  created_at?: order_by | null
  id?: order_by | null
  program_content_id?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "program_content_video"
 */
export interface program_content_video_min_order_by {
  attachment_id?: order_by | null
  created_at?: order_by | null
  id?: order_by | null
  program_content_id?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by aggregate values of table "program_editor"
 */
export interface program_editor_aggregate_order_by {
  count?: order_by | null
  max?: program_editor_max_order_by | null
  min?: program_editor_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_editor". All fields are combined with a logical 'AND'.
 */
export interface program_editor_bool_exp {
  _and?: (program_editor_bool_exp | null)[] | null
  _not?: program_editor_bool_exp | null
  _or?: (program_editor_bool_exp | null)[] | null
  member_id?: String_comparison_exp | null
  program_id?: uuid_comparison_exp | null
}

/**
 * order by max() on columns of table "program_editor"
 */
export interface program_editor_max_order_by {
  member_id?: order_by | null
  program_id?: order_by | null
}

/**
 * order by min() on columns of table "program_editor"
 */
export interface program_editor_min_order_by {
  member_id?: order_by | null
  program_id?: order_by | null
}

/**
 * order by aggregate values of table "program_enrollment"
 */
export interface program_enrollment_aggregate_order_by {
  count?: order_by | null
  max?: program_enrollment_max_order_by | null
  min?: program_enrollment_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_enrollment". All fields are combined with a logical 'AND'.
 */
export interface program_enrollment_bool_exp {
  _and?: (program_enrollment_bool_exp | null)[] | null
  _not?: program_enrollment_bool_exp | null
  _or?: (program_enrollment_bool_exp | null)[] | null
  member?: member_bool_exp | null
  member_email?: String_comparison_exp | null
  member_id?: String_comparison_exp | null
  member_name?: String_comparison_exp | null
  member_picture_url?: String_comparison_exp | null
  program?: program_bool_exp | null
  program_id?: uuid_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by max() on columns of table "program_enrollment"
 */
export interface program_enrollment_max_order_by {
  member_email?: order_by | null
  member_id?: order_by | null
  member_name?: order_by | null
  member_picture_url?: order_by | null
  program_id?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "program_enrollment"
 */
export interface program_enrollment_min_order_by {
  member_email?: order_by | null
  member_id?: order_by | null
  member_name?: order_by | null
  member_picture_url?: order_by | null
  program_id?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by max() on columns of table "program"
 */
export interface program_max_order_by {
  abstract?: order_by | null
  app_id?: order_by | null
  cover_url?: order_by | null
  cover_video_url?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  list_price?: order_by | null
  position?: order_by | null
  published_at?: order_by | null
  sale_price?: order_by | null
  sold_at?: order_by | null
  title?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "program"
 */
export interface program_min_order_by {
  abstract?: order_by | null
  app_id?: order_by | null
  cover_url?: order_by | null
  cover_video_url?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  id?: order_by | null
  list_price?: order_by | null
  position?: order_by | null
  published_at?: order_by | null
  sale_price?: order_by | null
  sold_at?: order_by | null
  title?: order_by | null
  updated_at?: order_by | null
}

/**
 * ordering options when selecting data from "program"
 */
export interface program_order_by {
  abstract?: order_by | null
  app?: app_order_by | null
  app_id?: order_by | null
  cover_url?: order_by | null
  cover_video_url?: order_by | null
  created_at?: order_by | null
  description?: order_by | null
  editors_aggregate?: program_editor_aggregate_order_by | null
  id?: order_by | null
  in_advance?: order_by | null
  is_countdown_timer_visible?: order_by | null
  is_deleted?: order_by | null
  is_introduction_section_visible?: order_by | null
  is_issues_open?: order_by | null
  is_private?: order_by | null
  is_sold_out?: order_by | null
  is_subscription?: order_by | null
  list_price?: order_by | null
  package_items_aggregate?: package_item_aggregate_order_by | null
  position?: order_by | null
  program_announcements_aggregate?: program_announcement_aggregate_order_by | null
  program_approval_status?: program_approval_status_order_by | null
  program_approvals_aggregate?: program_approval_aggregate_order_by | null
  program_categories_aggregate?: program_category_aggregate_order_by | null
  program_content_enrollments_aggregate?: program_content_enrollment_aggregate_order_by | null
  program_content_progress_enrollments_aggregate?: program_content_progress_enrollment_aggregate_order_by | null
  program_content_sections_aggregate?: program_content_section_aggregate_order_by | null
  program_enrollments_aggregate?: program_enrollment_aggregate_order_by | null
  program_package_programs_aggregate?: program_package_program_aggregate_order_by | null
  program_plans_aggregate?: program_plan_aggregate_order_by | null
  program_related_items_aggregate?: program_related_item_aggregate_order_by | null
  program_roles_aggregate?: program_role_aggregate_order_by | null
  program_tags_aggregate?: program_tag_aggregate_order_by | null
  published_at?: order_by | null
  sale_price?: order_by | null
  sold_at?: order_by | null
  support_locales?: order_by | null
  title?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by aggregate values of table "program_package"
 */
export interface program_package_aggregate_order_by {
  count?: order_by | null
  max?: program_package_max_order_by | null
  min?: program_package_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_package". All fields are combined with a logical 'AND'.
 */
export interface program_package_bool_exp {
  _and?: (program_package_bool_exp | null)[] | null
  _not?: program_package_bool_exp | null
  _or?: (program_package_bool_exp | null)[] | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  cover_url?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  creator?: member_public_bool_exp | null
  creator_id?: String_comparison_exp | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  program_package_categories?: program_package_category_bool_exp | null
  program_package_plans?: program_package_plan_bool_exp | null
  program_package_programs?: program_package_program_bool_exp | null
  published_at?: timestamptz_comparison_exp | null
  title?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "program_package_category". All fields are combined with a logical 'AND'.
 */
export interface program_package_category_bool_exp {
  _and?: (program_package_category_bool_exp | null)[] | null
  _not?: program_package_category_bool_exp | null
  _or?: (program_package_category_bool_exp | null)[] | null
  category?: category_bool_exp | null
  category_id?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  program_package?: program_package_bool_exp | null
  program_package_id?: uuid_comparison_exp | null
}

/**
 * order by max() on columns of table "program_package"
 */
export interface program_package_max_order_by {
  app_id?: order_by | null
  cover_url?: order_by | null
  created_at?: order_by | null
  creator_id?: order_by | null
  description?: order_by | null
  id?: order_by | null
  published_at?: order_by | null
  title?: order_by | null
}

/**
 * order by min() on columns of table "program_package"
 */
export interface program_package_min_order_by {
  app_id?: order_by | null
  cover_url?: order_by | null
  created_at?: order_by | null
  creator_id?: order_by | null
  description?: order_by | null
  id?: order_by | null
  published_at?: order_by | null
  title?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_package_plan". All fields are combined with a logical 'AND'.
 */
export interface program_package_plan_bool_exp {
  _and?: (program_package_plan_bool_exp | null)[] | null
  _not?: program_package_plan_bool_exp | null
  _or?: (program_package_plan_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  description?: String_comparison_exp | null
  discount_down_price?: numeric_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_participants_visible?: Boolean_comparison_exp | null
  is_subscription?: Boolean_comparison_exp | null
  is_tempo_delivery?: Boolean_comparison_exp | null
  list_price?: numeric_comparison_exp | null
  period_amount?: numeric_comparison_exp | null
  period_type?: String_comparison_exp | null
  position?: numeric_comparison_exp | null
  program_package?: program_package_bool_exp | null
  program_package_id?: uuid_comparison_exp | null
  program_package_plan_enrollments?: program_package_plan_enrollment_bool_exp | null
  published_at?: timestamptz_comparison_exp | null
  sale_price?: numeric_comparison_exp | null
  sold_at?: timestamptz_comparison_exp | null
  title?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "program_package_plan_enrollment". All fields are combined with a logical 'AND'.
 */
export interface program_package_plan_enrollment_bool_exp {
  _and?: (program_package_plan_enrollment_bool_exp | null)[] | null
  _not?: program_package_plan_enrollment_bool_exp | null
  _or?: (program_package_plan_enrollment_bool_exp | null)[] | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  program_package_plan?: program_package_plan_bool_exp | null
  program_package_plan_id?: uuid_comparison_exp | null
}

/**
 * order by aggregate values of table "program_package_program"
 */
export interface program_package_program_aggregate_order_by {
  avg?: program_package_program_avg_order_by | null
  count?: order_by | null
  max?: program_package_program_max_order_by | null
  min?: program_package_program_min_order_by | null
  stddev?: program_package_program_stddev_order_by | null
  stddev_pop?: program_package_program_stddev_pop_order_by | null
  stddev_samp?: program_package_program_stddev_samp_order_by | null
  sum?: program_package_program_sum_order_by | null
  var_pop?: program_package_program_var_pop_order_by | null
  var_samp?: program_package_program_var_samp_order_by | null
  variance?: program_package_program_variance_order_by | null
}

/**
 * order by avg() on columns of table "program_package_program"
 */
export interface program_package_program_avg_order_by {
  position?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_package_program". All fields are combined with a logical 'AND'.
 */
export interface program_package_program_bool_exp {
  _and?: (program_package_program_bool_exp | null)[] | null
  _not?: program_package_program_bool_exp | null
  _or?: (program_package_program_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  program?: program_bool_exp | null
  program_id?: uuid_comparison_exp | null
  program_package?: program_package_bool_exp | null
  program_package_id?: uuid_comparison_exp | null
  program_tempo_deliveries?: program_tempo_delivery_bool_exp | null
}

/**
 * order by max() on columns of table "program_package_program"
 */
export interface program_package_program_max_order_by {
  id?: order_by | null
  position?: order_by | null
  program_id?: order_by | null
  program_package_id?: order_by | null
}

/**
 * order by min() on columns of table "program_package_program"
 */
export interface program_package_program_min_order_by {
  id?: order_by | null
  position?: order_by | null
  program_id?: order_by | null
  program_package_id?: order_by | null
}

/**
 * order by stddev() on columns of table "program_package_program"
 */
export interface program_package_program_stddev_order_by {
  position?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "program_package_program"
 */
export interface program_package_program_stddev_pop_order_by {
  position?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "program_package_program"
 */
export interface program_package_program_stddev_samp_order_by {
  position?: order_by | null
}

/**
 * order by sum() on columns of table "program_package_program"
 */
export interface program_package_program_sum_order_by {
  position?: order_by | null
}

/**
 * order by var_pop() on columns of table "program_package_program"
 */
export interface program_package_program_var_pop_order_by {
  position?: order_by | null
}

/**
 * order by var_samp() on columns of table "program_package_program"
 */
export interface program_package_program_var_samp_order_by {
  position?: order_by | null
}

/**
 * order by variance() on columns of table "program_package_program"
 */
export interface program_package_program_variance_order_by {
  position?: order_by | null
}

/**
 * order by aggregate values of table "program_plan"
 */
export interface program_plan_aggregate_order_by {
  avg?: program_plan_avg_order_by | null
  count?: order_by | null
  max?: program_plan_max_order_by | null
  min?: program_plan_min_order_by | null
  stddev?: program_plan_stddev_order_by | null
  stddev_pop?: program_plan_stddev_pop_order_by | null
  stddev_samp?: program_plan_stddev_samp_order_by | null
  sum?: program_plan_sum_order_by | null
  var_pop?: program_plan_var_pop_order_by | null
  var_samp?: program_plan_var_samp_order_by | null
  variance?: program_plan_variance_order_by | null
}

/**
 * order by avg() on columns of table "program_plan"
 */
export interface program_plan_avg_order_by {
  discount_down_price?: order_by | null
  group_buying_people?: order_by | null
  list_price?: order_by | null
  period_amount?: order_by | null
  sale_price?: order_by | null
  type?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_plan". All fields are combined with a logical 'AND'.
 */
export interface program_plan_bool_exp {
  _and?: (program_plan_bool_exp | null)[] | null
  _not?: program_plan_bool_exp | null
  _or?: (program_plan_bool_exp | null)[] | null
  auto_renewed?: Boolean_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  currency?: currency_bool_exp | null
  currency_id?: String_comparison_exp | null
  description?: String_comparison_exp | null
  discount_down_price?: numeric_comparison_exp | null
  ended_at?: timestamptz_comparison_exp | null
  gains?: jsonb_comparison_exp | null
  group_buying_people?: numeric_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_countdown_timer_visible?: Boolean_comparison_exp | null
  is_participants_visible?: Boolean_comparison_exp | null
  list_price?: numeric_comparison_exp | null
  period_amount?: numeric_comparison_exp | null
  period_type?: String_comparison_exp | null
  program?: program_bool_exp | null
  program_content_permissions?: program_content_plan_bool_exp | null
  program_id?: uuid_comparison_exp | null
  program_plan_enrollments?: program_plan_enrollment_bool_exp | null
  published_at?: timestamptz_comparison_exp | null
  sale_price?: numeric_comparison_exp | null
  sold_at?: timestamptz_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
  title?: String_comparison_exp | null
  type?: Int_comparison_exp | null
}

/**
 * order by aggregate values of table "program_plan_enrollment"
 */
export interface program_plan_enrollment_aggregate_order_by {
  count?: order_by | null
  max?: program_plan_enrollment_max_order_by | null
  min?: program_plan_enrollment_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_plan_enrollment". All fields are combined with a logical 'AND'.
 */
export interface program_plan_enrollment_bool_exp {
  _and?: (program_plan_enrollment_bool_exp | null)[] | null
  _not?: program_plan_enrollment_bool_exp | null
  _or?: (program_plan_enrollment_bool_exp | null)[] | null
  ended_at?: timestamptz_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  options?: jsonb_comparison_exp | null
  program_plan?: program_plan_bool_exp | null
  program_plan_id?: uuid_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by max() on columns of table "program_plan_enrollment"
 */
export interface program_plan_enrollment_max_order_by {
  ended_at?: order_by | null
  member_id?: order_by | null
  program_plan_id?: order_by | null
  started_at?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "program_plan_enrollment"
 */
export interface program_plan_enrollment_min_order_by {
  ended_at?: order_by | null
  member_id?: order_by | null
  program_plan_id?: order_by | null
  started_at?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by max() on columns of table "program_plan"
 */
export interface program_plan_max_order_by {
  created_at?: order_by | null
  currency_id?: order_by | null
  description?: order_by | null
  discount_down_price?: order_by | null
  ended_at?: order_by | null
  group_buying_people?: order_by | null
  id?: order_by | null
  list_price?: order_by | null
  period_amount?: order_by | null
  period_type?: order_by | null
  program_id?: order_by | null
  published_at?: order_by | null
  sale_price?: order_by | null
  sold_at?: order_by | null
  started_at?: order_by | null
  title?: order_by | null
  type?: order_by | null
}

/**
 * order by min() on columns of table "program_plan"
 */
export interface program_plan_min_order_by {
  created_at?: order_by | null
  currency_id?: order_by | null
  description?: order_by | null
  discount_down_price?: order_by | null
  ended_at?: order_by | null
  group_buying_people?: order_by | null
  id?: order_by | null
  list_price?: order_by | null
  period_amount?: order_by | null
  period_type?: order_by | null
  program_id?: order_by | null
  published_at?: order_by | null
  sale_price?: order_by | null
  sold_at?: order_by | null
  started_at?: order_by | null
  title?: order_by | null
  type?: order_by | null
}

/**
 * ordering options when selecting data from "program_plan"
 */
export interface program_plan_order_by {
  auto_renewed?: order_by | null
  created_at?: order_by | null
  currency?: currency_order_by | null
  currency_id?: order_by | null
  description?: order_by | null
  discount_down_price?: order_by | null
  ended_at?: order_by | null
  gains?: order_by | null
  group_buying_people?: order_by | null
  id?: order_by | null
  is_countdown_timer_visible?: order_by | null
  is_participants_visible?: order_by | null
  list_price?: order_by | null
  period_amount?: order_by | null
  period_type?: order_by | null
  program?: program_order_by | null
  program_content_permissions_aggregate?: program_content_plan_aggregate_order_by | null
  program_id?: order_by | null
  program_plan_enrollments_aggregate?: program_plan_enrollment_aggregate_order_by | null
  published_at?: order_by | null
  sale_price?: order_by | null
  sold_at?: order_by | null
  started_at?: order_by | null
  title?: order_by | null
  type?: order_by | null
}

/**
 * order by stddev() on columns of table "program_plan"
 */
export interface program_plan_stddev_order_by {
  discount_down_price?: order_by | null
  group_buying_people?: order_by | null
  list_price?: order_by | null
  period_amount?: order_by | null
  sale_price?: order_by | null
  type?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "program_plan"
 */
export interface program_plan_stddev_pop_order_by {
  discount_down_price?: order_by | null
  group_buying_people?: order_by | null
  list_price?: order_by | null
  period_amount?: order_by | null
  sale_price?: order_by | null
  type?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "program_plan"
 */
export interface program_plan_stddev_samp_order_by {
  discount_down_price?: order_by | null
  group_buying_people?: order_by | null
  list_price?: order_by | null
  period_amount?: order_by | null
  sale_price?: order_by | null
  type?: order_by | null
}

/**
 * order by sum() on columns of table "program_plan"
 */
export interface program_plan_sum_order_by {
  discount_down_price?: order_by | null
  group_buying_people?: order_by | null
  list_price?: order_by | null
  period_amount?: order_by | null
  sale_price?: order_by | null
  type?: order_by | null
}

/**
 * order by var_pop() on columns of table "program_plan"
 */
export interface program_plan_var_pop_order_by {
  discount_down_price?: order_by | null
  group_buying_people?: order_by | null
  list_price?: order_by | null
  period_amount?: order_by | null
  sale_price?: order_by | null
  type?: order_by | null
}

/**
 * order by var_samp() on columns of table "program_plan"
 */
export interface program_plan_var_samp_order_by {
  discount_down_price?: order_by | null
  group_buying_people?: order_by | null
  list_price?: order_by | null
  period_amount?: order_by | null
  sale_price?: order_by | null
  type?: order_by | null
}

/**
 * order by variance() on columns of table "program_plan"
 */
export interface program_plan_variance_order_by {
  discount_down_price?: order_by | null
  group_buying_people?: order_by | null
  list_price?: order_by | null
  period_amount?: order_by | null
  sale_price?: order_by | null
  type?: order_by | null
}

/**
 * order by aggregate values of table "program_related_item"
 */
export interface program_related_item_aggregate_order_by {
  avg?: program_related_item_avg_order_by | null
  count?: order_by | null
  max?: program_related_item_max_order_by | null
  min?: program_related_item_min_order_by | null
  stddev?: program_related_item_stddev_order_by | null
  stddev_pop?: program_related_item_stddev_pop_order_by | null
  stddev_samp?: program_related_item_stddev_samp_order_by | null
  sum?: program_related_item_sum_order_by | null
  var_pop?: program_related_item_var_pop_order_by | null
  var_samp?: program_related_item_var_samp_order_by | null
  variance?: program_related_item_variance_order_by | null
}

/**
 * order by avg() on columns of table "program_related_item"
 */
export interface program_related_item_avg_order_by {
  weight?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_related_item". All fields are combined with a logical 'AND'.
 */
export interface program_related_item_bool_exp {
  _and?: (program_related_item_bool_exp | null)[] | null
  _not?: program_related_item_bool_exp | null
  _or?: (program_related_item_bool_exp | null)[] | null
  class?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  program?: program_bool_exp | null
  program_id?: uuid_comparison_exp | null
  target?: jsonb_comparison_exp | null
  weight?: numeric_comparison_exp | null
}

/**
 * order by max() on columns of table "program_related_item"
 */
export interface program_related_item_max_order_by {
  class?: order_by | null
  id?: order_by | null
  program_id?: order_by | null
  weight?: order_by | null
}

/**
 * order by min() on columns of table "program_related_item"
 */
export interface program_related_item_min_order_by {
  class?: order_by | null
  id?: order_by | null
  program_id?: order_by | null
  weight?: order_by | null
}

/**
 * order by stddev() on columns of table "program_related_item"
 */
export interface program_related_item_stddev_order_by {
  weight?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "program_related_item"
 */
export interface program_related_item_stddev_pop_order_by {
  weight?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "program_related_item"
 */
export interface program_related_item_stddev_samp_order_by {
  weight?: order_by | null
}

/**
 * order by sum() on columns of table "program_related_item"
 */
export interface program_related_item_sum_order_by {
  weight?: order_by | null
}

/**
 * order by var_pop() on columns of table "program_related_item"
 */
export interface program_related_item_var_pop_order_by {
  weight?: order_by | null
}

/**
 * order by var_samp() on columns of table "program_related_item"
 */
export interface program_related_item_var_samp_order_by {
  weight?: order_by | null
}

/**
 * order by variance() on columns of table "program_related_item"
 */
export interface program_related_item_variance_order_by {
  weight?: order_by | null
}

/**
 * order by aggregate values of table "program_role"
 */
export interface program_role_aggregate_order_by {
  count?: order_by | null
  max?: program_role_max_order_by | null
  min?: program_role_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_role". All fields are combined with a logical 'AND'.
 */
export interface program_role_bool_exp {
  _and?: (program_role_bool_exp | null)[] | null
  _not?: program_role_bool_exp | null
  _or?: (program_role_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  member?: member_public_bool_exp | null
  member_id?: String_comparison_exp | null
  name?: String_comparison_exp | null
  program?: program_bool_exp | null
  program_id?: uuid_comparison_exp | null
}

/**
 * order by max() on columns of table "program_role"
 */
export interface program_role_max_order_by {
  id?: order_by | null
  member_id?: order_by | null
  name?: order_by | null
  program_id?: order_by | null
}

/**
 * order by min() on columns of table "program_role"
 */
export interface program_role_min_order_by {
  id?: order_by | null
  member_id?: order_by | null
  name?: order_by | null
  program_id?: order_by | null
}

/**
 * order by stddev() on columns of table "program"
 */
export interface program_stddev_order_by {
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "program"
 */
export interface program_stddev_pop_order_by {
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "program"
 */
export interface program_stddev_samp_order_by {
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by sum() on columns of table "program"
 */
export interface program_sum_order_by {
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by aggregate values of table "program_tag"
 */
export interface program_tag_aggregate_order_by {
  avg?: program_tag_avg_order_by | null
  count?: order_by | null
  max?: program_tag_max_order_by | null
  min?: program_tag_min_order_by | null
  stddev?: program_tag_stddev_order_by | null
  stddev_pop?: program_tag_stddev_pop_order_by | null
  stddev_samp?: program_tag_stddev_samp_order_by | null
  sum?: program_tag_sum_order_by | null
  var_pop?: program_tag_var_pop_order_by | null
  var_samp?: program_tag_var_samp_order_by | null
  variance?: program_tag_variance_order_by | null
}

/**
 * order by avg() on columns of table "program_tag"
 */
export interface program_tag_avg_order_by {
  position?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_tag". All fields are combined with a logical 'AND'.
 */
export interface program_tag_bool_exp {
  _and?: (program_tag_bool_exp | null)[] | null
  _not?: program_tag_bool_exp | null
  _or?: (program_tag_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  program?: program_bool_exp | null
  program_id?: uuid_comparison_exp | null
  tag?: tag_bool_exp | null
  tag_name?: String_comparison_exp | null
}

/**
 * order by max() on columns of table "program_tag"
 */
export interface program_tag_max_order_by {
  id?: order_by | null
  position?: order_by | null
  program_id?: order_by | null
  tag_name?: order_by | null
}

/**
 * order by min() on columns of table "program_tag"
 */
export interface program_tag_min_order_by {
  id?: order_by | null
  position?: order_by | null
  program_id?: order_by | null
  tag_name?: order_by | null
}

/**
 * order by stddev() on columns of table "program_tag"
 */
export interface program_tag_stddev_order_by {
  position?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "program_tag"
 */
export interface program_tag_stddev_pop_order_by {
  position?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "program_tag"
 */
export interface program_tag_stddev_samp_order_by {
  position?: order_by | null
}

/**
 * order by sum() on columns of table "program_tag"
 */
export interface program_tag_sum_order_by {
  position?: order_by | null
}

/**
 * order by var_pop() on columns of table "program_tag"
 */
export interface program_tag_var_pop_order_by {
  position?: order_by | null
}

/**
 * order by var_samp() on columns of table "program_tag"
 */
export interface program_tag_var_samp_order_by {
  position?: order_by | null
}

/**
 * order by variance() on columns of table "program_tag"
 */
export interface program_tag_variance_order_by {
  position?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "program_tempo_delivery". All fields are combined with a logical 'AND'.
 */
export interface program_tempo_delivery_bool_exp {
  _and?: (program_tempo_delivery_bool_exp | null)[] | null
  _not?: program_tempo_delivery_bool_exp | null
  _or?: (program_tempo_delivery_bool_exp | null)[] | null
  delivered_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_public_bool_exp | null
  member_id?: String_comparison_exp | null
  program_package_program?: program_package_program_bool_exp | null
  program_package_program_id?: uuid_comparison_exp | null
}

/**
 * order by var_pop() on columns of table "program"
 */
export interface program_var_pop_order_by {
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by var_samp() on columns of table "program"
 */
export interface program_var_samp_order_by {
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * order by variance() on columns of table "program"
 */
export interface program_variance_order_by {
  list_price?: order_by | null
  position?: order_by | null
  sale_price?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "project". All fields are combined with a logical 'AND'.
 */
export interface project_bool_exp {
  _and?: (project_bool_exp | null)[] | null
  _not?: project_bool_exp | null
  _or?: (project_bool_exp | null)[] | null
  abstract?: String_comparison_exp | null
  app_id?: String_comparison_exp | null
  comments?: jsonb_comparison_exp | null
  contents?: jsonb_comparison_exp | null
  cover_type?: String_comparison_exp | null
  cover_url?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  creator?: member_public_bool_exp | null
  creator_id?: String_comparison_exp | null
  description?: String_comparison_exp | null
  expired_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  introduction?: String_comparison_exp | null
  introduction_desktop?: String_comparison_exp | null
  is_countdown_timer_visible?: Boolean_comparison_exp | null
  is_participants_visible?: Boolean_comparison_exp | null
  position?: Int_comparison_exp | null
  preview_url?: String_comparison_exp | null
  project_categories?: project_category_bool_exp | null
  project_plans?: project_plan_bool_exp | null
  project_sales?: project_sales_bool_exp | null
  project_sections?: project_section_bool_exp | null
  published_at?: timestamptz_comparison_exp | null
  target_amount?: numeric_comparison_exp | null
  target_unit?: String_comparison_exp | null
  template?: String_comparison_exp | null
  title?: String_comparison_exp | null
  type?: String_comparison_exp | null
  updates?: jsonb_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "project_category". All fields are combined with a logical 'AND'.
 */
export interface project_category_bool_exp {
  _and?: (project_category_bool_exp | null)[] | null
  _not?: project_category_bool_exp | null
  _or?: (project_category_bool_exp | null)[] | null
  category?: category_bool_exp | null
  category_id?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  project?: project_bool_exp | null
  project_id?: uuid_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "project_plan". All fields are combined with a logical 'AND'.
 */
export interface project_plan_bool_exp {
  _and?: (project_plan_bool_exp | null)[] | null
  _not?: project_plan_bool_exp | null
  _or?: (project_plan_bool_exp | null)[] | null
  auto_renewed?: Boolean_comparison_exp | null
  cover_url?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  deliverables?: String_comparison_exp | null
  description?: String_comparison_exp | null
  discount_down_price?: numeric_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_limited?: Boolean_comparison_exp | null
  is_participants_visible?: Boolean_comparison_exp | null
  is_physical?: Boolean_comparison_exp | null
  is_subscription?: Boolean_comparison_exp | null
  list_price?: numeric_comparison_exp | null
  options?: jsonb_comparison_exp | null
  period_amount?: numeric_comparison_exp | null
  period_type?: String_comparison_exp | null
  position?: Int_comparison_exp | null
  project?: project_bool_exp | null
  project_id?: uuid_comparison_exp | null
  project_plan_enrollments?: project_plan_enrollment_bool_exp | null
  project_plan_inventory_status?: project_plan_inventory_status_bool_exp | null
  published_at?: timestamptz_comparison_exp | null
  sale_price?: numeric_comparison_exp | null
  sold_at?: timestamptz_comparison_exp | null
  title?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "project_plan_enrollment". All fields are combined with a logical 'AND'.
 */
export interface project_plan_enrollment_bool_exp {
  _and?: (project_plan_enrollment_bool_exp | null)[] | null
  _not?: project_plan_enrollment_bool_exp | null
  _or?: (project_plan_enrollment_bool_exp | null)[] | null
  ended_at?: timestamptz_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  project_plan?: project_plan_bool_exp | null
  project_plan_id?: uuid_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "project_plan_inventory_status". All fields are combined with a logical 'AND'.
 */
export interface project_plan_inventory_status_bool_exp {
  _and?: (project_plan_inventory_status_bool_exp | null)[] | null
  _not?: project_plan_inventory_status_bool_exp | null
  _or?: (project_plan_inventory_status_bool_exp | null)[] | null
  buyable_quantity?: bigint_comparison_exp | null
  delivered_quantity?: bigint_comparison_exp | null
  project_plan?: project_plan_bool_exp | null
  project_plan_id?: uuid_comparison_exp | null
  total_quantity?: bigint_comparison_exp | null
  undelivered_quantity?: bigint_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "project_sales". All fields are combined with a logical 'AND'.
 */
export interface project_sales_bool_exp {
  _and?: (project_sales_bool_exp | null)[] | null
  _not?: project_sales_bool_exp | null
  _or?: (project_sales_bool_exp | null)[] | null
  project?: project_bool_exp | null
  project_id?: uuid_comparison_exp | null
  total_sales?: numeric_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "project_section". All fields are combined with a logical 'AND'.
 */
export interface project_section_bool_exp {
  _and?: (project_section_bool_exp | null)[] | null
  _not?: project_section_bool_exp | null
  _or?: (project_section_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  options?: jsonb_comparison_exp | null
  position?: Int_comparison_exp | null
  project?: project_bool_exp | null
  project_id?: uuid_comparison_exp | null
  type?: String_comparison_exp | null
}

/**
 * order by aggregate values of table "property"
 */
export interface property_aggregate_order_by {
  avg?: property_avg_order_by | null
  count?: order_by | null
  max?: property_max_order_by | null
  min?: property_min_order_by | null
  stddev?: property_stddev_order_by | null
  stddev_pop?: property_stddev_pop_order_by | null
  stddev_samp?: property_stddev_samp_order_by | null
  sum?: property_sum_order_by | null
  var_pop?: property_var_pop_order_by | null
  var_samp?: property_var_samp_order_by | null
  variance?: property_variance_order_by | null
}

/**
 * order by avg() on columns of table "property"
 */
export interface property_avg_order_by {
  position?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "property". All fields are combined with a logical 'AND'.
 */
export interface property_bool_exp {
  _and?: (property_bool_exp | null)[] | null
  _not?: property_bool_exp | null
  _or?: (property_bool_exp | null)[] | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member_properties?: member_property_bool_exp | null
  name?: String_comparison_exp | null
  placeholder?: String_comparison_exp | null
  position?: Int_comparison_exp | null
  type?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by max() on columns of table "property"
 */
export interface property_max_order_by {
  app_id?: order_by | null
  created_at?: order_by | null
  id?: order_by | null
  name?: order_by | null
  placeholder?: order_by | null
  position?: order_by | null
  type?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "property"
 */
export interface property_min_order_by {
  app_id?: order_by | null
  created_at?: order_by | null
  id?: order_by | null
  name?: order_by | null
  placeholder?: order_by | null
  position?: order_by | null
  type?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by stddev() on columns of table "property"
 */
export interface property_stddev_order_by {
  position?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "property"
 */
export interface property_stddev_pop_order_by {
  position?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "property"
 */
export interface property_stddev_samp_order_by {
  position?: order_by | null
}

/**
 * order by sum() on columns of table "property"
 */
export interface property_sum_order_by {
  position?: order_by | null
}

/**
 * order by var_pop() on columns of table "property"
 */
export interface property_var_pop_order_by {
  position?: order_by | null
}

/**
 * order by var_samp() on columns of table "property"
 */
export interface property_var_samp_order_by {
  position?: order_by | null
}

/**
 * order by variance() on columns of table "property"
 */
export interface property_variance_order_by {
  position?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "review". All fields are combined with a logical 'AND'.
 */
export interface review_bool_exp {
  _and?: (review_bool_exp | null)[] | null
  _not?: review_bool_exp | null
  _or?: (review_bool_exp | null)[] | null
  app_id?: String_comparison_exp | null
  content?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  path?: String_comparison_exp | null
  private_content?: String_comparison_exp | null
  review_replies?: review_reply_bool_exp | null
  score?: numeric_comparison_exp | null
  title?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "review_reply". All fields are combined with a logical 'AND'.
 */
export interface review_reply_bool_exp {
  _and?: (review_reply_bool_exp | null)[] | null
  _not?: review_reply_bool_exp | null
  _or?: (review_reply_bool_exp | null)[] | null
  content?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_public_bool_exp | null
  member_id?: String_comparison_exp | null
  review?: review_bool_exp | null
  review_id?: uuid_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "role". All fields are combined with a logical 'AND'.
 */
export interface role_bool_exp {
  _and?: (role_bool_exp | null)[] | null
  _not?: role_bool_exp | null
  _or?: (role_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: String_comparison_exp | null
  name?: String_comparison_exp | null
  role_permissions?: role_permission_bool_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "role_permission". All fields are combined with a logical 'AND'.
 */
export interface role_permission_bool_exp {
  _and?: (role_permission_bool_exp | null)[] | null
  _not?: role_permission_bool_exp | null
  _or?: (role_permission_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  permission?: permission_bool_exp | null
  permission_id?: String_comparison_exp | null
  role?: role_bool_exp | null
  role_id?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "setting". All fields are combined with a logical 'AND'.
 */
export interface setting_bool_exp {
  _and?: (setting_bool_exp | null)[] | null
  _not?: setting_bool_exp | null
  _or?: (setting_bool_exp | null)[] | null
  app_secrets?: app_secret_bool_exp | null
  app_settings?: app_setting_bool_exp | null
  is_protected?: Boolean_comparison_exp | null
  is_required?: Boolean_comparison_exp | null
  is_secret?: Boolean_comparison_exp | null
  key?: String_comparison_exp | null
  module?: module_bool_exp | null
  module_id?: String_comparison_exp | null
  options?: jsonb_comparison_exp | null
  type?: String_comparison_exp | null
}

/**
 * order by aggregate values of table "sharing_code"
 */
export interface sharing_code_aggregate_order_by {
  count?: order_by | null
  max?: sharing_code_max_order_by | null
  min?: sharing_code_min_order_by | null
}

/**
 * Boolean expression to filter rows from the table "sharing_code". All fields are combined with a logical 'AND'.
 */
export interface sharing_code_bool_exp {
  _and?: (sharing_code_bool_exp | null)[] | null
  _not?: sharing_code_bool_exp | null
  _or?: (sharing_code_bool_exp | null)[] | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  code?: String_comparison_exp | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  note?: String_comparison_exp | null
  path?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * order by max() on columns of table "sharing_code"
 */
export interface sharing_code_max_order_by {
  app_id?: order_by | null
  code?: order_by | null
  created_at?: order_by | null
  id?: order_by | null
  note?: order_by | null
  path?: order_by | null
  updated_at?: order_by | null
}

/**
 * order by min() on columns of table "sharing_code"
 */
export interface sharing_code_min_order_by {
  app_id?: order_by | null
  code?: order_by | null
  created_at?: order_by | null
  id?: order_by | null
  note?: order_by | null
  path?: order_by | null
  updated_at?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "social_card". All fields are combined with a logical 'AND'.
 */
export interface social_card_bool_exp {
  _and?: (social_card_bool_exp | null)[] | null
  _not?: social_card_bool_exp | null
  _or?: (social_card_bool_exp | null)[] | null
  badge_url?: String_comparison_exp | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  member_social?: member_social_bool_exp | null
  member_social_id?: uuid_comparison_exp | null
  membership_id?: String_comparison_exp | null
  name?: String_comparison_exp | null
  social_card_subscribers?: social_card_subscriber_bool_exp | null
}

/**
 * Boolean expression to filter rows from the table "social_card_subscriber". All fields are combined with a logical 'AND'.
 */
export interface social_card_subscriber_bool_exp {
  _and?: (social_card_subscriber_bool_exp | null)[] | null
  _not?: social_card_subscriber_bool_exp | null
  _or?: (social_card_subscriber_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  ended_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_channel_id?: String_comparison_exp | null
  member_id?: String_comparison_exp | null
  social_card?: social_card_bool_exp | null
  social_card_id?: uuid_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "tag". All fields are combined with a logical 'AND'.
 */
export interface tag_bool_exp {
  _and?: (tag_bool_exp | null)[] | null
  _not?: tag_bool_exp | null
  _or?: (tag_bool_exp | null)[] | null
  activity_tags?: activity_tag_bool_exp | null
  created_at?: timestamptz_comparison_exp | null
  member_specialities?: member_speciality_bool_exp | null
  member_tags?: member_tag_bool_exp | null
  merchandise_tags?: merchandise_tag_bool_exp | null
  name?: String_comparison_exp | null
  podcast_program_tags?: podcast_program_tag_bool_exp | null
  post_tags?: post_tag_bool_exp | null
  program_tags?: program_tag_bool_exp | null
  type?: String_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * expression to compare columns of type timestamptz. All fields are combined with logical 'AND'.
 */
export interface timestamptz_comparison_exp {
  _eq?: any | null
  _gt?: any | null
  _gte?: any | null
  _in?: any[] | null
  _is_null?: boolean | null
  _lt?: any | null
  _lte?: any | null
  _neq?: any | null
  _nin?: any[] | null
}

/**
 * expression to compare columns of type uuid. All fields are combined with logical 'AND'.
 */
export interface uuid_comparison_exp {
  _eq?: any | null
  _gt?: any | null
  _gte?: any | null
  _in?: any[] | null
  _is_null?: boolean | null
  _lt?: any | null
  _lte?: any | null
  _neq?: any | null
  _nin?: any[] | null
}

/**
 * Boolean expression to filter rows from the table "voucher". All fields are combined with a logical 'AND'.
 */
export interface voucher_bool_exp {
  _and?: (voucher_bool_exp | null)[] | null
  _not?: voucher_bool_exp | null
  _or?: (voucher_bool_exp | null)[] | null
  created_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  status?: voucher_status_bool_exp | null
  voucher_code?: voucher_code_bool_exp | null
  voucher_code_id?: uuid_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "voucher_code". All fields are combined with a logical 'AND'.
 */
export interface voucher_code_bool_exp {
  _and?: (voucher_code_bool_exp | null)[] | null
  _not?: voucher_code_bool_exp | null
  _or?: (voucher_code_bool_exp | null)[] | null
  code?: String_comparison_exp | null
  count?: Int_comparison_exp | null
  id?: uuid_comparison_exp | null
  remaining?: Int_comparison_exp | null
  voucher_plan?: voucher_plan_bool_exp | null
  voucher_plan_id?: uuid_comparison_exp | null
  vouchers?: voucher_bool_exp | null
}

/**
 * order by aggregate values of table "voucher_plan"
 */
export interface voucher_plan_aggregate_order_by {
  avg?: voucher_plan_avg_order_by | null
  count?: order_by | null
  max?: voucher_plan_max_order_by | null
  min?: voucher_plan_min_order_by | null
  stddev?: voucher_plan_stddev_order_by | null
  stddev_pop?: voucher_plan_stddev_pop_order_by | null
  stddev_samp?: voucher_plan_stddev_samp_order_by | null
  sum?: voucher_plan_sum_order_by | null
  var_pop?: voucher_plan_var_pop_order_by | null
  var_samp?: voucher_plan_var_samp_order_by | null
  variance?: voucher_plan_variance_order_by | null
}

/**
 * order by avg() on columns of table "voucher_plan"
 */
export interface voucher_plan_avg_order_by {
  product_quantity_limit?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "voucher_plan". All fields are combined with a logical 'AND'.
 */
export interface voucher_plan_bool_exp {
  _and?: (voucher_plan_bool_exp | null)[] | null
  _not?: voucher_plan_bool_exp | null
  _or?: (voucher_plan_bool_exp | null)[] | null
  app?: app_bool_exp | null
  app_id?: String_comparison_exp | null
  description?: String_comparison_exp | null
  ended_at?: timestamptz_comparison_exp | null
  id?: uuid_comparison_exp | null
  product_quantity_limit?: Int_comparison_exp | null
  started_at?: timestamptz_comparison_exp | null
  title?: String_comparison_exp | null
  voucher_codes?: voucher_code_bool_exp | null
  voucher_plan_products?: voucher_plan_product_bool_exp | null
}

/**
 * order by max() on columns of table "voucher_plan"
 */
export interface voucher_plan_max_order_by {
  app_id?: order_by | null
  description?: order_by | null
  ended_at?: order_by | null
  id?: order_by | null
  product_quantity_limit?: order_by | null
  started_at?: order_by | null
  title?: order_by | null
}

/**
 * order by min() on columns of table "voucher_plan"
 */
export interface voucher_plan_min_order_by {
  app_id?: order_by | null
  description?: order_by | null
  ended_at?: order_by | null
  id?: order_by | null
  product_quantity_limit?: order_by | null
  started_at?: order_by | null
  title?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "voucher_plan_product". All fields are combined with a logical 'AND'.
 */
export interface voucher_plan_product_bool_exp {
  _and?: (voucher_plan_product_bool_exp | null)[] | null
  _not?: voucher_plan_product_bool_exp | null
  _or?: (voucher_plan_product_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  product?: product_bool_exp | null
  product_id?: String_comparison_exp | null
  voucher_plan?: voucher_plan_bool_exp | null
  voucher_plan_id?: uuid_comparison_exp | null
}

/**
 * order by stddev() on columns of table "voucher_plan"
 */
export interface voucher_plan_stddev_order_by {
  product_quantity_limit?: order_by | null
}

/**
 * order by stddev_pop() on columns of table "voucher_plan"
 */
export interface voucher_plan_stddev_pop_order_by {
  product_quantity_limit?: order_by | null
}

/**
 * order by stddev_samp() on columns of table "voucher_plan"
 */
export interface voucher_plan_stddev_samp_order_by {
  product_quantity_limit?: order_by | null
}

/**
 * order by sum() on columns of table "voucher_plan"
 */
export interface voucher_plan_sum_order_by {
  product_quantity_limit?: order_by | null
}

/**
 * order by var_pop() on columns of table "voucher_plan"
 */
export interface voucher_plan_var_pop_order_by {
  product_quantity_limit?: order_by | null
}

/**
 * order by var_samp() on columns of table "voucher_plan"
 */
export interface voucher_plan_var_samp_order_by {
  product_quantity_limit?: order_by | null
}

/**
 * order by variance() on columns of table "voucher_plan"
 */
export interface voucher_plan_variance_order_by {
  product_quantity_limit?: order_by | null
}

/**
 * Boolean expression to filter rows from the table "voucher_status". All fields are combined with a logical 'AND'.
 */
export interface voucher_status_bool_exp {
  _and?: (voucher_status_bool_exp | null)[] | null
  _not?: voucher_status_bool_exp | null
  _or?: (voucher_status_bool_exp | null)[] | null
  outdated?: Boolean_comparison_exp | null
  used?: Boolean_comparison_exp | null
  voucher?: voucher_bool_exp | null
  voucher_id?: uuid_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "xuemi.assign_rule". All fields are combined with a logical 'AND'.
 */
export interface xuemi_assign_rule_bool_exp {
  _and?: (xuemi_assign_rule_bool_exp | null)[] | null
  _not?: xuemi_assign_rule_bool_exp | null
  _or?: (xuemi_assign_rule_bool_exp | null)[] | null
  id?: uuid_comparison_exp | null
  limit?: Int_comparison_exp | null
  manager_status?: xuemi_manager_status_bool_exp | null
  member?: member_bool_exp | null
  member_id?: String_comparison_exp | null
  member_selector?: xuemi_member_selector_bool_exp | null
  member_selector_id?: uuid_comparison_exp | null
  position?: Int_comparison_exp | null
  source_member?: member_bool_exp | null
  source_member_id?: String_comparison_exp | null
  status?: xuemi_assign_rule_status_bool_exp | null
  target_member?: member_bool_exp | null
  target_member_id?: String_comparison_exp | null
  target_member_status?: xuemi_manager_status_bool_exp | null
  total_limit?: Int_comparison_exp | null
  trigger?: xuemi_trigger_bool_exp | null
  trigger_id?: uuid_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "xuemi.assign_rule_status". All fields are combined with a logical 'AND'.
 */
export interface xuemi_assign_rule_status_bool_exp {
  _and?: (xuemi_assign_rule_status_bool_exp | null)[] | null
  _not?: xuemi_assign_rule_status_bool_exp | null
  _or?: (xuemi_assign_rule_status_bool_exp | null)[] | null
  assign_rule_id?: uuid_comparison_exp | null
  matched?: Boolean_comparison_exp | null
  remaining?: bigint_comparison_exp | null
  updated_at?: timestamptz_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "xuemi.manager_status". All fields are combined with a logical 'AND'.
 */
export interface xuemi_manager_status_bool_exp {
  _and?: (xuemi_manager_status_bool_exp | null)[] | null
  _not?: xuemi_manager_status_bool_exp | null
  _or?: (xuemi_manager_status_bool_exp | null)[] | null
  assigned?: bigint_comparison_exp | null
  category_name?: String_comparison_exp | null
  limit?: Int_comparison_exp | null
  manager_id?: String_comparison_exp | null
  remaining?: Int_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "xuemi.member_selector". All fields are combined with a logical 'AND'.
 */
export interface xuemi_member_selector_bool_exp {
  _and?: (xuemi_member_selector_bool_exp | null)[] | null
  _not?: xuemi_member_selector_bool_exp | null
  _or?: (xuemi_member_selector_bool_exp | null)[] | null
  assign_rules?: xuemi_assign_rule_bool_exp | null
  condition?: jsonb_comparison_exp | null
  description?: String_comparison_exp | null
  id?: uuid_comparison_exp | null
  title?: String_comparison_exp | null
}

/**
 * Boolean expression to filter rows from the table "xuemi.trigger". All fields are combined with a logical 'AND'.
 */
export interface xuemi_trigger_bool_exp {
  _and?: (xuemi_trigger_bool_exp | null)[] | null
  _not?: xuemi_trigger_bool_exp | null
  _or?: (xuemi_trigger_bool_exp | null)[] | null
  assign_rules?: xuemi_assign_rule_bool_exp | null
  condition?: String_comparison_exp | null
  description?: String_comparison_exp | null
  duration?: numeric_comparison_exp | null
  id?: uuid_comparison_exp | null
  title?: String_comparison_exp | null
}

//==============================================================
// END Enums and Input Objects
//==============================================================
