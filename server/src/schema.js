const { gql } = require('apollo-server')

const typeDefs = gql`
  type AudioAnalysis {
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

  type Query {
    audioAnalysis(
      trackId: String
    ): AudioAnalysis
  }

  type Mutation {
    authenticate: String!
  }

`

module.exports = typeDefs
