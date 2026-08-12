import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  from,
  HttpLink,
  InMemoryCache,
  NextLink,
  Observable,
  Operation,
  split,
} from '@apollo/client'
import { ErrorResponse, onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { OperationTypeNode } from 'graphql'
import { createClient } from 'graphql-ws'
import { v4 as uuidv4 } from 'uuid'

type ApolloGraphQLErrorRetryCallback = (
  count: number,
  operation: Operation,
  error: ErrorResponse['graphQLErrors'],
) => boolean

export type ApolloClientOptions = {
  appId: string
  authToken: string | null
  graphQLRetryCallbacks?: ApolloGraphQLErrorRetryCallback[]
}

type ApolloErrorCallbacks = {
  'invalid-jwt': () => void
}

// Apollo 的 RetryLink 不支援 GraphQLError 的情況，另行實作
const createGraphQLErrorRetryLink = (
  retryCallbacks: ApolloGraphQLErrorRetryCallback[],
  maxRetries = 5,
  delayMs = 300,
) => {
  const shouldRetry: ApolloGraphQLErrorRetryCallback = (retries, operation, errors) =>
    retryCallbacks?.some(callback => callback(retries, operation, errors))

  return new ApolloLink((operation: Operation, forward: NextLink) => {
    return new Observable<FetchResult>(observer => {
      let retries = 0

      const tryRequest = () => {
        const sub = forward(operation).subscribe({
          next: result => {
            if (result.errors?.length && shouldRetry(retries, operation, result.errors)) {
              if (retries < maxRetries) {
                retries++
                console.warn(`[GraphQLErrorRetry] retrying #${retries}`, result.errors)
                setTimeout(tryRequest, delayMs)
              } else {
                observer.error(result)
              }
            } else {
              observer.next(result)
              observer.complete()
            }
          },
          error: networkError => {
            observer.error(networkError)
          },
        })
        return () => sub.unsubscribe()
      }

      tryRequest()
    })
  })
}

// create onError link
const onErrorLink = (callbacks?: ApolloErrorCallbacks) =>
  onError(({ graphQLErrors, networkError }) => {
    graphQLErrors &&
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
        console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`, extensions)
        if (extensions && extensions.code === 'invalid-jwt') {
          callbacks?.['invalid-jwt']?.()
          setTimeout(() => window.location.assign('/'), 3000)
        }
      })
    networkError && console.log(`[Network error]: ${JSON.stringify(networkError)}`)
  })

const createHttpLink = (endpoint: string | undefined, options: { authToken: string | null; appId: string }) =>
  new HttpLink({
    uri: endpoint,
    headers: options.authToken
      ? {
          authorization: `Bearer ${options.authToken}`,
        }
      : {
          'x-hasura-org-id': options.appId,
          'x-hasura-app-id': options.appId,
          'x-hasura-user-id': uuidv4(),
          'x-hasura-role': 'anonymous',
        },
  })

// single-domain policy: a path-only REACT_APP_GRAPHQL_WS_ENDPOINT (e.g.
// /gql-ws/v1/graphql) is resolved against the current host at runtime, so one
// build serves every tenant domain; absolute ws(s):// values pass through
// unchanged. WebSocket URLs must be absolute, hence the explicit derivation.
const resolveWsEndpoint = (endpoint: string): string => {
  if (endpoint.startsWith('/') && typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}${endpoint}`
  }
  return endpoint
}

const createSplitLink = (appId: string, authToken: string | null) =>
  split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    new GraphQLWsLink(
      createClient({
        url: () => resolveWsEndpoint(String(process.env.REACT_APP_GRAPHQL_WS_ENDPOINT)),
        connectionParams: {
          headers: authToken
            ? {
                authorization: `Bearer ${authToken}`,
              }
            : {
                'x-hasura-org-id': appId,
                'x-hasura-app-id': appId,
                'x-hasura-user-id': uuidv4(),
                'x-hasura-role': 'anonymous',
              },
        },
      }),
    ),
    split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (definition.kind === 'OperationDefinition' && definition.operation === OperationTypeNode.QUERY) || false
      },
      split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          return (
            (definition.kind === 'OperationDefinition' &&
              (definition.name?.value.startsWith('Ph') || definition.name?.value.startsWith('PH_'))) ||
            false
          )
        },
        createHttpLink(process.env.REACT_APP_GRAPHQL_PH_ENDPOINT, { authToken, appId }),
        createHttpLink(process.env.REACT_APP_GRAPHQL_RH_ENDPOINT, { authToken, appId }),
      ),
      createHttpLink(process.env.REACT_APP_GRAPHQL_PH_ENDPOINT, { authToken, appId }),
    ),
  )

// single-domain policy: URLs stored in the DB (logos, covers, craft/rich-text
// content) point at the static host; rewrite them to the backend's same-origin
// /files route at the display layer so browsers never contact that host.
// Global in-string replace, because rich-text/craft values embed URLs inside
// HTML. The DB keeps canonical absolute URLs — this mapping is read-side only.
// Only URLs on THIS app's own bucket may be rewritten: /files serves objects
// out of the bucket the backend is configured with, so pointing a different
// host's URL at it yields a 404. Staging is the case that proves it — its DB
// rows carry production-bucket URLs whose objects the staging bucket lacks.
const STATIC_HOST_PATTERN = (() => {
  const bucketHost = (process.env.REACT_APP_S3_BUCKET || '').split('/')[0]
  if (!bucketHost) {
    return null
  }
  return new RegExp(`https?://${bucketHost.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/`, 'g')
})()

export const toSameOriginUrl = (value: string): string =>
  STATIC_HOST_PATTERN ? value.replace(STATIC_HOST_PATTERN, '/files/') : value

const deepMapStrings = (node: any): any => {
  if (typeof node === 'string') {
    return toSameOriginUrl(node)
  }
  if (Array.isArray(node)) {
    return node.map(deepMapStrings)
  }
  if (node && typeof node === 'object') {
    const mapped: { [key: string]: any } = {}
    for (const key of Object.keys(node)) {
      mapped[key] = deepMapStrings(node[key])
    }
    return mapped
  }
  return node
}

const sameOriginUrlLink = new ApolloLink((operation, forward) =>
  forward(operation).map(result => (result.data ? { ...result, data: deepMapStrings(result.data) } : result)),
)

export const createApolloClient = (options: ApolloClientOptions, errorCallbacks?: ApolloErrorCallbacks) => {
  const apolloClient = new ApolloClient({
    link: from([
      createGraphQLErrorRetryLink(options.graphQLRetryCallbacks || []),
      onErrorLink(errorCallbacks),
      sameOriginUrlLink,
      createSplitLink(options.appId, options.authToken),
    ]),
    cache: new InMemoryCache(),
  })
  return apolloClient
}
