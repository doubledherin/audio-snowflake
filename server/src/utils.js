function trackIncludesArtist(track, artist) {
  const includesArtist = track.artists.filter(a => {
    return a.name === artist
  })
  return includesArtist !== undefined && includesArtist.length !== 0
}

function filterTracksOnArtist(tracks, artist) {
  return tracks.filter(track => {
    return trackIncludesArtist(track, artist)
  })
}

function sortFilteredTracksByPopularity(filteredTracks) {
  return filteredTracks.sort(comparePopularity)
}

function comparePopularity(trackA, trackB) {
  if (trackA.popularity > trackB.popularity) {
    return -1
  }
  if (trackA.popularity < trackB.popularity) {
    return 1
  }
  return 0
}

function transformSections(spotifySections) {
  return spotifySections.map(section => {
    const { key, mode, time_signature: timeSignature } = section

    return {
      key,
      mode,
      timeSignature
    }
  })
}

function transformTrack(spotifyTrack) {
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

module.exports = { 
  filterTracksOnArtist, 
  sortFilteredTracksByPopularity,
  transformSections, 
  transformTrack
}

