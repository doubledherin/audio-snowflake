
module.exports = {
  Query: {
    snowflakeData: async (_, { spotifyId, title, artist }, { dataSources }) => {
      return await dataSources.spotifyWebAPI.getSnowflakeData(spotifyId, title, artist)
    }
  },
  Mutation: {
    authenticate: async (_, __, { dataSources }) => {
      return await dataSources.spotifyAccountsAPI.getAuthToken()
    },
  },
}
