let stars = [];
let starCanvas;

function setup() {
  starCanvas = createCanvas(window.innerWidth, window.innerHeight);
  const parentDiv = document.getElementById('starfield-canvas');
  if (parentDiv) {
    starCanvas.parent('starfield-canvas');
  }
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(-width, width),
      y: random(-height, height),
      z: random(width)
    });
  }
}

function draw() {
  clear();
  background(0, 0, 20, 255);
  translate(width / 2, height / 2);
  let speed = 5;
  for (let star of stars) {
    star.z -= speed;
    if (star.z < 1) {
      star.x = random(-width, width);
      star.y = random(-height, height);
      star.z = width;
    }
    let sx = (star.x / star.z) * width;
    let sy = (star.y / star.z) * height;
    let r = map(star.z, 0, width, 6, 0.5);
    stroke(255);
    strokeWeight(2);
    fill(255);
    ellipse(sx, sy, r * 2);
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}
