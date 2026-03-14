import { ApolloProvider } from '@apollo/client'
import { ApolloClientOptions, createApolloClient } from '../helpers/apollo'
import { useAuth } from './AuthContext'

export const ApiProvider: React.FC<{ appId: string }> = ({ appId, children }) => {
  const { authToken } = useAuth()

  // FIX ME: 因 Hasura 端的 GraphQL 請求。GET_PROGRAM_COLLECTION 時會有未知偶發錯誤，暫時使用 Retry 機制先解決問題，需要找到根本原因
  const graphQLRetryCallbacks: ApolloClientOptions['graphQLRetryCallbacks'] = [
    (count, operation, errors) =>
      operation.operationName === 'GET_PROGRAM_COLLECTION' &&
      count < 3 &&
      (errors || []).some(error => error.extensions?.code === 'validation-failed'),
  ]

  const apolloClient = createApolloClient(
    { appId, authToken, graphQLRetryCallbacks },
    {
      'invalid-jwt': window.location.reload,
    },
  )

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
