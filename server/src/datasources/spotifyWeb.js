const { RESTDataSource } = require('apollo-datasource-rest')
const { ApolloError } = require('apollo-server')

const {
  filterTracksOnArtist,
  sortTracksByPopularity,
  transformSections,
  transformTrack
} = require('../utils')

const trackNotFoundMessage = `Unable to find track based on input: `
const trackNotFoundCode = 'TRACK_NOT_FOUND'

const audioAnalysisNotFoundMessage = `Unable to find audio analysis based on spotifyId: `
const audioAnalysisNotFoundCode = 'AUDIO_ANALYSIS_NOT_FOUND'

const invalidInputMessage = `User input must be provided`
const invalidInputCode = 'INVALID_INPUT'

class SpotifyWebAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = 'https://api.spotify.com/v1/'
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token)
  }

  async getSnowflakeData({ spotifyId, title: inputTitle, artist: inputArtist }) {
    spotifyId = spotifyId || await this.getSpotifyId(inputTitle, inputArtist)
    const audioAnalysis = await this.getAudioAnalysisBySpotifyId(spotifyId)
    const { title, artist } = await this.getTitleAndArtistBySpotifyId(spotifyId)
    const track = transformTrack(audioAnalysis.track)
    const sections = transformSections(audioAnalysis.sections)
    return {
      artist,
      title,
      track,
      sections,
    }
  }

  async getSpotifyId(title, artist) {
    if (!title && !artist) {
      throw new ApolloError(invalidInputMessage, invalidInputCode)
    } else {
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
    }
  }

  async getTracksByTitle(title) {
    const { tracks } = await this.get(`search?q=${encodeURIComponent(title)}&type=track`)
    if (!tracks || !tracks.items || tracks.items.length === 0 ) {
      throw new ApolloError(`${trackNotFoundMessage} title: ${title}`, trackNotFoundCode)
    } else {
      return tracks
    }
  }

  async getTracksByArtist(artist) {
    const response = await this.get(`search?q=artist:${encodeURIComponent(artist)}&type=track&limit=50 `)
    if (!response) {
      throw new ApolloError(`${trackNotFoundMessage} artist: ${artist}`, trackNotFoundCode)
    } else {
      return response
    }
  }

  async getTitleAndArtistBySpotifyId(spotifyId) {
    const response = await this.get(`tracks/${spotifyId}`)
    if (!response) {
      throw new ApolloError(`${trackNotFoundMessage} spotifyId: ${spotifyId}`, trackNotFoundCode)
    } else {
      const { name: title, artists } = response
      const artist = artists.map(_ => _.name).join(' & ')
      return { title, artist }
    }
  }

  async getAudioAnalysisBySpotifyId(spotifyId) {
    const response = await this.get(`audio-analysis/${spotifyId}`)
    if (!response) {
      return new ApolloError(`${audioAnalysisNotFoundMessage} spotifyId: ${spotifyId}`, audioAnalysisNotFoundCode)
    }
    const { track: spotifyTrack, sections: spotifySections } = response
    return await this.transformAudioAnalysis(spotifyId, spotifyTrack, spotifySections)  
  }

  async transformAudioAnalysis(spotifyId, spotifyTrack, spotifySections) {
    const response = await this.getTitleAndArtistBySpotifyId(spotifyId)
    const  { title, artist } = response
    const track = transformTrack(spotifyTrack)
    const sections = transformSections(spotifySections)

    return {
      artist,
      title,
      track,
      sections,
    }
  }
}

module.exports = SpotifyWebAPI
