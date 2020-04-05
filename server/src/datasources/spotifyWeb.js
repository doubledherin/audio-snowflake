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
      const { track, sections: spotifySections } = await this.get(`audio-analysis/${trackId.trackId}`)
      const {
        duration,
        key,
        loudness,
        mode,
        tempo,
        time_signature: timeSignature
      } = track
      const sections = this.transformSections(spotifySections)
      
      return { 
        track : {
          duration,
          key,
          loudness,
          mode,
          tempo,
          timeSignature
        },
        sections,
      }
    } catch(e) {
      console.log("ERROR", e) // TODO: Read up on Apollo error handling
    }
  }

  transformSections(sections) {
    return sections.map(section => {
      const { key, mode, time_signature: timeSignature } = section 
      return {
        key,
        mode,
        timeSignature
      }
    })
  }
}

module.exports = SpotifyWebAPI;