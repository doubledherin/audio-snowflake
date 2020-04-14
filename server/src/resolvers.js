
module.exports = {
  Query: {
    snowflakeData: async (_, { input }, { dataSources }) => {
      try {
        const snowflakeData = await dataSources.spotifyWebAPI.getSnowflakeData(input)
        return {
          __typename: "SnowflakeData",
          ...snowflakeData
        }
      } catch(e) {
        if (e.extensions) {
          const { message } = e
          const { code } = e.extensions
          switch (code) {
            case "TRACK_NOT_FOUND":
              return {
                __typename: "TrackNotFoundError",
                message,
                code
              }
            break
            case "AUDIO_ANALYSIS_NOT_FOUND":
              return {
                __typename: "AudioAnalysisNotFoundError",
                message,
                code
              }
            break
            case "INVALID_INPUT":
              return {
                __typename: "InvalidInputError",
                message,
                code
              }
            break
            default:
              return e
          }
        } else {
          return e
        }
      }
    }
  },
  Mutation: {
    authenticate: async (_, __, { dataSources }) => {
      return await dataSources.spotifyAccountsAPI.getAuthToken()
    },
  },
}
