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

const createSplitLink = (appId: string, authToken: string | null) =>
  split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    new GraphQLWsLink(
      createClient({
        url: String(process.env.REACT_APP_GRAPHQL_WS_ENDPOINT),
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

export const createApolloClient = (options: ApolloClientOptions, errorCallbacks?: ApolloErrorCallbacks) => {
  const apolloClient = new ApolloClient({
    link: from([
      createGraphQLErrorRetryLink(options.graphQLRetryCallbacks || []),
      onErrorLink(errorCallbacks),
      createSplitLink(options.appId, options.authToken),
    ]),
    cache: new InMemoryCache(),
  })
  return apolloClient
}
