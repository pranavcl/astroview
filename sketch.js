var tool = "Hand";
var zoom = 1;
var zoom_step = 0.05;
var maxZoom = 6.5;
var minZoom = 0.5;

var toolbar = {};
var tools = {};
tools.length = 7;
tools.cursor = {hover: false, name:"Hand"};
tools.pen = {hover: false, name:"Pen"};
tools.eraser = {hover: false, name:"Eraser"};
tools.text = {hover: false, name:"Text"};
tools.line = {hover: false, name:"Line"};
tools.rectangle = {hover: false, name:"Rectangle"};
tools.move = {hover: false, name:"Move"};

var toolWidth = 32;
var toolHeight = 32;

var selectedTextBox = undefined;

var panSpeed = 4;

var images = {};
var mouseDown = false;

var prevX;
var prevY;

var strokes = [];
var currentStroke = [];
var penColor = [255, 255, 255];
var penSize = 10;

var fontSize = 16;
var mainFont;

var texts = [];

var imageWidth = 10552;
var imageHeight = 2468;

var linex = 0;
var liney = 0;

var fontSizeSlider;

// ================== WCS CONFIGURATION FOR MULTIPLE IMAGES ==================
// Each image has its own WCS parameters for accurate coordinate display

var wcsConfigs = {
  "m31_small": {
    name: "Andromeda Galaxy (M31)",
    crval1: 10.68458333,    // RA: 00h 42m 44.3s
    crval2: 41.26916667,    // Dec: +41° 16' 09"
    crpix1: 4197,           // M31 center pixel X (adjust based on your image)
    crpix2: 372,            // M31 center pixel Y (adjust based on your image)
    cdelt1: -0.000142144,   // ~0.51 arcsec/pixel
    cdelt2: 0.000405186,    // ~1.46 arcsec/pixel
    crota2: 0
  },
  
  // ADD MORE IMAGES HERE - Example templates:
  "pillars_of_creation": {
    name: "Pillars of Creation (Eagle Nebula)",
    crval1: 274.7,          // RA: 18h 18m 48s
    crval2: -13.8,          // Dec: -13° 48' 00"
    crpix1: 2048,
    crpix2: 2048,
    cdelt1: -0.0005,
    cdelt2: 0.0005,
    crota2: 0
  },
  
  "cosmic_cliffs_carina": {
    name: "Carina Nebula",
    crval1: 161.265,        // RA: 10h 45m 03.6s
    crval2: -59.868,        // Dec: -59° 52' 05"
    crpix1: 2048,
    crpix2: 2048,
    cdelt1: -0.0005,
    cdelt2: 0.0005,
    crota2: 0
  },
  "whirlpool_galaxy_m51": {
    name: "Whirlpool Galaxy",
    crval1: 202.46958,          
    crval2: 47.19525,          
    crpix1: 1024,
    crpix2: 1024,
    cdelt1: -0.00027,
    cdelt2: 0.00027,
    crota2: 0
  }
};

var currentWCS = null;

/**
 * Initialize WCS based on loaded image
 */
function initializeWCS(imageName) {
  if (!imageName || !wcsConfigs[imageName]) {
    console.warn("No WCS config found for:", imageName);
    console.log("Using default M31 configuration");
    imageName = "m31_small";
  }
  
  currentWCS = wcsConfigs[imageName];
  
  // Calculate CD matrix
  var rot_rad = currentWCS.crota2 * Math.PI / 180.0;
  var cos_rot = Math.cos(rot_rad);
  var sin_rot = Math.sin(rot_rad);
  
  currentWCS.cd1_1 = currentWCS.cdelt1 * cos_rot;
  currentWCS.cd1_2 = -currentWCS.cdelt2 * sin_rot;
  currentWCS.cd2_1 = currentWCS.cdelt1 * sin_rot;
  currentWCS.cd2_2 = currentWCS.cdelt2 * cos_rot;
  
  console.log("=== WCS LOADED: " + currentWCS.name + " ===");
  console.log("Image:", imageWidth, "x", imageHeight);
  console.log("Center at pixel:", currentWCS.crpix1, currentWCS.crpix2);
  console.log("Center coords: RA", raToHMS(currentWCS.crval1), "Dec", decToDMS(currentWCS.crval2));
  console.log("Pixel scale:", (Math.abs(currentWCS.cdelt1) * 3600).toFixed(3), "arcsec/pixel");
}

/**
 * Convert pixel coordinates to RA/Dec using professional WCS
 */
function pixelToRADec(imageX, imageY) {
  if (!currentWCS) {
    return {ra: 0, dec: 0}; // Fallback
  }
  
  var x = imageX + 1;
  var y = imageY + 1;
  
  var dx = x - currentWCS.crpix1;
  var dy = y - currentWCS.crpix2;
  
  var xi = currentWCS.cd1_1 * dx + currentWCS.cd1_2 * dy;
  var eta = currentWCS.cd2_1 * dx + currentWCS.cd2_2 * dy;
  
  var xi_rad = xi * Math.PI / 180.0;
  var eta_rad = eta * Math.PI / 180.0;
  var ra0_rad = currentWCS.crval1 * Math.PI / 180.0;
  var dec0_rad = currentWCS.crval2 * Math.PI / 180.0;
  
  var denom = Math.cos(dec0_rad) - eta_rad * Math.sin(dec0_rad);
  var ra_rad = ra0_rad + Math.atan2(xi_rad, denom);
  var dec_rad = Math.atan2(
    Math.sin(dec0_rad) + eta_rad * Math.cos(dec0_rad),
    Math.sqrt(xi_rad * xi_rad + denom * denom)
  );
  
  var ra = ra_rad * 180.0 / Math.PI;
  var dec = dec_rad * 180.0 / Math.PI;
  
  while (ra < 0) ra += 360;
  while (ra >= 360) ra -= 360;
  
  return {ra: ra, dec: dec};
}

function raToHMS(ra) {
  var hours = ra / 15.0;
  var h = Math.floor(hours);
  var min_decimal = (hours - h) * 60;
  var m = Math.floor(min_decimal);
  var s = (min_decimal - m) * 60;
  
  return String(h).padStart(2, '0') + 'h ' + 
         String(m).padStart(2, '0') + 'm ' + 
         s.toFixed(2).padStart(5, '0') + 's';
}

function decToDMS(dec) {
  var sign = dec >= 0 ? '+' : '-';
  dec = Math.abs(dec);
  var d = Math.floor(dec);
  var min_decimal = (dec - d) * 60;
  var m = Math.floor(min_decimal);
  var s = (min_decimal - m) * 60;
  
  return sign + String(d).padStart(2, '0') + '° ' + 
         String(m).padStart(2, '0') + "' " + 
         s.toFixed(2).padStart(5, '0') + '"';
}

var urlParams = new URLSearchParams(window.location.search);
var path;
var imageName;
if(!urlParams.get("img")) {
  path = "/dzi_images/m31_small.dzi";
  imageName = "m31_small";
} else {
  imageName = urlParams.get("img");
  path = "/dzi_images/" + imageName + ".dzi";
}

var viewer = OpenSeadragon({
  id: "openseadragon1",
  prefixUrl: "/openseadragon/images/",
  tileSources: path,
  showNavigator: false,
  showZoomControl: false,
  showHomeControl: false,
  showFullPageControl: false
});

function detectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 &&
         x1 + w1 > x2 &&
         y1 < y2 + h2 &&
         y1 + h1 > y2;
}

function preload() {
  images.cursor = loadImage("/images/cursor.png");
  images.pen = loadImage("/images/pen.png");
  images.eraser = loadImage("/images/eraser.png");
  images.text = loadImage("/images/text.png");
  images.line = loadImage("/images/line.png");
  images.rectangle = loadImage("/images/rectangle.png");
  images.move = loadImage("/images/move.png");

  mainFont = loadFont("/fonts/ARIAL.ttf");

  zoomtools_preload();
  color_picker_preload();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(LEFT, TOP);

  prevX = mouseX;
  prevY = mouseY;

  toolbar.width = 48;
  toolbar.height = toolHeight*tools.length*2;
  toolbar.x = toolbar.width;
  toolbar.y = windowHeight/2 - toolbar.height/2;

  zoomtools_setup();
  imageWidth = viewer.world.getItemAt(0).source.dimensions.x;
  imageHeight = viewer.world.getItemAt(0).source.dimensions.y;
  
  // Initialize WCS for current image
  initializeWCS(imageName);

  fontSizeSlider = document.createElement("input");
  fontSizeSlider.setAttribute("type", "range");
  fontSizeSlider.setAttribute("min", "4");
  fontSizeSlider.setAttribute("max", "16");
  fontSizeSlider.setAttribute("value", "10");
  fontSizeSlider.setAttribute("step", "1");
  fontSizeSlider.style.position = "fixed";
  fontSizeSlider.style.top = "580px";
  fontSizeSlider.style.right = "40px";
  fontSizeSlider.style.zIndex = "1000";
  document.body.appendChild(fontSizeSlider);

  infopanel_setup();
  topbar_setup();
  color_picker_setup();
}

function update() {
  zoomtools_update();
  infopanel_update();
  color_picker_update();
  topbar_update();

  fontSize = fontSizeSlider.value;

  if(mouseDown && prevX != mouseX && prevY != mouseY) {
    var pt = new OpenSeadragon.Point(((prevX - mouseX)/zoom)*0.001, ((prevY - mouseY)/zoom)*0.001)
    if(tool === "Hand")
    viewer.viewport.panBy(pt);
    else if(tool === "Move" && selectedTextBox != undefined) { texts[selectedTextBox].x -= pt.x*1.2; texts[selectedTextBox].y -= pt.y*1.2; }
  }
  prevX = mouseX;
  prevY = mouseY;

  if((tool === "Line" || tool === "Rectangle") && mouseDown && !linex && !liney) {
    linex = mouseX;
    liney = mouseY;
  }

  tools.cursor.x = toolbar.x + toolbar.width/6;
  tools.cursor.y = toolbar.y + toolbar.width/4;
  tools.pen.x = tools.cursor.x;
  tools.pen.y = tools.cursor.y + toolHeight*2;
  tools.eraser.x = tools.cursor.x;
  tools.eraser.y = tools.pen.y + toolHeight*2;
  tools.text.x = tools.cursor.x;
  tools.text.y = tools.eraser.y + toolHeight*2;
  tools.line.x = tools.cursor.x;
  tools.line.y = tools.text.y + toolHeight*2;
  tools.rectangle.x = tools.cursor.x;
  tools.rectangle.y = tools.line.y + toolHeight*2;
  tools.move.x = tools.cursor.x;
  tools.move.y = tools.rectangle.y + toolHeight*2;

  if(mouseDown && tool === "Pen" && mouseX > 100) {
    var pt = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(mouseX, mouseY));
    currentStroke.push([pt.x, pt.y, penColor, penSize]);
  }

  if(tool === "Eraser" && mouseDown) {
    for(var i=0; i < strokes.length; i++) {
      for(var j = 0; j < strokes[i].length; j++) {
        var pt = viewer.viewport.viewportToViewerElementCoordinates(new OpenSeadragon.Point(strokes[i][j][0], strokes[i][j][1]));
        if(dist(mouseX, mouseY, pt.x, pt.y) < 20) {
          strokes.splice(i, 1);
          break;
        }
      }
    }
  }
}

function draw() {
  update();
  cursor();
  clear();
  noFill();

  // ================== DRAW CURRENT LINE ==================
  if(tool === "Line" && linex && liney) {
    stroke(255);
    beginShape();
    vertex(linex, liney);
    vertex(mouseX, mouseY);
    endShape();
  }

  // ================== DRAW CURRENT RECTANGLE ==================
  if(tool === "Rectangle" && linex && liney) {
    stroke(255);
    rect(linex, liney, mouseX - linex, mouseY - liney);
  }

  // ================== DRAW CURRENT STROKE ==================
  beginShape();
  for(var i = 0; i < currentStroke.length; i++) {
    stroke(currentStroke[i][2][0], currentStroke[i][2][1], currentStroke[i][2][2]);
    strokeWeight(currentStroke[i][3] * viewer.viewport.getZoom(true));
    var pt = viewer.viewport.viewportToViewerElementCoordinates(new OpenSeadragon.Point(currentStroke[i][0], currentStroke[i][1]));
    vertex(pt.x, pt.y);
  }
  endShape();

  // ================== DRAW ALL STROKES ==================
  for(var i = 0; i < strokes.length; i++) {
    beginShape();
    for(var j = 0; j < strokes[i].length; j++) {
      stroke(strokes[i][j][2][0], strokes[i][j][2][1], strokes[i][j][2][2]);
      strokeWeight(strokes[i][j][3] * viewer.viewport.getZoom(true));
      var pt = viewer.viewport.viewportToViewerElementCoordinates(new OpenSeadragon.Point(strokes[i][j][0], strokes[i][j][1]));
      vertex(pt.x, pt.y);
    }
    endShape();
  }
  noStroke();

  // ================== DRAW TEXTS ==================
  textFont(mainFont);
  for(var i = 0; i < texts.length; i++) {
    var pt = viewer.viewport.viewportToViewerElementCoordinates(new OpenSeadragon.Point(texts[i].x, texts[i].y));
    textSize(texts[i].fontSize*zoom);
    fill(texts[i].color);
    text(texts[i].content, pt.x, pt.y);

    var bbox = mainFont.textBounds(texts[i].content, pt.x, pt.y);
    texts[i].w = bbox.w;
    texts[i].h = bbox.h;

    var found = false;
    if((tool === "Text" || tool === "Move") && detectCollision(mouseX, mouseY, 1, 1, bbox.x, bbox.y, bbox.w, bbox.h)) {
      cursor(TEXT);
      noFill();
      stroke(0, 0, 255);
      strokeWeight(1);
      rect(bbox.x, bbox.y, bbox.w, bbox.h);
      found = true;

      if(mouseDown) selectedTextBox = i;
    }
    if(!found) selectedTextBox = undefined;
  }
  noStroke();

  // ================== INFO PANEL WITH ACCURATE RA/DEC ==================
  textFont("Helvetica");
  fill(255,255,255,200);
  textSize(18);
  
  var pt = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(mouseX, mouseY));
  let imgX = pt.x * imageWidth;
  let imgY = pt.y * imageHeight;
  
  // Use professional WCS transformation
  let coords = pixelToRADec(imgX, imgY);

  text(
    "Zoom level: " + viewer.viewport.getZoom().toFixed(2) +
    "\nImage X: " + parseInt(imgX) + " | Image Y: " + parseInt(imgY) +
    "\nRA: " + raToHMS(coords.ra) + " (" + coords.ra.toFixed(6) + "°)" +
    "\nDec: " + decToDMS(coords.dec) + " (" + coords.dec.toFixed(6) + "°)" +
    "\nX: " + mouseX + " | Y: " + mouseY +
    "\nTool: " + tool,
    20, windowHeight - 140
  );

  rect(toolbar.x, toolbar.y, toolbar.width, toolbar.height,5);

  for(var i in tools) {
    tools[i].hover = false;
    if(detectCollision(mouseX, mouseY, 1, 1, tools[i].x, tools[i].y, toolWidth, toolHeight)) {
      cursor(HAND);
      fill(180);
      noStroke();
      circle(tools[i].x + toolWidth/2, tools[i].y + toolHeight/2, toolWidth*1.2);
      tools[i].hover = true;
    }
    if(tool == tools[i].name) {
      fill(180);
      noStroke();
      circle(tools[i].x + toolWidth/2, tools[i].y + toolHeight/2, toolWidth*1.2);
    }
  }

  image(images.cursor, tools.cursor.x, tools.cursor.y);
  image(images.pen, tools.pen.x, tools.pen.y);
  image(images.eraser, tools.eraser.x, tools.eraser.y);
  image(images.text, tools.text.x, tools.text.y);
  image(images.line, tools.line.x, tools.line.y);
  image(images.rectangle, tools.rectangle.x, tools.rectangle.y);
  image(images.move, tools.move.x, tools.move.y);

  fill(255);
  textSize(24);
  noStroke();
  text("Font Size: " + fontSizeSlider.value, windowWidth - 230, 540);

  zoomtools_draw();
  infopanel_draw();
  topbar_draw();
  color_picker_draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  toolbar.width = 48;
  toolbar.height = toolHeight*tools.length*2;
  toolbar.x = toolbar.width;
  toolbar.y = windowHeight/2 - toolbar.height/2;
}

function mouseClicked() {
  for(var i in tools) {
    if(tools[i].hover)
    tool = tools[i].name;
  }

  if(tool === "Text" && mouseX > 100) {
    var found = false;
    for(var i = 0; i < texts.length; i++) {
      var pt = viewer.viewport.viewportToViewerElementCoordinates(new OpenSeadragon.Point(texts[i].x, texts[i].y));
      if(detectCollision(mouseX, mouseY, 1, 1, pt.x, pt.y, texts[i].w, texts[i].h)) {
        newText = prompt("Change annotation (to delete, input nothing): ");
        if(!newText) return texts.splice(i, 1);
        texts[i].content = newText;
        found = true;
      }
    }
    if(found) return;
    var pt = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(mouseX, mouseY));
    var newText = {};
    newText.content = prompt("New annotation:");
    if(!newText.content) return;
    newText.x = pt.x;
    newText.y = pt.y;
    newText.fontSize = fontSize;
    newText.color = penColor;
    texts.push(newText);
  }
}

function mousePressed() {
  mouseDown = true;
}

function mouseReleased() {
  mouseDown = false;
  if(tool === "Line") {
    var pt1 = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(linex, liney));
    var pt2 = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(mouseX, mouseY));
    currentStroke.push([pt1.x, pt1.y, penColor, penSize]);
    currentStroke.push([pt2.x, pt2.y, penColor, penSize]);
    linex = liney = 0;
  }
  if(tool === "Rectangle") {
    var pt1 = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(linex, liney));
    var pt2 = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(mouseX, liney));
    var pt3 = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(mouseX, mouseY));
    var pt4 = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(linex, mouseY));
    var pts = [pt1, pt2, pt3, pt4, pt1];
    for(var i = 0; i < pts.length; i++) {
      currentStroke.push([pts[i].x, pts[i].y, penColor, penSize]);
    }
    linex = liney = 0;
  }
  if(currentStroke.length != 0) strokes.push(currentStroke);
  currentStroke = [];
}

function mouseWheel(event) {
  if(event.delta < 0) zoom *= 1-zoom_step;
  else zoom += 1+zoom_step;

  if(zoom > maxZoom) zoom = maxZoom;
  if(zoom < minZoom) zoom = minZoom;

  viewer.viewport.zoomTo(zoom);
}
