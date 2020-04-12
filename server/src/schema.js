const { gql } = require('apollo-server')

const typeDefs = gql`
  type SnowflakeData {
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
    snowflakeData(input: SnowflakeInput): SnowflakeData
  }

  type Mutation {
    authenticate: String!
  }

`

module.exports = typeDefs
