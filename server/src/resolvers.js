
module.exports = {
  Query: {
    audioAnalysis: async (_, { title, artist }, { dataSources }) => {
      return await dataSources.spotifyWebAPI.getAudioAnalysis(title, artist)
    }
  },
  Mutation: {
    authenticate: async (_, __, { dataSources }) => {
      return await dataSources.spotifyAccountsAPI.getAuthToken()
    },
  },
}
