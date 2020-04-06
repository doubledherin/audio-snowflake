import gql from 'graphql-tag'
import { ApolloCache } from 'apollo-cache'
import { Resolvers } from 'apollo-client'
import { IS_AUTHENTICATED } from './index'

export const typeDefs = gql`
  extend type Query {
    isAuthenticated: Boolean!
  }
`

type ResolverFn = (
  parent: any, 
  args: any, 
  { cache } : { cache: ApolloCache<any> }
) => any

interface ResolverMap {
  [field: string]: ResolverFn
}

interface AppResolvers extends Resolvers {}

export const resolvers: AppResolvers = {
  Query: {
    isAuthenticated: (a, b, { cache }): boolean => {
      const queryResult = cache.readQuery({
        query: IS_AUTHENTICATED
      })
      if (queryResult) {
        return queryResult.isAuthenticated
      } else {
        return false
      }
    }
  }
}