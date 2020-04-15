const { ApolloError } = require('apollo-server')

const SpotifyWebAPI = require('../../datasources/spotifyWeb')
const { tracks, audioAnalysisOfEvil } = require('../__fixtures')
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


/**
 * Test cases:
 * 
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
