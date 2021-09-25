import { ApolloProvider } from '@apollo/react-hooks'
import { useToast } from '@chakra-ui/toast'
import React from 'react'
import { createApolloClient } from '../helpers/apollo'
import { useAuth } from './AuthContext'

export const ApiProvider: React.FC<{ appId: string }> = ({ appId, children }) => {
  const { authToken } = useAuth()
  const toast = useToast()
  const apolloClient = createApolloClient(
    { appId, authToken },
    {
      'invalid-jwt': () => {
        toast({ title: 'session expired' })
      },
    },
  )

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
