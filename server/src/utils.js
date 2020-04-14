const { ApolloError } = require('apollo-server')

const { errors: { trackNotFound, invalidInput } } = require('./constants/errors')

// A track has an array of artists to account for duets, etc.
function trackIncludesArtist(track, artist) {
  if (!track) {
    throw new ApolloError(`${invalidInput}, missing name of track`)
  }
  const includesArtist = track.artists.filter(a => {
    return a.name === artist
  })
  return includesArtist !== undefined && includesArtist.length !== 0
}

function filterTracksOnArtist(tracks, artist) {
  const filtered = tracks.filter(track => {
    return trackIncludesArtist(track, artist)
  })
  if (filtered.length === 0) {
    throw new ApolloError(`${trackNotFound.message} artist: ${artist}`, trackNotFound.code)
  }
  return filtered
}

// Popularity is an int ranging from 100 to 0, with 100 being the most popular
function sortTracksByPopularity(tracks) {
  return tracks.sort((trackA, trackB) => {
    if (trackA.popularity > trackB.popularity) {
      return -1
    }
    if (trackA.popularity < trackB.popularity) {
      return 1
    }
    return 0
  })
}

function transformSections(sections) {
  return sections.map(section => {
    const { key, mode, time_signature: timeSignature } = section

    return {
      key,
      mode,
      timeSignature
    }
  })
}

function transformTrack(track) {
  const {
    duration,
    key,
    loudness,
    name,
    mode,
    tempo,
    time_signature: timeSignature
  } = track

  return {
    duration,
    key,
    loudness,
    mode,
    tempo,
    timeSignature
  }
}

module.exports = { 
  filterTracksOnArtist, 
  sortTracksByPopularity,
  trackIncludesArtist,
  transformSections, 
  transformTrack,
}
