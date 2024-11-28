// DECLARATIONS
let hypotrochoids = [];
let width, height;

// FUNCTION CALLS
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(100);
  colorMode(HSB);
  background(0);

  // Set up some hypotrochoids
  // TO DO: Stop hardcoding this data
  setUpHypotrochoid(1000, 50, 30, 0, 100, 100, 100);
  setUpHypotrochoid(800, 50, 30, 50, 100, 100, 100);
  setUpHypotrochoid(600, 50, 30, 75, 100, 100, 100);
  setUpHypotrochoid(400, 50, 30, 100, 100, 100, 100);
  setUpHypotrochoid(300, 50, 30, 0, 0, 100, 100);
}

function draw() {
  for (let i = 0; i < hypotrochoids.length; i++) {
    let h = hypotrochoids[i];
    h.draw();
  }
}

function setUpHypotrochoid(a, b, h, hue, saturation, brightness, opacity) {
  let hypotrochoid = new Hypotrochoid(
    a,
    b,
    h,
    hue,
    saturation,
    brightness,
    opacity
  );
  hypotrochoids.push(hypotrochoid);
}

// CLASS AND METHOD DEFINITIONS
class Hypotrochoid {
  constructor(a, b, h, hue, saturation, brightness, opacity) {
    this.a = a;
    this.b = b;
    this.h = h;
    this.hue = hue;
    this.saturation = saturation;
    this.brightness = brightness;
    this.opacity = opacity;
    this.t = 10.0;
  }

  draw() {
    stroke(this.hue, this.saturation, this.brightness, this.opacity);
    const x =
      (this.a - this.b) * cos(this.t) +
      this.h * cos(((this.a - this.b) / this.b) * this.t);
    const y =
      (this.a - this.b) * sin(this.t) -
      this.h * sin(((this.a - this.b) / this.b) * this.t);
    scale(0.4);
    ellipse(x, y, 1, 1);
    scale(2.5);
    this.t += 0.01;
  }
}
