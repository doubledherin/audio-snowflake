
module.exports = {
  Query: {
    audioAnalysis: async (_, { spotifyId, title, artist }, { dataSources }) => {
      return await dataSources.spotifyWebAPI.getAudioAnalysis(spotifyId, title, artist)
    },
    audioAnalysisBySpotifyId: async (_, { spotifyId }, { dataSources }) => {
      return await dataSources.spotifyWebAPI.getAudioAnalysisBySpotifyId(spotifyId)
    }
  },
  Mutation: {
    authenticate: async (_, __, { dataSources }) => {
      return await dataSources.spotifyAccountsAPI.getAuthToken()
    },
  },
}
