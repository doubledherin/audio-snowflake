require('dotenv').config()
const { ApolloServer, AuthenticationError } = require('apollo-server')
const typeDefs = require('./schema')
const resolvers = require('./resolvers');
const SpotifyAccountsAPI = require('./datasources/spotifyAccounts')
const SpotifyWebAPI = require('./datasources/spotifyWeb')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    spotifyAccountsAPI: new SpotifyAccountsAPI(),
    spotifyWebAPI: new SpotifyWebAPI()
  }),
  context: () => {
    return {
      token: `Bearer ${process.env.SPOTIFY_TOKEN}`,
    };
  },
 })

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});