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

var images = {};
var mouseDown = false;

var prevX;
var prevY;

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
}

function update() {
	zoomtools_update();
	if(mouseDown && prevX != mouseX && prevY != mouseY) {
		viewer.viewport.panBy(new OpenSeadragon.Point(0.001*(prevX - mouseX)/zoom, 0.001*(prevY - mouseY)/zoom));
	}
	prevX = mouseX;
	prevY = mouseY;
}

function draw() {
	update();

	// background(0);
	clear();
	fill(255); // white
	textSize(16);
	text("X: " + mouseX + " | Y: " + mouseY + "\nTool: " + tool, 10, 20);

	// fill(255, 255, 255, 0.8);

	rect(toolbar.x, toolbar.y, toolbar.width, toolbar.height);

	tools.cursor.x = toolbar.x + toolbar.width/6;
	tools.cursor.y = toolbar.y + toolbar.width/4;

	tools.pen.x = toolbar.x + toolbar.width/6;
	tools.pen.y = toolbar.y + toolbar.width/4 + toolHeight*2;

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

	stroke(0);

	image(images.cursor, tools.cursor.x, tools.cursor.y);
	image(images.pen, tools.pen.x, tools.pen.y);

	zoomtools_draw();
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
}

function mouseWheel(event) {
	if(event.delta < 0) zoom *= 1-zoom_step;
	else zoom += 1+zoom_step;

	if(zoom > maxZoom) zoom = maxZoom;
	if(zoom < minZoom) zoom = minZoom;

	viewer.viewport.zoomTo(zoom);
}
