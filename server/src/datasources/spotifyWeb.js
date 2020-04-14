const { RESTDataSource } = require('apollo-datasource-rest')
const { ApolloError } = require('apollo-server')

const { errors: { trackNotFound, audioAnalysisNotFound, invalidInput } } = require('../constants/errors')
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
      throw new ApolloError(`${invalidInput.message}, title and/or artist must be provided if no spotifyId is provided`, invalidInput.code)
    } else {
      const response = await (title ? filterTracksOnArtist(this.getTracksByTitle(title), artist) : this.getTracksByArtist(artist))
      if (!response || !response.items || response.items.length === 0) {
        throw new ApolloError(`${trackNotFound} title: ${title}, artist: ${artist}`)
      }
      const tracks = response.items
      const track = this.selectTrack(tracks, artist)
      return track.id  
    }
  }

  selectTrack(tracks, artist) {
    const track = sortTracksByPopularity(filterTracksOnArtist(tracks, artist))[0]
    return track
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

  async getAudioAnalysisBySpotifyId(spotifyId) {
    const response = await this.get(`audio-analysis/${spotifyId}`)
    if (!response) {
      return new ApolloError(`${audioAnalysisNotFound.message} spotifyId: ${spotifyId}`, audioAnalysisNotFound.code)
    }
    return response
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
