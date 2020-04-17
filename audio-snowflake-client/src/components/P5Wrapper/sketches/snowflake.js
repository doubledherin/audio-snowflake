import { getHypotrochoid } from '../../../utils'

/* globals */
const MAX_BRIGHTNESS = 100

export default function sketch(p) {
  // Methods -------------------------------------------------------------------
  
  // p.setOnReady = function(cb) {
  //   onReady = cb
  // }

  // p.pushProps = function (_props) {
  //   props = _props
  //   p.loop()
  // }

  // // Private members -----------------------------------------------------------
  
  // let onReady = () => {}
  // let props = {}
  
  let hypotrochoids = []
  let angle = 45.0

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
      this.brightness = MAX_BRIGHTNESS
      this.opacity = opacity
    }

    // render(cfg) {
    //   const pg = this.pg;
    //   const {
    //     brightness,
    //     gamma,
    //     hue,
    //     recursionDepth, randomization,
    //     saturation, size
    //   } = cfg;

    //   this.branchesCounter = 0;
    //   this.noiseOffset = (p.frameCount + this.id * 20);

    //   pg.clear();
    //   pg.background(0, 0);

    //   pg.translate(pg.width / 2, pg.height - size / 6); // mark the bottom center of pg
    //   pg.ellipseMode(p.CENTER); pg.noStroke(); pg.fill(hue, saturation, 100 * brightness, 0.1);
    //   pg.ellipse(0, 0, size * 1.5, size / 2);
    //   pg.resetMatrix();

    //   pg.translate(pg.width / 2, pg.height - size / 6); // move to the bottom center of pg
    //   // pg.translate(pg.width / 2, pg.height / 2 ); // move to the center of pg

    //   const deltaGammaNoise = (this.play ? (p.noise(this.noiseOffset / 150 + 4000) - 0.5) * 2 : 0) * gamma;

    //   const sizeNoise = 1 - p.noise(this.id + 1 * 10, this.branchesCounter * 10) ** (randomization + 2);
    //   const scaledSize = size * sizeNoise;
    //   const dir = pg.createVector(0, -1) // v(0, -1) -> grow to top
    //     .setMag(scaledSize).rotate(gamma + deltaGammaNoise);

    //   this.renderBranch(dir, recursionDepth, cfg);
    //   pg.resetMatrix();
    // }

    // renderBranch(dir, depth, cfg) {
    //   const pg = this.pg;
    //   const {
    //     alpha,
    //     branchMinLength, brightness,
    //     decCoeffA, decCoeffB,
    //     deltaAlpha, deltaBeta,
    //     hue,
    //     randomization, recursionDepth,
    //     saturation,
    //     thickness,
    //   } = cfg;

    //   this.branchesCounter++;

    //   const size = dir.mag();
    //   const sizeNoise = 1 - p.noise(this.id + 1 * 10, this.branchesCounter * 10) ** randomization;
    //   const scaledSize = size * sizeNoise;
    //   const rescaledDir = dir.copy().setMag(scaledSize);

    //   pg.stroke(hue, saturation, (recursionDepth - depth) / recursionDepth * 100 * brightness, depth / recursionDepth + 0.33);
    //   pg.strokeWeight((depth + 1) * thickness);
    //   pg.line(0, 0, rescaledDir.x, rescaledDir.y);
    //   // pg.noFill(); pg.ellipse(rescaledDir.x, rescaledDir.y, 5);

    //   if (depth > 0 && scaledSize >= branchMinLength) {
    //     const alphaNoise = (this.play ? (p.noise(this.noiseOffset / 110 + 1000) - 0.5) * 2 : 0) * alpha;
    //     const deltaAlphaNoise = (this.play ? (p.noise(this.noiseOffset / 60 + 2000) - 0.5) * 2 : 0) * deltaAlpha;
    //     const deltaBetaNoise = (this.play ? (p.noise(this.noiseOffset / 60 + 3000) - 0.5) * 2 : 0) * deltaBeta;


    //     pg.push();
    //     pg.translate(rescaledDir.x, rescaledDir.y);
    //     const newDirA = rescaledDir.copy().setMag(scaledSize * decCoeffA)
    //       .rotate(alpha + alphaNoise + deltaAlpha + deltaAlphaNoise);
    //     this.renderBranch(newDirA, depth - 1, cfg);
    //     pg.pop()

    //     pg.push();
    //     pg.translate(rescaledDir.x, rescaledDir.y);
    //     const newDirB = rescaledDir.copy().setMag(scaledSize * decCoeffB)
    //       .rotate(-alpha - alphaNoise + deltaBeta + deltaBetaNoise);
    //     this.renderBranch(newDirB, depth - 1, cfg);
    //     pg.pop()
    //   }
    // }
  }

  const evilHypotrochoids = new Hypotrochoid(23.1, 523.2, 100, 100, 100, 0.3)

  // Lifecycle methods =========================================================
  
  // Make async calls to server here
  // preload() -----------------------------------------------------------------
  p.preload = function() {}
  // setup() -------------------------------------------------------------------
  p.setup = function() {
    // console.log("::: setup() props:", props)
    let canvasWidth = p.min(p.windowWidth, p.windowHeight) - 100
    p.createCanvas(canvasWidth, canvasWidth)
    p.smooth()
    p.translate(p.width/2.0, p.width/2.0)
    p.ellipseMode(p.CENTER)
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
    p.stroke(245, 230, 156, 100)

    p.ellipse(x, y, 1, 1)
    angle += 0.00111
  }
}
