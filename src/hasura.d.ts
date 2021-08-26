/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROGRAM
// ====================================================

export interface GET_PROGRAM_contents {
  __typename: 'program'
  id: any
  title: string
}

export interface GET_PROGRAM {
  /**
   * fetch data from the table: "program"
   */
  contents: GET_PROGRAM_contents[]
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ACTIVITY
// ====================================================

export interface GET_ACTIVITY_contents {
  __typename: 'activity'
  id: any
  title: string
}

export interface GET_ACTIVITY {
  /**
   * fetch data from the table: "activity"
   */
  contents: GET_ACTIVITY_contents[]
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PODCAST_PROGRAM
// ====================================================

export interface GET_PODCAST_PROGRAM_contents {
  __typename: 'podcast_program'
  id: any
  title: string
}

export interface GET_PODCAST_PROGRAM {
  /**
   * fetch data from the table: "podcast_program"
   */
  contents: GET_PODCAST_PROGRAM_contents[]
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_CREATOR
// ====================================================

export interface GET_CREATOR_contents {
  __typename: 'creator'
  id: string | null
  title: string | null
}

export interface GET_CREATOR {
  /**
   * fetch data from the table: "creator"
   */
  contents: GET_CREATOR_contents[]
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_FUNDING_PROJECT
// ====================================================

export interface GET_FUNDING_PROJECT_contents {
  __typename: 'project'
  id: any
  title: string
}

export interface GET_FUNDING_PROJECT {
  /**
   * fetch data from the table: "project"
   */
  contents: GET_FUNDING_PROJECT_contents[]
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PRE_ORDER_PROJECT
// ====================================================

export interface GET_PRE_ORDER_PROJECT_contents {
  __typename: 'project'
  id: any
  title: string
}

export interface GET_PRE_ORDER_PROJECT {
  /**
   * fetch data from the table: "project"
   */
  contents: GET_PRE_ORDER_PROJECT_contents[]
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
  limit: number
  appId?: string | null
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PUBLISHED_ACTIVITY_COLLECTION
// ====================================================

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
  limit?: number | null
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

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
  created_at?: timestamptz_comparison_exp | null
  data?: jsonb_comparison_exp | null
  id?: uuid_comparison_exp | null
  is_deleted?: Boolean_comparison_exp | null
  options?: jsonb_comparison_exp | null
  target?: String_comparison_exp | null
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
  appointment_plans?: appointment_plan_bool_exp | null
  assignRulesBySourceMemberId?: xuemi_assign_rule_bool_exp | null
  assignRulesByTargetMemberId?: xuemi_assign_rule_bool_exp | null
  assign_rules?: xuemi_assign_rule_bool_exp | null
  assigned_at?: timestamptz_comparison_exp | null
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
  published_at?: timestamptz_comparison_exp | null
  sale_free?: program_content_sale_free_bool_exp | null
  sale_price?: numeric_comparison_exp | null
  sold_at?: timestamptz_comparison_exp | null
  title?: String_comparison_exp | null
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
