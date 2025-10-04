var tool = "Hand";
var zoom = 1;
var zoom_step = 0.05;
var maxZoom = 6.5;
var minZoom = 0.5;

var toolbar = {};
var tools = {};
tools.cursor = {hover: false, name:"Hand"};
tools.pen = {hover: false, name:"Pen"};

var toolWidth = 32;
var toolHeight = 32;

var panSpeed = 4;

var images = {};
var mouseDown = false;

var prevX;
var prevY;

var strokes = [];
var currentStroke = [];
var penColor = [255, 255, 255];
var penSize = 10;

// Fallback: 10552x2468
var imageWidth = 10552;
var imageHeight = 2468;

var viewer = OpenSeadragon({
	id: "openseadragon1",
	prefixUrl: "/openseadragon/images/",
	tileSources: "/dzi_images/m31_small.dzi",
	showNavigator: false,
	showZoomControl: false,
	showHomeControl: false,
	showFullPageControl: false
});

// viewer.viewport.zoomBy(1.2);
// viewer.viewport.panBy(new OpenSeadragon.Point(0, 0.01));

function detectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 &&
         x1 + w1 > x2 &&
         y1 < y2 + h2 &&
         y1 + h1 > y2;
}

function preload() {
	images.cursor = loadImage("/images/cursor.png");
	images.pen = loadImage("/images/pen.png");

	zoomtools_preload();
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	prevX = mouseX;
	prevY = mouseY;

	toolbar.width = 48;
	toolbar.height = windowHeight/2;
	toolbar.x = toolbar.width;
	toolbar.y = windowHeight/2 - toolbar.height/2;

	zoomtools_setup();
	imageWidth = viewer.world.getItemAt(0).source.dimensions.x;
	imageHeight = viewer.world.getItemAt(0).source.dimensions.y;

	infopanel_setup();
	topbar_setup();
}

function update() {
	zoomtools_update();
	infopanel_update();
	topbar_update();

	if(mouseDown && prevX != mouseX && prevY != mouseY && tool === "Hand") {
		viewer.viewport.panBy(new OpenSeadragon.Point(((prevX - mouseX)/zoom)*0.001, ((prevY - mouseY)/zoom)*0.001));
	}
	prevX = mouseX;
	prevY = mouseY;

	tools.cursor.x = toolbar.x + toolbar.width/6;
	tools.cursor.y = toolbar.y + toolbar.width/4;
	tools.pen.x = toolbar.x + toolbar.width/6;
	tools.pen.y = toolbar.y + toolbar.width/4 + toolHeight*2;

	if(mouseDown && tool === "Pen" && mouseX > 100) {
		var pt = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(mouseX, mouseY));
		currentStroke.push([pt.x, pt.y, penColor, penSize]);
	}
}

function draw() {
	update();

	// background(0);
	clear();

	// fill(255, 255, 255, 0.8);

	// ================== DRAW CURRENT STROKE ================== 

	beginShape();
	noFill();
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

	fill(255); // white
	textSize(16);
	text("X: " + mouseX + " | Y: " + mouseY + "\nTool: " + tool, 10, 20);

	stroke(0);
	strokeWeight(1);
	rect(toolbar.x, toolbar.y, toolbar.width, toolbar.height);

	cursor();
	for(var i in tools) {
		tools[i].hover = false;
		if(detectCollision(mouseX, mouseY, 1, 1, tools[i].x, tools[i].y, toolWidth, toolHeight)) {
			cursor(HAND);
			fill(220);
			noStroke();
			circle(tools[i].x + toolWidth/2, tools[i].y + toolHeight/2, toolWidth*1.2);
			tools[i].hover = true;
		}
		if(tool == tools[i].name) {
			fill(220);
			noStroke();
			circle(tools[i].x + toolWidth/2, tools[i].y + toolHeight/2, toolWidth*1.2);
		}
	}

	image(images.cursor, tools.cursor.x, tools.cursor.y);
	image(images.pen, tools.pen.x, tools.pen.y);

	zoomtools_draw();
	infopanel_draw();
	topbar_draw();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	toolbar.width = 48;
	toolbar.height = windowHeight/2;
	toolbar.x = toolbar.width;
	toolbar.y = windowHeight/2 - toolbar.height/2;
}

function mouseClicked() {
	for(var i in tools) {
		if(tools[i].hover) tool = tools[i].name;
	}
}

function mousePressed() {
	mouseDown = true;
}

function mouseReleased() {
	mouseDown = false;
	strokes.push(currentStroke);
	currentStroke = [];
}

function mouseWheel(event) {
	if(event.delta < 0) zoom *= 1-zoom_step;
	else zoom += 1+zoom_step;

	if(zoom > maxZoom) zoom = maxZoom;
	if(zoom < minZoom) zoom = minZoom;

	viewer.viewport.zoomTo(zoom);
}
