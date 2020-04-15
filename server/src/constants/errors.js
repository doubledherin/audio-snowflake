const errors = {
  trackNotFound: {
    message: `Unable to find track`,
    code: 'TRACK_NOT_FOUND'
  },
  audioAnalysisNotFound: {
    message: `Unable to find audio analysis`,
    code: 'AUDIO_ANALYSIS_NOT_FOUND'
  },
  invalidInput: {
    message: `User input must be provided`,
    code: 'INVALID_INPUT'
  }
}

module.exports = { errors }
