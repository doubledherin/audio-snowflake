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
    const track = selectTrack(tracks.items, artist)
    return track.id  
  }

  //TODO: Write generic function to handle all empty responses from Spotify
  async getTracks(title, artist) {
    let tracks
    if (title) {
      tracks = await this.getTracksByTitle(title)
    } else if (artist) {
      tracks = await this.getTracksByArtist(artist)
    } else {
      throw new ApolloError(`${invalidInput.message}, title and/or artist must be provided if no spotifyId is provided`, invalidInput.code)
    }
    if (!tracks || !tracks.items || tracks.items.length === 0) {
      throw new ApolloError(`${trackNotFound} title: ${title}, artist: ${artist}`)
    } else {
      return tracks
    }
  }

  async getTracksByTitle(title) {
    const { tracks } = await this.get(`search?q=${encodeURIComponent(title)}&type=track`)
    if (!tracks || !tracks.items || tracks.items.length === 0 ) {
      throw new ApolloError(`${trackNotFound.message} title: ${title}`, trackNotFound.code)
    } else {
      return tracks
    }
  }

  async getTracksByArtist(artist) {
    const response = await this.get(`search?q=artist:${encodeURIComponent(artist)}&type=track&limit=50 `)
    if (!response) {
      throw new ApolloError(`${trackNotFound.message} artist: ${artist}`, trackNotFound.code)
    } else {
      return response
    }
  }

  async getTrackBySpotifyId(spotifyId) {
    const response = await this.get(`tracks/${spotifyId}`)
    if (!response) { /// check what actual resonse would be TODO
      throw new ApolloError(`${trackNotFound.message} spotifyId: ${spotifyId}`, trackNotFound.code)
    } else {
      return response
    }
  }


  async getTitleAndArtistBySpotifyId(spotifyId) {
    const response = await this.get(`tracks/${spotifyId}`)
    if (!response) {
      throw new ApolloError(`${trackNotFound.message} spotifyId: ${spotifyId}`, trackNotFound.code)
    } else {
      const { name: title, artists } = response
      const artist = artists.map(_ => _.name).join(' & ')
      return { title, artist }
    }
  }

  async getAudioAnalysis(spotifyId) {
    const response = await this.get(`audio-analysis/${spotifyId}`)
    if (!response) {
      return new ApolloError(`${audioAnalysisNotFound.message} spotifyId: ${spotifyId}`, audioAnalysisNotFound.code)
    }
    return response
  }
}

module.exports = SpotifyWebAPI
