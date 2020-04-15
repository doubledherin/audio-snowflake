const { RESTDataSource } = require('apollo-datasource-rest')
const { ApolloError } = require('apollo-server')

const { 
  errors: { 
    trackNotFound, 
    audioAnalysisNotFound, 
    invalidInput 
  } 
} = require('../constants/errors')
const {
  selectTrack,
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

  async getSnowflakeData({ spotifyId, title, artist }) {
    spotifyId = spotifyId || await this.getSpotifyId(title, artist)
    const track = await this.getTrackBySpotifyId(spotifyId)
    const audioAnalysis = await this.getAudioAnalysis(track.id)
    return this.snowflakeDataReducer(track, audioAnalysis)
  }

  snowflakeDataReducer(track, audioAnalysis) {
    return {
      artist: track.artists.map(_ => _.name).join(' & '),
      title: track.name,
      track: transformTrack(audioAnalysis.track),
      sections: transformSections(audioAnalysis.sections)
    }
  }

  async getSpotifyId(title, artist) {
    const tracks = await this.getTracks(title, artist)
    const track = selectTrack(tracks.items, title, artist)
    return track.id  
  }

  //TODO: Write generic function to handle all empty responses from Spotify
  async getTracks(title, artist) {
    if (!title && !artist) {
      throw new ApolloError(
        `${invalidInput.message}`,
        invalidInput.code
      )
    } else {
      let tracks
      if (title) {
        const response = await this.getTracksByTitle(title)
        tracks = response.tracks
      } else if (artist) {
        const response = await this.getTracksByArtist(artist)
        tracks = response.tracks
      } 
      if (!tracks || !tracks.items || tracks.items.length === 0) {
        throw new ApolloError(`${trackNotFound.message} matching title: ${title} and artist: ${artist}`, trackNotFound.code)
      } else {
        return tracks
      }  
    }
  }

  async getTracksByTitle(title) {
    return await this.get(`search?q=${encodeURIComponent(title)}&type=track`)
  }

  async getTracksByArtist(artist) {
    return await this.get(`search?q=artist:${encodeURIComponent(artist)}&type=track&limit=50 `)
  }

  async getTrackBySpotifyId(spotifyId) {
    const response = await this.get(`tracks/${spotifyId}`)
    if (!response) { /// check what actual resonse would be TODO
      throw new ApolloError(`${trackNotFound.message} matching spotifyId: ${spotifyId}`, trackNotFound.code)
    } else {
      return response
    }
  }


  async getAudioAnalysis(spotifyId) {
    const response = await this.get(`audio-analysis/${spotifyId}`)
    if (!response) {
      return new ApolloError(`${audioAnalysisNotFound.message} based on spotifyId: ${spotifyId}`, audioAnalysisNotFound.code)
    }
    return response
  }
}

module.exports = SpotifyWebAPI
