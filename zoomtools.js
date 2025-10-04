var zoomTools = {}
zoomTools.zoomIn = {hover:false, name:"zoomIn"}
zoomTools.zoomOut = {hover:false, name:"zoomOut"}
zoomTools.zoomReset = {hover:false, name:"zoomReset"}

var zoomImages = {}

var zoomIn;
var zoomOut;
var zoomeset;

function zoomtools_preload(){
	zoomImages.zoomIn = loadImage('images/zoom-in.png');
	zoomImages.zoomOut = loadImage('images/zoom-out.png');
	zoomImages.zoomReset = loadImage('images/zoom_reset.png');
}

function zoomtools_setup() {

}

function zoomtools_update() {

}


function zoomtools_draw() {
	fill(255,255,255,200);
	rect(windowWidth-190,windowHeight-100,130,50,5);

	zoomTools.zoomIn.x = windowWidth-180;
	zoomTools.zoomIn.y = windowHeight-90;
	zoomTools.zoomOut.x = windowWidth-140;
	zoomTools.zoomOut.y = windowHeight-90;
	zoomTools.zoomReset.x = windowWidth-100;
	zoomTools.zoomReset.y = windowHeight-90;

	image(zoomImages.zoomIn,zoomTools.zoomIn.x,zoomTools.zoomIn.y);
	image(zoomImages.zoomOut,zoomTools.zoomOut.x, zoomTools.zoomOut.y);
	image(zoomImages.zoomReset,zoomTools.zoomReset.x, zoomTools.zoomReset.y);

	if (tool != "Pen") {
		for(var i in zoomTools) {
		zoomTools[i].hover = false;
		if(detectCollision(mouseX, mouseY, 1, 1, zoomTools[i].x, zoomTools[i].y, 32, 32)) {
			cursor(HAND);
			fill(255,255,255,150);
			noStroke();
			square(zoomTools[i].x - 4, zoomTools[i].y - 4, 36,5);
			zoomTools[i].hover = true;
		}
		if(tool == zoomTools[i].name) {
			fill(255,255,255,100);
			noStroke();
			square(zoomTools[i].x - 4, zoomTools[i].y - 4, 36,5);
		}
		}
	}


	if(mouseDown && tool === "Hand") {
		if(detectCollision(mouseX, mouseY, 1, 1, (windowWidth-180), (windowHeight-90), 32, 32)) {
			click_zoomIn();
		}
		if(detectCollision(mouseX, mouseY, 1, 1, (windowWidth-140), (windowHeight-90), 32, 32)) {
			click_zoomOut();
		}
		if(detectCollision(mouseX, mouseY, 1, 1, (windowWidth-100), (windowHeight-90), 32, 32)) {
			click_zoomReset();
		}
	}
}

function click_zoomIn(){
	zoom *= 1+zoom_step;
	if(zoom > maxZoom) zoom = maxZoom;
	viewer.viewport.zoomTo(zoom);
	console.log("Zoomed in");
}

function click_zoomOut(){
	zoom *= 1-zoom_step;
	if(zoom > maxZoom) zoom = maxZoom;
	viewer.viewport.zoomTo(zoom);
	console.log("Zoomed Out");
}

function click_zoomReset(){
	zoom = 1;
	if(zoom > maxZoom) zoom = maxZoom;
	if(zoom < minZoom) zoom = minZoom;
	viewer.viewport.zoomTo(zoom);
	console.log("Zoom Reset");
}

function detectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 &&
         x1 + w1 > x2 &&
         y1 < y2 + h2 &&
         y1 + h1 > y2;
}



