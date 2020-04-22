import React, { Fragment } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import InputForm from '../../components/InputForm'
import P5Wrapper from '../../components/P5Wrapper'
import Player from '../../components/Player'

const GET_SNOWFLAKE_DATA = gql`
  query GetSnowflakeData($input:SnowflakeInput) {
    snowflakeData(input:$input) {
      __typename
      ... on SnowflakeData {
        artist
        duration
        energy
        key
        loudness
        mode
        spotifyId
        tempo
        timeSignature
        title
        sections {
          key
          loudness
          mode
          timeSignature
        }
        valence
      }
      ... on TrackNotFoundError {
        message
      }
      ... on AudioAnalysisNotFoundError {
        message
      }
    }
  }
`

const Home = ({ spotifyId }) => {
  const { 
    data, 
    loading, 
    error
  } = useQuery(GET_SNOWFLAKE_DATA, { variables: { input: { spotifyId: "6B182GP3TvEfmgUoIMVUSJ" } } } ) // TODO: Remove hardcoded spotifyId and use actual input
  
  if (loading) return <p>LOADING</p>
  if (error) return <p>ERROR</p>
  if (!data) return <p>Not found</p>

  if (data && data.snowflakeData) {
    console.log("Snowflake data: ", data.snowflakeData)
  }
  return (
    <Fragment>
      { data && data.snowflakeData && (
        <P5Wrapper className="P5-wrapper" snowflakeData={data.snowflakeData} />
      )}
      <InputForm />
      <Player />
    </Fragment>
  );
}

export default Home