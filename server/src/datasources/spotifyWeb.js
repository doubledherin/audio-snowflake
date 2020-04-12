const { RESTDataSource } = require('apollo-datasource-rest')

const {
  filterTracksOnArtist,
  sortTracksByPopularity,
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

  async getSnowflakeData({ spotifyId, title: inputTitle, artist: inputArtist }) {
    try {
      spotifyId = spotifyId || await this.getSpotifyId(inputTitle, inputArtist)
    } catch(e) {
      console.log("ERROR, ", e) // TODO
    }
    try {
      const audioAnalysis = await this.getAudioAnalysisBySpotifyId(spotifyId)
      const track = transformTrack(audioAnalysis.track)
      const sections = transformSections(audioAnalysis.sections)
      const { title, artist } = await this.getTitleAndArtistBySpotifyId(spotifyId)
      return {
        artist,
        title,
        track,
        sections,
      }
    } catch(e) {
      console.log("ERRORRRR", e)
    }
  }

  async getSpotifyId(title, artist) {
    if (title && artist) {
      let response = await this.getTracksByTitle(title)
      if (response && response.tracks && (response.tracks.items !== [])) {
        const filtered = filterTracksOnArtist(response.tracks.items, artist)
        const sorted = sortTracksByPopularity(filtered)
        const selectedTrack = sorted[0]
        return selectedTrack.id  
      }
    }
    if (title) {
      let response = await this.getTracksByTitle(title)
      if (response && response.tracks && (response.tracks.items !== [])) {
        const sorted = sortTracksByPopularity(response.tracks.items)
        const selectedTrack = sorted[0]
        return selectedTrack.id  
      }
    }
    if (artist) {
      let response = await this.getTracksByArtist(artist)
      if (response && response.tracks && (response.tracks.items !== [])) {
        const filtered = filterTracksOnArtist(response.tracks.items, artist) // THIS IS NECESSARY BECAUSE SPOTIFY DOESN"T RETURN EXACT HITS< JUST STAETS WTIH
        const sorted = sortTracksByPopularity(filtered)
        const selectedTrack = sorted[0]
        return selectedTrack.id  
      }
    }
    console.log("INPUT ERROR")
  }

  async getTracksByTitle(title) {
    try {
      return await this.get(`search?q=${encodeURIComponent(title)}&type=track`)
    } catch (e) {
      console.log("ERROR", e) // TODO: Read up on Apollo error handling
    }
  }

  async getTracksByArtist(artist) {
    try {
      return await this.get(`search?q=artist:${encodeURIComponent(artist)}&type=track&limit=50 `)
    } catch (e) {
      console.log("ERROR", e) // TODO: Read up on Apollo error handling
    }
  }

  async getTitleAndArtistBySpotifyId(spotifyId) {
    try {
      const response = await this.get(`tracks/${spotifyId}`)
      if (response) {
        const { name: title, artists } = response
        const artist = artists.map(_ => _.name).join(' & ')
        return { title, artist }
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
}

module.exports = SpotifyWebAPI
