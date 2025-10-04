var tool = "Hand";
var zoom = 1;
var zoom_step = 0.05;
var maxZoom = 6.5;
var minZoom = 0.5;

var toolbar = {};

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

function preload() {
	images.cursor = loadImage("/images/cursor.png");
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	prevX = mouseX;
	prevY = mouseY;

	toolbar.width = 48;
	toolbar.height = windowHeight/2;
	toolbar.x = toolbar.width;
	toolbar.y = windowHeight/2 - toolbar.height/2;
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
	image(images.cursor, toolbar.x + toolbar.width/6, toolbar.y + toolbar.width/4);
	
	zoomtools_draw();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	toolbar.width = 48;
	toolbar.height = windowHeight/2;
	toolbar.x = toolbar.width;
	toolbar.y = windowHeight/2 - toolbar.height/2;
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
