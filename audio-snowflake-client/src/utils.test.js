import { snowflakeDataOfEvil } from './__fixtures'

const { getHypotrochoid } = require('./utils')

describe("The 'getHypotrochoid' function", () => {
  const { duration, energy, valence } = snowflakeDataOfEvil
  const firstSection = snowflakeDataOfEvil.sections[0]
  test("correctly sets hypotrochoid values", () => {
    const expected = {
      statorRadius: 592.661336,
      rotorRadius: 493.2090058058524,
      distanceFromRotorCenter: 99.45233019414758,
      hue: 60,
      saturation: 26.74,
      opacity: 0.5
    }
    const actual = getHypotrochoid(duration, energy, valence, firstSection)
    expect(actual).toEqual(expected)
  }) 

})

