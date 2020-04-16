const { gql } = require('apollo-server')

// TODO: Make sure schema aligns with old model and put everything at the same level:

// track.artist_id = song_data["artist_id"]
// track.audio_md5 = song_data["audio_md5"]
// track.patterns = patterns_json
// track.rotation_duration = song_data["rotation_duration"] // FIGURE OUT HOW THIS IS CALCULATED BUT DO IT ON THE FRONT END
        
const typeDefs = gql`
  type SnowflakeData {
    artist: String
    spotifyId: String
    title: String
    duration: Float
    energy: Float
    key: Int
    mode: Int
    loudness: Float
    tempo: Float
    timeSignature: Int
    sections: [Section]
    valence: Float
  }

  type Section {
    key: Int
    mode: Int
    timeSignature: Int
  }

  input SnowflakeInput {
    spotifyId: String
    title: String
    artist: String
  }

  interface Error {
    message: String!
  }

  type TrackNotFoundError implements Error {
    message: String!
    code: String!
  }

  type AudioAnalysisNotFoundError implements Error {
    message: String!
    code: String!
  }

  type InvalidInputError implements Error {
    message: String!
    code: String!
  }

  union SnowflakeDataResult = SnowflakeData | TrackNotFoundError | AudioAnalysisNotFoundError | InvalidInputError

  type Query {
    snowflakeData(input: SnowflakeInput): SnowflakeDataResult!
  }

  type Mutation {
    authenticate: String!
  }

`

module.exports = typeDefs
