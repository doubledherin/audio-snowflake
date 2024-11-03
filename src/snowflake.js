// DECLARATIONS
let hypotrochoids = [];
let width, height;

// FUNCTION CALLS
function setup() {
  createCanvas(windowWidth, windowHeight);
  width = min(windowWidth, windowHeight) - 50;
  resizeCanvas(width, width);
  translate(width / 2.0, width / 2.0);
  frameRate(100);
  ellipseMode(CENTER);
  // colorMode(HSB);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
  smooth();

  // Set up some hypotrochoids
  // TO DO: Stop hardcoding this data
  setUpHypotrochoid(1000, 50, 30, 200, 100, 100, 100);
  setUpHypotrochoid(800, 40, 20, 100, 80, 90, 90);
}

function draw() {
  translate(width / 2.0, height / 2.0);
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
