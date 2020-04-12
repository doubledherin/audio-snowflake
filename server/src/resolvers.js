
module.exports = {
  Query: {
    snowflakeData: async (_, { input }, { dataSources }) => {
      return await dataSources.spotifyWebAPI.getSnowflakeData(input)
    }
  },
  Mutation: {
    authenticate: async (_, __, { dataSources }) => {
      return await dataSources.spotifyAccountsAPI.getAuthToken()
    },
  },
}
