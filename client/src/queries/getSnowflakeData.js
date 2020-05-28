import gql from 'graphql-tag'

export const getSnowflakeData = gql`
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