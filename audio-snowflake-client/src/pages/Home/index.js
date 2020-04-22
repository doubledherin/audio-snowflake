import React, { Fragment } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import P5Wrapper from "../../components/P5Wrapper/"
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
  } = useQuery(GET_SNOWFLAKE_DATA, { variables: { input: { spotifyId: "3JIxjvbbDrA9ztYlNcp3yL" } } } ) // TODO: Remove hardcoded track id
  console.log("DATA:", data)
  console.log("LOADING:", loading)
  console.log("ERROR:", error)

  // if (loading) return <p>LOADING</p>;
  // if (error) return <p>ERROR</p>;
  // if (!data) return <p>Not found</p>;

  return (
    <Fragment>
      <P5Wrapper className="P5-wrapper" />
      <Player />
{/* 
      {data && (
          <Button
            onClick={() =>
              console.log("Audio Analysis: ", data.audioAnalysis)
            }
          >
            Log Audio Analysis
          </Button>
        ) */}
      }
    </Fragment>
  );
}

export default Home