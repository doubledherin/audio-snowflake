const { RESTDataSource } = require('apollo-datasource-rest')

const {
  filterTracksOnArtist,
  sortFilteredTracksByPopularity,
  transformSections,
  transformTrack
} = require('../utils')

class SpotifyWebAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = 'https://api.spotify.com/v1/'
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token)
  }

  async getTracksByTitle(title) {
    try {
      const response = await this.get(`search?q=${encodeURIComponent(title)}&type=track`)
      return response
    } catch (e) {
      console.log("ERROR", e) // TODO: Read up on Apollo error handling
    }
  }

  async getTitleAndArtistBySpotifyId(spotifyId) {
    try {
      const response = await this.get(`tracks/${spotifyId}`)
      if (response) {
        const { name: title, artists } = response
        return { title, artist: artists.map(_ => _.name).join(' & ') }
      } else {
        console.log("NO RESULTS FOR THAT SPOTIFY ID") // TODO: Read up on Apollo error handling
      }
    } catch(e) {
      console.log("ERROR!", e) // TODO: Read up on Apollo error handling
    }
  }

  async getAudioAnalysisBySpotifyId(spotifyId) {
    try {
      const {
        track: spotifyTrack,
        sections: spotifySections
      } = await this.get(`audio-analysis/${spotifyId}`)

      if (!spotifyTrack) {
        console.log("ERROR: COULD NOT FIND A TRACK for SPOTIFY ID: ", spotifyId)  // TODO: Read up on Apollo error handling
      }

      return await this.transformAudioAnalysis(spotifyId, spotifyTrack, spotifySections)

    } catch(e) {
      console.log("ERROR", e) // TODO: Read up on Apollo error handling
    }
  }

  async transformAudioAnalysis(spotifyId, spotifyTrack, spotifySections) {
    try {
      const { title, artist } = await this.getTitleAndArtistBySpotifyId(spotifyId)
      const track = transformTrack(spotifyTrack)
      const sections = transformSections(spotifySections)
  
      return {
        artist,
        title,
        track,
        sections,
      }
      } catch(e) {
      console.log("ERROR", e)  // TODO: Read up on Apollo error handling
    }
  }

  //TO DO: ADD Album
  async getAudioAnalysis(spotifyId, title, artist) {
    if (spotifyId) {
      return this.getAudioAnalysisBySpotifyId(spotifyId)
    } else {
      let response = await this.getTracksByTitle(title)
      if (response && response.tracks && (response.tracks.items !== [])) {
        const filtered = filterTracksOnArtist(response.tracks.items, artist)
        const sorted = sortFilteredTracksByPopularity(filtered)
        const selectedTrack = sorted[0]
        const spotifyId = selectedTrack.id
        try {
          const { title, artist } = await this.getAudioAnalysisBySpotifyId(spotifyId)
        } catch(e) {
          console.log("GOTTA HANDLE THIS")
        }
        try {
          const {
            track: spotifyTrack,
            sections: spotifySections
          } = await this.get(`audio-analysis/${spotifyId}`)
          const track = transformTrack(spotifyTrack)
          const sections = transformSections(spotifySections)
          return {
            artist,
            title,
            track,
            sections,
          }
        } catch(e) {
          console.log("ERROR", e) // TODO: Read up on Apollo error handling
        }
      } else {
        console.log("COULD NOT FIND SONGS TO MATCH INPUT") // TODO: Handle this
      }
    }
  }
}

module.exports = SpotifyWebAPI
