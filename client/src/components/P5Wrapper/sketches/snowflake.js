import { getHypotrochoid } from '../../../utils'
import { snowflakeDataOfEvil } from '../../../tests/__fixtures'

export default function sketch(p) {

  let hypotrochoids = []
  let angle = 0.0
  let canvasWidth

  p.setup = () => {
    canvasWidth = p.min(p.windowWidth, p.windowHeight) - 200
    p.colorMode(p.HSB)
    p.createCanvas(canvasWidth, canvasWidth)
    p.smooth()
    const { duration, energy, valence } = snowflakeDataOfEvil    
    hypotrochoids = snowflakeDataOfEvil.sections.map(section => {
      return getHypotrochoid(duration, energy, valence, section)
    })
  }

  p.draw = () => hypotrochoids.forEach(drawHypotrochoid)

  p.windowResized = () => {
    canvasWidth = p.min(p.windowWidth, p.windowHeight)
    p.resizeCanvas(canvasWidth, canvasWidth);
  }

  function drawHypotrochoid({ statorRadius, rotorRadius, penDistance, hue, saturation, brightness, opacity }) {
    p.push()
    p.translate(300, 300) // TODO: Figure out how to really center this
    let x = ((statorRadius - rotorRadius) * Math.cos(angle)) + (penDistance * Math.cos(((statorRadius - rotorRadius) / rotorRadius) * angle))
    let y = ((statorRadius - rotorRadius) * Math.sin(angle)) - (penDistance * Math.sin(((statorRadius - rotorRadius) / rotorRadius) * angle))
    p.stroke(hue, saturation, brightness, opacity)
    p.ellipse(x, y, 2, 2)
    angle += 0.00111
    p.pop()
  }
}
