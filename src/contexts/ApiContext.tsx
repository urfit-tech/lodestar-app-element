import { ApolloProvider } from '@apollo/client'
import { createApolloClient } from '../helpers/apollo'
import { useAuth } from './AuthContext'

export const ApiProvider: React.FC<{ appId: string }> = ({ appId, children }) => {
  const { authToken } = useAuth()

  const apolloClient = createApolloClient(
    { appId, authToken },
    {
      'invalid-jwt': window.location.reload,
    },
  )

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
