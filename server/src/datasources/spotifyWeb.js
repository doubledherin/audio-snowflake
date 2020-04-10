const { RESTDataSource } = require('apollo-datasource-rest')

class SpotifyWebAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = 'https://api.spotify.com/v1/'
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token)
  }

  async searchTracksByTitle(title) {
    try {
      const response = await this.get(`search?q=${encodeURIComponent(title)}&type=track`)
      return response
    } catch (e) {
      console.log("ERROR", e) // TODO: Read up on Apollo error handling
    }
  }

  filterTracksOnArtist(tracks, artist) {
    return tracks.filter(track => {
      return this.trackIncludesArtist(track, artist)
    })
  }

  trackIncludesArtist(track, artist) {
    const includesArtist = track.artists.filter(a => {
      return a.name === artist
    })
    return includesArtist !== undefined && includesArtist.length !== 0
  }

  sortFilteredTracksByPopularity(filteredTracks) {
    return filteredTracks.sort(this.comparePopularity)
  }

  comparePopularity(trackA, trackB) {
    if (trackA.popularity > trackB.popularity) {
      return -1
    }
    if (trackA.popularity < trackB.popularity) {
      return 1
    }
    return 0
  }


  async getAudioAnalysis(title, artist) {
    let response = await this.searchTracksByTitle(title)
    const filtered = this.filterTracksOnArtist(response.tracks.items, artist)
    const sorted = this.sortFilteredTracksByPopularity(filtered)
    const selectedTrack = sorted[0]
    const spotifyId = selectedTrack.id
    try {
      const {
        track: spotifyTrack,
        sections: spotifySections
      } = await this.get(`audio-analysis/${spotifyId}`)
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
      name,
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

module.exports = SpotifyWebAPI
