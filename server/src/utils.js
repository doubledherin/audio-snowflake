const { ApolloError } = require('apollo-server')
const { errors: { trackNotFound } } = require('./constants/errors')

// TODO: TEST THIS
function selectTrack(tracks, title, artist) {
  return sortTracksByPopularity(filterTracksOnArtist(tracks, title, artist))[0]
}

// A track has an array of artists to account for duets, etc.
function trackIncludesArtist(track, artist) {
  const includesArtist = track.artists.filter(a => {
    return a.name === artist
  })
  return includesArtist !== undefined && includesArtist.length !== 0
}

function filterTracksOnArtist(tracks, title, artist) {
  if (!artist) {
    return tracks
  }
  const filtered = tracks.filter(track => {
    return trackIncludesArtist(track, artist)
  })
  if (filtered.length === 0) {
    throw new ApolloError(`${trackNotFound.message} matching title: ${title} and artist: ${artist}`, trackNotFound.code)
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

// Extracts the key, mode, and time signature
// Dedupes and takes the 5 with the longest combined duration
function sectionsReducer(sections) {
  const reduced = sections.map(section => {
    const { duration, key, mode, time_signature: timeSignature } = section

    return {
      key,
      mode,
      timeSignature
    }
  })
  const collapsed = sectionsCollapser(sections)
  return reduced
}

function sectionsCollapser(sections) {
  const collapsed = sections
  return collapsed
}

function snowflakeDataReducer(track, audioAnalysis, audioFeatures) {
  return {
    artist: track.artists.map(_ => _.name).join(' & '),
    duration: audioAnalysis.track.duration,
    energy: audioFeatures.energy,
    key: audioAnalysis.track.key,
    loudness: audioAnalysis.track.loudness,
    mode: audioAnalysis.track.mode,
    spotifyId: track.id,
    tempo: audioAnalysis.track.tempo,
    timeSignature: audioAnalysis.track.time_signature,
    title: track.name,
    sections: sectionsReducer(audioAnalysis.sections),
    valence: audioFeatures.valence
  }
}

module.exports = {
  sectionsReducer,
  selectTrack,
  filterTracksOnArtist,
  snowflakeDataReducer,
  sortTracksByPopularity,
  trackIncludesArtist,
}
