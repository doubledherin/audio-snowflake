const { trackIncludesArtist, filterTracksOnArtist } = require('../utils');
const { tracks } = require('../__fixtures')
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

  test("throws a TypeError when 'track' is undefined", () => {
    expect(() => {
      trackIncludesArtist(undefined, artistTrue)
    }).toThrow(TypeError)
  })

  test("throws a TypeError when 'track' is null", () => {
    expect(() => {
      trackIncludesArtist(null, artistTrue)
    }).toThrow(TypeError)
  })
})

describe("The 'filterTracksOnArtist' function", () => {
  test("returns a filtered list of tracks that match the artist", () => {
    const tracks = [mrBrightside, onTop, midnightShow, evil, nextExit]
    const artist = 'Interpol'
    const actual = filterTracksOnArtist(tracks, artist)
    const expected = [ evil, nextExit ]
    expect(actual).toEqual(expected)  
  })

  test("returns an empty list when no matching artists are found", () => {
    const tracks = [mrBrightside, onTop, midnightShow, evil, nextExit]
    const artist = 'Pixies'
    const actual = filterTracksOnArtist(tracks, artist)
    const expected = []
    expect(actual).toEqual(expected)  
  })

  test("returns an empty list when 'tracks' is an empty list", () => {
    const tracks = []
    const artist = 'Pixies'
    const actual = filterTracksOnArtist(tracks, artist)
    const expected = []
    expect(actual).toEqual(expected)  
  })

  test("returns a empty list when 'artist' is undefined", () => {
    const tracks = [mrBrightside, onTop, midnightShow, evil, nextExit]
    const artist = undefined
    const actual = filterTracksOnArtist(tracks, artist)
    const expected = []
    expect(actual).toEqual(expected)  
  })

  test("throws a TypeError when 'tracks' is undefined", () => {
    expect(() => {
      trackIncludesArtist(undefined, 'Pixies')
    }).toThrow(TypeError)
  })
})



