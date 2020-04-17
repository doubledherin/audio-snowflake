const { ApolloError } = require('apollo-server')
const { errors: { trackNotFound } } = require('../constants/errors')

const { 
  trackIncludesArtist, 
  filterTracksOnArtist,
  snowflakeDataReducer,
  sortTracksByPopularity,
  sectionsReducer
 } = require('../utils')
const { tracks, audioAnalysisOfEvil, audioFeaturesOfEvil, snowflakeDataOfEvil } = require('./__fixtures')
const { mrBrightside, onTop, midnightShow, evil, nextExit } = tracks

describe("The 'trackIncludesArtist' function", () => {
  const track = mrBrightside
  const artistTrue = "The Killers"
  const artistFalse = "Interpol"

  test("returns 'true' when track includes artist", () => {
    expect(trackIncludesArtist(track, artistTrue)).toBe(true)
  }) 

  test("returns 'false' when track does not include artist", () => {
    expect(trackIncludesArtist(track, artistFalse)).toBe(false)
  })
  
  test("returns 'false' when 'artist' is undefined", () => {
    expect(trackIncludesArtist(track, undefined)).toBe(false)
  })

  test("returns 'false' when 'artist' is null", () => {
    expect(trackIncludesArtist(track, null)).toBe(false)
  })
})


describe("The 'filterTracksOnArtist' function", () => {
  test("returns a filtered list of tracks that match the artist", () => {
    const title = 'foo'
    const tracks = [mrBrightside, onTop, midnightShow, evil, nextExit]
    const artist = 'Interpol'
    const actual = filterTracksOnArtist(tracks, title, artist)
    const expected = [ evil, nextExit ]
    expect(actual).toEqual(expected)  
  })

  test("throws a TrackNotFound error when no matching artists are found", () => {
    const title = 'foo'
    const tracks = [mrBrightside, onTop, midnightShow, evil, nextExit]
    const artist = 'Pixies'
    expect(() => {
      filterTracksOnArtist(tracks, title, artist)
    }).toThrow(new ApolloError(`${trackNotFound.message} matching title: ${title} and artist: ${artist}`, trackNotFound.code))  
  })

  test("returns the tracks unfiltered when 'artist' is undefined", () => {
    const title = 'foo'
    const tracks = [mrBrightside, onTop, midnightShow, evil, nextExit]
    const artist = undefined
    const actual = filterTracksOnArtist(tracks, title, artist)
    const expected = tracks
    expect(actual).toEqual(expected)  
  })
})


describe("The 'sortTracksByPopularity' function", () => {
  test("returns the tracks sorted by popularity", () => {
    const tracks = [onTop, midnightShow, mrBrightside]
    const actual = sortTracksByPopularity(tracks)
    const expected = [mrBrightside, onTop, midnightShow]
    expect(actual).toEqual(expected)
  })

  test("handles the case when two tracks have the same popularity rating", () => {
    const tracks = [onTop, onTop, mrBrightside]
    const actual = sortTracksByPopularity(tracks)
    const expected = [mrBrightside, onTop, onTop]
    expect(actual).toEqual(expected)
  })

  test("returns an empty list when the original list is empty", () => {
    const tracks = []
    const actual = sortTracksByPopularity(tracks)
    const expected = []
    expect(actual).toEqual(expected)
  })
})

describe('[SpotifyWebAPI.snowflakeDataReducer]', () => {
  it('properly transforms a track and its audio analysis into snowflake data', () => {
    expect(snowflakeDataReducer(evil, audioAnalysisOfEvil, audioFeaturesOfEvil)).toEqual(snowflakeDataOfEvil)
  })
})


describe("The 'sectionsReducer' function", () => {
  test("works as expected", () => {
    const actual = sectionsReducer(audioAnalysisOfEvil.sections)
    const expected = snowflakeDataOfEvil.sections
    expect(actual).toEqual(expected)
  })
})
