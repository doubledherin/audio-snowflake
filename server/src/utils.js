const { ApolloError } = require('apollo-server')
const { errors: { trackNotFound } } = require('./constants/errors')

const MAX_NUMBER_OF_SECTIONS = 5

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

function sectionsReducer(sections) {
  
  const composed = sections.map(section => {
    return {
      duration: section.duration,
      key: section.key,
      mode: section.mode,
      timeSignature: section.time_signature
    }
  })
  const collapsed = sectionsCollapser(composed)
  const sorted = sortSections(collapsed)
  return sorted.slice(0, MAX_NUMBER_OF_SECTIONS)
}

// Reduces sections that have the same key, mode, and time signature to one section
// with a duration that equals the sum of the collapsed sections' durations.
function sectionsCollapser(sections) {
  const collapsed = [...sections.reduce((result, section) => {
    const key = `${section.key}-${section.mode}-${section.timeSignature}`
    const value = result.get(key) || Object.assign({}, section, { duration: 0 })
    value.duration += section.duration
    return result.set(key, value)
  }, new Map).values()]
  return collapsed
}

// Sorts sections by duration, in descending order
// then removes the 'duration' key, which is no longer needed.
function sortSections(sections) {
  const sorted = sections.sort((sectionA, sectionB) => {
    if (sectionA.duration > sectionB.duration) {
      return -1
    }
    if (sectionA.duration < sectionB.duration) {
      return 1
    }
    return 0
  })
  const withoutDuration = sorted.map(section => {
    delete section.duration
    return section
  })
  return withoutDuration
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
