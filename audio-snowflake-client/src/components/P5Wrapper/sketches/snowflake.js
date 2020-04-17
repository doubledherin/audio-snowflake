/* globals $ */

let hypotrochoids = []
let angle = 45.0

export default function (p) {
  // Methods -------------------------------------------------------------------
  p.setOnReady = function(cb) {
    onReady = cb
  }

  p.pushProps = function (_props) {
    props = _props
    p.loop()
  }

  // Private members -----------------------------------------------------------
  let onReady = () => {}
  let props = {}
  let plants = []

  // Private classes -----------------------------------------------------------
  

  // Lifecycle methods =========================================================
  // preload() -----------------------------------------------------------------
  p.preload = function() {}

  // setup() -------------------------------------------------------------------
  p.setup = function() {
    // console.log("::: setup() props:", props)

    let canvasWidth = p.min(p.windowWidth, p.windowHeight) - 100
    p.createCanvas(canvasWidth, canvasWidth)
  
    p.background(0)
    p.smooth()
    p.translate(p.width/2.0, p.width/2.0)
    p.ellipseMode(p.CENTER)
    p.stroke(245, 230, 156, 100)
    const hValues = [19, 140, 175, 50, 90]
    const fixedCircleRadius = 240.0
    const rollingCircleRadius = 160.0
    // const angle = 45.0
    for (let i = 0; i < hValues.length; i++) {
      hypotrochoids[i] = [fixedCircleRadius, rollingCircleRadius, hValues[i]]
    }

  }

  // draw() --------------------------------------------------------------------
  p.draw = function() {
    // console.log("::: draw() props:", props)

    for (let i = 0; i < hypotrochoids.length; i++) {
      let [fixedCircleRadius, rollingCircleRadius, h] = hypotrochoids[i]
      hypotrochoid(fixedCircleRadius, rollingCircleRadius, h)
    }
  }

  function hypotrochoid(fixedCircleRadius, rollingCircleRadius, h) {
    let x = ((fixedCircleRadius - rollingCircleRadius) * Math.cos(angle)) + (h * Math.cos(((fixedCircleRadius - rollingCircleRadius) / rollingCircleRadius) * angle)) + 300
    let y = ((fixedCircleRadius - rollingCircleRadius) * Math.sin(angle)) - (h * Math.sin(((fixedCircleRadius - rollingCircleRadius) / rollingCircleRadius) * angle)) + 300
    p.ellipse(x, y, 1, 1)
    angle += 0.00111
  }
}
