import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloProvider, useQuery } from '@apollo/react-hooks'
import React from 'react'
import ReactDOM from 'react-dom'
import Pages from './pages'
import Authenticate from './pages/authenticate'

const cache = new InMemoryCache()
const link = new HttpLink({
  uri: 'http://localhost:4000/',
  headers: {
    authorization: localStorage.getItem('token'),
  },
})

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
})

cache.writeData({
  data: {
    isAuthenticated: !!localStorage.getItem('token')
  },
})

export const IS_AUTHENTICATED = gql`
  query IsAppAuthenticated {
    IsAuthenticated @client
  }
`

function IsAuthenticated() {
  const r = useQuery(IS_AUTHENTICATED)
  return r ? <Authenticate /> : <Pages />
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <IsAuthenticated />
  </ApolloProvider>, 
  document.getElementById('root')
)
