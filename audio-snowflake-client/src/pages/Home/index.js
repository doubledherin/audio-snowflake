import React, { Fragment } from 'react'
import { useQuery } from '@apollo/react-hooks'

import { getSnowflakeData } from '../../queries/getSnowflakeData'
import InputForm from '../../components/InputForm'
import P5Wrapper from '../../components/P5Wrapper'
import Player from '../../components/Player'

const Home = ({ spotifyId }) => {
  const { 
    data, 
    loading, 
    error
  } = useQuery(getSnowflakeData, { variables: { input: { spotifyId: "6B182GP3TvEfmgUoIMVUSJ" } } } ) // TODO: Remove hardcoded spotifyId and use actual input
  
  if (loading) return <p>LOADING</p>
  if (error) return <p>ERROR</p>
  if (!data) return <p>Not found</p>

  if (data && data.snowflakeData) {
    console.log("Snowflake data: ", data.snowflakeData)
  }
  return (
    <Fragment>
      { data && data.snowflakeData &&
        <P5Wrapper snowflakeData={data.snowflakeData} />
      }
      <InputForm />
      <Player />
    </Fragment>
  );
}

export default Home