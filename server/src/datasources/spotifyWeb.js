// TODO: Add error handling with try catches

const { RESTDataSource } = require('apollo-datasource-rest');

class SpotifyWebAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.spotify.com/v1/';
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token)
  }

  async getAudioAnalysis(trackId) {
    try {
      const {
        track: spotifyTrack,
        sections: spotifySections
      } = await this.get(`audio-analysis/${trackId.trackId}`)
      const track = this.transformTrack(spotifyTrack)
      const sections = this.transformSections(spotifySections)
      
      return { 
        track,
        sections,
      }
    } catch(e) {
      console.log("ERROR", e) // TODO: Read up on Apollo error handling
    }
  }

  transformSections(spotifySections) {
    return spotifySections.map(section => {
      const { key, mode, time_signature: timeSignature } = section

      return {
        key,
        mode,
        timeSignature
      }
    })
  }

  transformTrack(spotifyTrack) {
    const {
      duration,
      key,
      loudness,
      mode,
      tempo,
      time_signature: timeSignature
    } = spotifyTrack

    return {
      duration,
      key,
      loudness,
      mode,
      tempo,
      timeSignature
    }
  }
}

module.exports = SpotifyWebAPI;