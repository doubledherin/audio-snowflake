/* globals $ */

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
  

  // Private classes -----------------------------------------------------------
  class Plant {
    constructor(width, height, play, id) {
      this.pg = p.createGraphics(width, height)
      
      this.pg.colorMode(p.HSB, 360, 100, 100, 1.0)
      
      this.play = play
      
      this.id = id
      
    }

    render(cfg) {
      const pg = this.pg
      
      const {
        brightness,
        gamma,
        hue,
        recursionDepth, randomization,
        saturation, size
      } = cfg
      

      this.branchesCounter = 0
      
      this.noiseOffset = (p.frameCount + this.id * 20)
      

      pg.clear()
      
      pg.background(0, 0)
      

      pg.translate(pg.width / 2, pg.height - size / 6)
       // mark the bottom center of pg
      pg.ellipseMode(p.CENTER)
       pg.noStroke()
       pg.fill(hue, saturation, 100 * brightness, 0.1)
      
      pg.ellipse(0, 0, size * 1.5, size / 2)
      
      pg.resetMatrix()
      

      pg.translate(pg.width / 2, pg.height - size / 6)
       // move to the bottom center of pg
      // pg.translate(pg.width / 2, pg.height / 2 )
       // move to the center of pg

      const deltaGammaNoise = (this.play ? (p.noise(this.noiseOffset / 150 + 4000) - 0.5) * 2 : 0) * gamma
      

      const sizeNoise = 1 - p.noise(this.id + 1 * 10, this.branchesCounter * 10) ** (randomization + 2)
      
      const scaledSize = size * sizeNoise
      
      const dir = pg.createVector(0, -1) // v(0, -1) -> grow to top
        .setMag(scaledSize).rotate(gamma + deltaGammaNoise)
        

      this.renderBranch(dir, recursionDepth, cfg)
      
      pg.resetMatrix()
      
    }

    renderBranch(dir, depth, cfg) {
      const pg = this.pg
      
      const {
        alpha,
        branchMinLength, brightness,
        decCoeffA, decCoeffB,
        deltaAlpha, deltaBeta,
        hue,
        randomization, recursionDepth,
        saturation,
        thickness,
      } = cfg
      

      this.branchesCounter++
      

      const size = dir.mag()
      
      const sizeNoise = 1 - p.noise(this.id + 1 * 10, this.branchesCounter * 10) ** randomization
      
      const scaledSize = size * sizeNoise
      
      const rescaledDir = dir.copy().setMag(scaledSize)
      

      pg.stroke(hue, saturation, (recursionDepth - depth) / recursionDepth * 100 * brightness, depth / recursionDepth + 0.33)
      
      pg.strokeWeight((depth + 1) * thickness)
      
      pg.line(0, 0, rescaledDir.x, rescaledDir.y)
      
      // pg.noFill()
       pg.ellipse(rescaledDir.x, rescaledDir.y, 5)
      

      if (depth > 0 && scaledSize >= branchMinLength) {
        const alphaNoise = (this.play ? (p.noise(this.noiseOffset / 110 + 1000) - 0.5) * 2 : 0) * alpha
        
        const deltaAlphaNoise = (this.play ? (p.noise(this.noiseOffset / 60 + 2000) - 0.5) * 2 : 0) * deltaAlpha
        
        const deltaBetaNoise = (this.play ? (p.noise(this.noiseOffset / 60 + 3000) - 0.5) * 2 : 0) * deltaBeta
        


        pg.push()
        
        pg.translate(rescaledDir.x, rescaledDir.y)
        
        const newDirA = rescaledDir.copy().setMag(scaledSize * decCoeffA)
          .rotate(alpha + alphaNoise + deltaAlpha + deltaAlphaNoise)
          
        this.renderBranch(newDirA, depth - 1, cfg)
        
        pg.pop()

        pg.push()
        
        pg.translate(rescaledDir.x, rescaledDir.y)
        
        const newDirB = rescaledDir.copy().setMag(scaledSize * decCoeffB)
          .rotate(-alpha - alphaNoise + deltaBeta + deltaBetaNoise)
          
        this.renderBranch(newDirB, depth - 1, cfg)
        
        pg.pop()
      }
    }
  }

  // Lifecycle methods =========================================================
  // preload() -----------------------------------------------------------------
  p.preload = function() {}

  // setup() -------------------------------------------------------------------
  p.setup = function() {
    // console.log("::: setup() props:", props)
    

    // p.createCanvas(800, 300)
    
    // p.colorMode(p.RGB, 255, 255, 255, 1.0)
    
    // p.pixelDensity(1)
    
    // p.frameRate(15)
    
    // p.noLoop()
    
    // onReady()
    


    

    p.createCanvas(
      window.innerWidth,
      window.innerHeight
    )
    p.background(0)
    p.centerX = p.width / 2
    p.centerY = p.height / 2
    p.radius = 1
    p.angleMode(p.DEGREES)
    p.translateX = 0
    p.translateY = 0
    p.opacity = 255
    p.direction = "out"
    p.rotation = 24.0
    p.totalDegrees = 369
    p.r = 255
    p.g = 128
    p.b = 128

  }

  // draw() --------------------------------------------------------------------
  p.draw = function() {
    // console.log("::: draw() props:", props)
    

    p.noFill()
    p.stroke(p.r, p.g, p.b, p.opacity)
    p.beginShape()
        for (let i=0; i <= p.totalDegrees; i++) {
            var noiseFactor = p.noise(i / 40, p.frameCount / 320)
            var x = p.centerX + p.radius * p.cos(i) * noiseFactor
            var y = p.centerY + p.radius * p.sin(i) * noiseFactor
            p.curveVertex(x, y)
            p.rotate(p.PI/p.rotation)
            
        }
    p.endShape(p.CLOSE)
    if (p.direction === "out") {
        if (p.radius > p.height / 2) {
          p.direction = "in"
        } else {
            p.radius += 0.65
        }
    } else {
        if (p.radius <= 0) {
          p.radius = 100
          p.direction = "out"
        } else {
          p.radius -= 0.65
        }
    }
    p.rotation += 0.1
    if (p.frameCount > 200) {
      p.translateX = 0
      p.translateY = 0
    }
    if (p.r > 255) {
      p.r = 0
    }
    if (p.g > 255) {
      p.g = 0
    }
    if (p.b > 255) {
      p.b = 0
    }
    if (p.opacity == 0) {
      p.opacity = 255
    }
    p.translateX *= p.frameCount
    p.translateY *= p.frameCount
    p.opacity -= 1
    p.r += 1
    p.g += 1
    p.b += 1

  }
}
