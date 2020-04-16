const { gql } = require('apollo-server')

// TODO: Make sure schema aligns with old model and put everything at the same level:

// track.song_id = song_data["song_id"]
// track.key = song_data["key"]
// track.title = song_data["title"]
// track.tempo = song_data["tempo"]
// track.energy = song_data["energy"]
// track.artist_name = song_data["artist_name"]
// track.mode = song_data["mode"]
// track.time_signature = song_data["time_signature"]
// track.duration = song_data["duration"]
// track.loudness = song_data["loudness"]
// track.artist_id = song_data["artist_id"]
// track.valence = song_data["valence"]
// track.audio_md5 = song_data["audio_md5"]
// track.spotify_track_uri = song_data["spotify_track_uri"]
// track.patterns = patterns_json
// track.sections = sections_json
// track.rotation_duration = song_data["rotation_duration"] // FIGURE OUT HOW THIS IS CALCULATED
        
const typeDefs = gql`
  type SnowflakeData {
    artist: String
    spotifyId: String
    title: String
    duration: Float
    key: Int
    mode: Int
    loudness: Float
    tempo: Float
    timeSignature: Int
    sections: [Section]
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
