import { getHypotrochoid } from '../../../utils'
import { snowflakeDataOfEvil } from '../../../__fixtures'

/* globals */

export default function sketch(p) {
  // Methods -------------------------------------------------------------------

  // Private members -----------------------------------------------------------
  
  let hypotrochoids = []
  let angle = 45.0
  let canvasWidth

  class Pattern {
    constructor() {
      this.colorMode = (p.HSB)
    }
  }
  
  // Private classes -----------------------------------------------------------
  class Hypotrochoid extends Pattern {
    constructor(statorRadius, rotorRadius, distanceFromRotorCenter, hue, saturation, brightness, opacity) {
      super()
      this.statorRadius = statorRadius
      this.rotorRadius = rotorRadius
      this.distanceFromRotorCenter = distanceFromRotorCenter
      this.hue = hue
      this.saturation = saturation
      this.brightness = brightness
      this.opacity = opacity
    }
  }

  // Lifecycle methods =========================================================
  // Make async calls to server here
  // preload() -----------------------------------------------------------------
  p.preload = function() {}

  // setup() -------------------------------------------------------------------
  p.setup = function() {
    // console.log("::: setup() props:", props)
    canvasWidth = p.min(p.windowWidth, p.windowHeight) - 100
    p.createCanvas(canvasWidth, canvasWidth)
    p.smooth()
    p.translate(p.width/2.0, p.width/2.0)
    p.ellipseMode(p.CENTER)
    
    const { duration, energy, valence } = snowflakeDataOfEvil
    
    hypotrochoids = snowflakeDataOfEvil.sections.map(section => {
      return getHypotrochoid(duration, energy, valence, section)
    })
    console.log("HYPOS: ", hypotrochoids)
  }

  // draw() --------------------------------------------------------------------
  p.draw = function() {
    // console.log("::: draw() props:", props)
    for (let i = 0; i < hypotrochoids.length; i++) {
      const { statorRadius, rotorRadius, penDistance, hue, saturation, brightness, opacity } = hypotrochoids[i]
      hypotrochoid(statorRadius, rotorRadius, penDistance, hue, saturation, brightness, opacity)
    }
  }

  function hypotrochoid(statorRadius, rotorRadius, penDistance, hue, saturation, brightness, opacity) {
    let x = ((statorRadius - rotorRadius) * Math.cos(angle)) + (penDistance * Math.cos(((statorRadius - rotorRadius) / rotorRadius) * angle)) + 300
    let y = ((statorRadius - rotorRadius) * Math.sin(angle)) - (penDistance * Math.sin(((statorRadius - rotorRadius) / rotorRadius) * angle)) + 300
    p.stroke(hue, saturation, brightness, opacity)
    p.ellipse(x, y, 1, 1)
    angle += 0.00111
  }
}
