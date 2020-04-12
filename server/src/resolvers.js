
module.exports = {
  Query: {
    snowflakeData: async (_, { input }, { dataSources }) => {
      const snowflakeData = await dataSources.spotifyWebAPI.getSnowflakeData(input)
      if (snowflakeData) {
        return {
          __typename: "SnowflakeData",
          ...snowflakeData
        }
      }
      return {
        __typename: "TrackNotFoundError",
        message: `Could not find a Spotify track with the following input: spotifyId ${input.spotifyId}, title ${input.title}, artist ${input.artist}`
      }
    }
  },
  Mutation: {
    authenticate: async (_, __, { dataSources }) => {
      return await dataSources.spotifyAccountsAPI.getAuthToken()
    },
  },
}
