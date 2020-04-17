// Takes a number n, sets its bounds within current range [a, b ] and scales it according to the desired range [c, d]
function scale(n, a, b, c, d) {
  return c * (1 - ((n - a) / (b - a))) + d * (((n - a) / (b - a)))
}

function setBounds(n, start, stop) {
  return (n < start) ? start : ((n > stop) ? stop : n)
}

function getHypotrochoid(trackDuration, trackEnergy, trackValence, section) {

  const MIN_TRACK_DURATION = 100
  const MAX_TRACK_DURATION = 600
  const MIN_STATOR_RADIUS = 500
  const MAX_STATOR_RADIUS = 900

  const MIN_SECTION_DURATION = 5
  const MIN_DIFF_BETWEEN_MAX_TRACK_DURATION_AND_MAX_SECTION_DURATION = 10
  const MIN_ROTOR_RADIUS = 275
  const MAX_ROTOR_RADIUS = 675

  const MIN_SECTION_KEY = 0
  const MAX_SECTION_KEY = 11
  const MIN_HUE = 0
  const MAX_HUE = 330

  const MIN_SUM_OF_ENERGY_AND_VALENCE = 0  // Energy and valence are each scales of 0 to 1, so the max sum of the two is 2
  const MAX_SUM_OF_ENERGY_AND_VALENCE = 2
  const MIN_SATURATION = 0
  const MAX_SATURATION = 40 // 40 for aesthetics

  const MIN_LOUDNESS = -20
  const MAX_LOUDNESS = 0
  const MIN_OPACITY = 0.5
  const MAX_OPACITY = 1.0
  const adjustedTrackDuration = setBounds(trackDuration, MIN_TRACK_DURATION, MAX_TRACK_DURATION)
  const statorRadius = scale(adjustedTrackDuration, MIN_TRACK_DURATION, MAX_TRACK_DURATION, MIN_STATOR_RADIUS, MAX_STATOR_RADIUS)
  const maxSectionDuration = adjustedTrackDuration - MIN_DIFF_BETWEEN_MAX_TRACK_DURATION_AND_MAX_SECTION_DURATION
  const adjustedSectionDuration = setBounds(section.duration, MIN_SECTION_DURATION, maxSectionDuration)
  const rotorRadius = scale(adjustedSectionDuration, MIN_SECTION_DURATION, maxSectionDuration, MIN_ROTOR_RADIUS, MAX_ROTOR_RADIUS)

  const distanceFromRotorCenter = statorRadius - rotorRadius

  const hue = scale(section.key, MIN_SECTION_KEY, MAX_SECTION_KEY, MIN_HUE, MAX_HUE)
  const energyPlusValence = trackEnergy + trackValence
  const saturation = scale(energyPlusValence, MIN_SUM_OF_ENERGY_AND_VALENCE, MAX_SUM_OF_ENERGY_AND_VALENCE, MIN_SATURATION, MAX_SATURATION)

  const adjustedOpacity = setBounds(section.loudness, MIN_LOUDNESS, MAX_LOUDNESS)
  const opacity = scale(adjustedOpacity, MIN_LOUDNESS, MAX_LOUDNESS, MIN_OPACITY, MAX_OPACITY)

  return {
    statorRadius,
    rotorRadius,
    distanceFromRotorCenter,
    hue,
    saturation,
    opacity
  }
}

module.exports = { scale, setBounds, getHypotrochoid }