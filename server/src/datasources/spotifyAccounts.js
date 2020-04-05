const { RESTDataSource } = require('apollo-datasource-rest');

class SpotifyAccountsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://accounts.spotify.com/api/';

  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token)
    request.headers.set('Content-Type', 'application/x-www-form-urlencoded')
    request.headers.set('Accept', 'application/json')
  }

  async getAuthToken() {
    this.post('token', { grantType: 'client_credentials' })
  }
}

module.exports = SpotifyAccountsAPI;