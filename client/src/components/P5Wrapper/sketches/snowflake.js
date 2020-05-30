import { getHypotrochoid } from '../../../utils'
import { snowflakeDataOfEvil } from '../../../tests/__fixtures'

/* globals */

export default function sketch(p) {

  p.onSetAppState = () => {}
  // Methods -------------------------------------------------------------------


  // Private members -----------------------------------------------------------
  
  let hypotrochoids = []
  let angle = 0.0
  let canvasWidth

  // class Pattern {
  //   constructor() {
  //     this.colorMode = (p.HSB)
  //   }
  // }
  
  // Private classes -----------------------------------------------------------
  // class Hypotrochoid extends Pattern {
  //   constructor(statorRadius, rotorRadius, distanceFromRotorCenter, hue, saturation, brightness, opacity) {
  //     super()
  //     this.statorRadius = statorRadius
  //     this.rotorRadius = rotorRadius
  //     this.distanceFromRotorCenter = distanceFromRotorCenter
  //     this.hue = hue
  //     this.saturation = saturation
  //     this.brightness = brightness
  //     this.opacity = opacity
  //   }
  // }

  // Lifecycle methods =========================================================
  // Make async calls to server here
  // preload() -----------------------------------------------------------------
  p.preload = function() {}
  

  // setup() -------------------------------------------------------------------
  p.setup = function() {
    // console.log("::: setup() p:", p)
    canvasWidth = p.min(p.windowWidth, p.windowHeight) - 200
    p.createCanvas(canvasWidth, canvasWidth)
    p.smooth()
    const { duration, energy, valence } = snowflakeDataOfEvil
    
    hypotrochoids = snowflakeDataOfEvil.sections.map(section => {
      return getHypotrochoid(duration, energy, valence, section)
    })
  }

  // draw() --------------------------------------------------------------------
  p.draw = function() {
    p.colorMode(p.HSB)

    // console.log("::: draw() props:", props)
    for (let i = 0; i < hypotrochoids.length; i++) {
      const { statorRadius, rotorRadius, penDistance, hue, saturation, brightness, opacity } = hypotrochoids[i]
      hypotrochoid(statorRadius, rotorRadius, penDistance, hue, saturation, brightness, opacity)
    }
  }

  p.windowResized = function() {
    canvasWidth = p.min(p.windowWidth, p.windowHeight)
    p.resizeCanvas(canvasWidth, canvasWidth);
  }

  function hypotrochoid(statorRadius, rotorRadius, penDistance, hue, saturation, brightness, opacity) {
    let x = ((statorRadius - rotorRadius) * Math.cos(angle)) + (penDistance * Math.cos(((statorRadius - rotorRadius) / rotorRadius) * angle)) + 300
    let y = ((statorRadius - rotorRadius) * Math.sin(angle)) - (penDistance * Math.sin(((statorRadius - rotorRadius) / rotorRadius) * angle)) + 300
    p.translate(0, 0)
    p.noStroke()
    p.stroke(hue, saturation, brightness, opacity)
    // p.scale(.4)
    p.ellipse(x, y, 2, 2)
    // p.scale(2.5)
    angle += 0.00111
  }
}
