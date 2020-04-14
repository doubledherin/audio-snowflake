const errors = {
  trackNotFound: {
    message: `Unable to find track based on input: `,
    code: 'TRACK_NOT_FOUND'
  },
  audioAnalysisNotFound: {
    message: `Unable to find track based on input: `,
    code: 'AUDIO_ANALYSIS_NOT_FOUND'
  },
  invalidInput: {
    message: `User input must be provided`,
    code: 'INVALID_INPUT'
  }
}

module.exports = { errors }
