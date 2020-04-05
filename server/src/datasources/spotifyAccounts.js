const { RESTDataSource } = require('apollo-datasource-rest')

class SpotifyAccountsAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = 'https://accounts.spotify.com/'
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.getCredentials())
    request.headers.set('Content-Type', 'application/x-www-form-urlencoded')
    request.headers.set('Accept', 'application/json')
  }

  getCredentials() {
    const credentials = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    const encodedCredentials = Buffer.from(credentials).toString('base64')
    return `Basic ${encodedCredentials}`
  }

  async getAuthToken() {
    const { access_token } = await this.post('api/token', 'grant_type=client_credentials')
    return access_token
  }
}

module.exports = SpotifyAccountsAPI
