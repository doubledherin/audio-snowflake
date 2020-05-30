import * as _ from './constants'

// Takes a number n, sets its bounds within current range [a, b ] and scales it according to the desired range [c, d]
function scale(n, a, b, c, d) {
  return c * (1 - ((n - a) / (b - a))) + d * (((n - a) / (b - a)))
}

function setBounds(n, start, stop) {
  return (n < start) ? start : ((n > stop) ? stop : n)
}

export function getHypotrochoid(trackDuration, trackEnergy, trackValence, section) {
  const { statorRadius, rotorRadius, penDistance } = getGeometricValues(trackDuration, section)
  const { hue, saturation, brightness, opacity } = getStrokeValues(trackEnergy, trackValence, section)
  return {
    statorRadius,
    rotorRadius,
    penDistance,
    hue,
    saturation,
    brightness,
    opacity
  }
}

function getGeometricValues(trackDuration, section) {
  // Adjusts the track duration according to a constant min/max range, then scales it to a constant min/max stator-radius range
  const adjustedTrackDuration = setBounds(trackDuration, _.minTrackDuration,  _.maxTrackDuration)
  const statorRadius = scale(adjustedTrackDuration,  _.minTrackDuration,  _.maxTrackDuration,  _.minStatorRadius,  _.maxStatorRadius)

  // Adjusts the section duration according to a constant min/max range, then scales it to a constant min/max rotor-radius range
  const maxSectionDuration = adjustedTrackDuration -  _.minDiffBetweenMaxTrackDurationAndMaxSectionDuration
  const adjustedSectionDuration = setBounds(section.duration,  _.minSectionDuration,  maxSectionDuration)
  const rotorRadius = scale(adjustedSectionDuration,  _.minSectionDuration,  maxSectionDuration,  _.minRotorRadius,  _.maxRotorRadius)
  
  const penDistance = statorRadius - rotorRadius
  
  return { statorRadius, rotorRadius, penDistance }
}


function getStrokeValues(trackEnergy, trackValence, section) {
  // Scales the key to a constant min/max hue range
  const hue = scale(section.key, _.minSectionKey, _.maxSectionKey, _.minHue, _.maxHue)

  // Scales the sum of energy and valence to a constant min/max saturation range
  const energyPlusValence = trackEnergy + trackValence
  const saturation = scale(energyPlusValence, _.minSumOfEnergyAndValence, _.maxSumOfEnergyAndValence, _.minSaturation, _.maxSaturation)

  const brightness = _.maxBrightness

  // Scales the loudness to a constant min/max opacity range
  const adjustedOpacity = setBounds(section.loudness, _.minLoudness, _.maxLoudness)
  const opacity = scale(adjustedOpacity, _.minLoudness, _.maxLoudness, _.minOpacity, _.maxOpacity)
  
  return { hue, saturation, brightness, opacity }
}
