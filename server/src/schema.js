const { gql } = require('apollo-server')

const typeDefs = gql`
  type AudioAnalysis {
    artist: String
    title: String
    track: Track
    sections: [Section]
  }

  type Track {
    duration: Float
    key: Int
    mode: Int
    loudness: Float
    tempo: Float
    timeSignature: Int
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

  type Query {
    snowflakeData(input: SnowflakeInput): AudioAnalysis
  }

  type Mutation {
    authenticate: String!
  }

`

module.exports = typeDefs
