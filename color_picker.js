var myPicker;
var thicknessSlider;
var penColor = [255, 255, 255];
var penSize = 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  color_picker_setup();
  background(0);
}

function draw() {
  color_picker_update();
  color_picker_draw();
}

function mouseDragged() {
  stroke(penColor);
  strokeWeight(map(penSize, 0, 1, 1, 50));
  line(pmouseX, pmouseY, mouseX, mouseY);
}

function color_picker_preload() {
  myPicker = document.createElement("input");
  myPicker.setAttribute("type", "color");
  myPicker.value = "#FFFFFF";
  myPicker.style.position = "fixed";
  myPicker.style.top = "420px";
  myPicker.style.right = "40px";
  myPicker.style.zIndex = "1000";
  document.body.appendChild(myPicker);

  thicknessSlider = document.createElement("input");
  thicknessSlider.setAttribute("type", "range");
  thicknessSlider.setAttribute("min", "0.1");
  thicknessSlider.setAttribute("max", "1");
  thicknessSlider.setAttribute("value", "0.5");
  thicknessSlider.setAttribute("step", "0.1");
  thicknessSlider.style.position = "fixed";
  thicknessSlider.style.top = "520px";
  thicknessSlider.style.right = "40px";
  thicknessSlider.style.zIndex = "1000";
  document.body.appendChild(thicknessSlider);

  return { thicknessSlider, myPicker };
}

function color_picker_setup() {
  color_picker_preload();
}

function color_picker_update() {
  penColor = hexToRgb(myPicker.value);
  penSize = parseFloat(thicknessSlider.value);
}

function color_picker_draw() {
  fill(255);
  textSize(24);
  noStroke();
  text("Color Picker:", windowWidth - 230, 380);
  text("Thickness: " + penSize.toFixed(1), windowWidth - 245, 480);
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
}
