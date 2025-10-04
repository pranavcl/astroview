var zoomIn;
var zoomOut;
var zoomeset;

function zoomtools_preload(){
	zoomIn = loadImage('images/zoom-in.png');
	zoomOut = loadImage('images/zoom-out.png');
	zoomReset = loadImage('images/zoom_reset.png');
}

function zoomtools_setup() {

}

function zoomtools_update() {

}

function zoomtools_draw() {
	fill(255,255,255);
	rect(1320,650,150,50);

	image(zoomIn, 1340, 660);
	image(zoomOut, 1380, 660);
	image(zoomReset, 1420, 660);
}
