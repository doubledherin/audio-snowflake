const { ApolloError } = require('apollo-server')

const SpotifyWebAPI = require('../../datasources/spotifyWeb')
const { tracks, audioAnalysisOfEvil, audioFeaturesOfEvil, snowflakeDataOfEvil } = require('../__fixtures')
const { evil } = tracks
const { 
  errors: { 
    trackNotFound, 
    audioAnalysisNotFound, 
    invalidInput 
  } 
} = require('../../constants/errors')

const mocks = {
  get: jest.fn(),
};

const ds = new SpotifyWebAPI()
ds.get = mocks.get

//TODO: Finish these test cases and add more
/**
 * Test cases:
 * 
 * DONE
 * snowflakeReducer
 * 
 * getSpotifyId(title, artist)
 *   DONE neither title nor artist are defined:
 *      throws InvalidInput error
 *   title and artist are defined:
 *     matching track found:
 *       returns a spotifyId
 *     no matching track found:
 *       throws TrackNotFound error
 *   only title is defined:
 *     matching track found:
 *       returns a spotifyId
 *     no matching track found:
 *       throws TrackNotFound error
 *   only artist is defined:
 *     matching track found:
 *       returns a spotifyId
 *     no matching track found:
 *       throws TrackNotFound error
 * 
 */


describe('[SpotifyWebAPI.getSpotifyId]', () => {
  test('throws an InvalidInput error if neither title nor artist are defined', async () => {
    await expect(ds.getSpotifyId()).rejects.toThrow(new ApolloError(`${invalidInput.message}`, invalidInput.code))
  })
})
