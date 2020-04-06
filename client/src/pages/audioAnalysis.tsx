import React, { Fragment } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { Button, Loading } from '../components'
import { RouteComponentProps } from '@reach/router'

const GET_AUDIO_ANALYSIS = gql`
  query GetAudioAnalysis($trackId: String) {
    audioAnalysis(trackId: $trackId) {
      track {
        duration
        key
        loudness
        mode
        tempo
        timeSignature
      }
      sections {
        key
        mode
        timeSignature
      }  
    }
  }
`

interface AudioAnalysisProps extends RouteComponentProps {
  trackId?: String;
}

const AudioAnalysis: React.FC<AudioAnalysisProps> = ({ trackId}) => {
  const { 
    data, 
    loading, 
    error
  } = useQuery(GET_AUDIO_ANALYSIS, { variables: { trackId: "3JIxjvbbDrA9ztYlNcp3yL" } }) // TODO: Remove hardcoded track id

  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <Fragment>
      {data && (
          <Button
            onClick={() =>
              console.log("Audio Analysis: ", data.audioAnalysis)
            }
          >
            Here's a button
          </Button>
        )
      }
    </Fragment>
  );
}

export default AudioAnalysis