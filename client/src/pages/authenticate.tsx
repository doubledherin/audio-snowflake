import React from 'react'
import { useApolloClient, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Pages from '../pages'
import { Loading } from '../components'
import ApolloClient from 'apollo-client'

export const AUTHENTICATE = gql`
  mutation Authenticate {
    authenticate
  }
`

export default function Authenticate() {
  const client: ApolloClient<any> = useApolloClient()
  const [token, { loading, error }] = useMutation(
    AUTHENTICATE,
    {
      onCompleted({ token }) {
        localStorage.setItem('token', token as string)
        client.writeData({ data: { isAuthenticated: true } })
      }
    }
  )
  if (loading) return <Loading />
  if (error) return <p>An error occurred</p>

  return <Pages />
}
