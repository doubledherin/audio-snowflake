
module.exports = {
  Query: {
    audioAnalysis: async (_, { trackId }, { dataSources }) => {
      return await dataSources.spotifyWebAPI.getAudioAnalysis({ trackId })
    }
  },
  Mutation: {
    authenticate: async (_, __, { dataSources }) => {
      return await dataSources.spotifyAccountsAPI.getAuthToken();
    },
  },
}