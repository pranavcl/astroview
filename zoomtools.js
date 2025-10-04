var zoomIn;
var zoomOut;
var zoomeset;

function zoomtools_preload(){
	zoomIn = loadImage('images/zoom-in.png');
	zoomOut = loadImage('images/zoom-out.png');
	zoomeset = loadImage('images/zoom_reset.png');
}

function zoomtools_setup() {
}

function zoomtools_update() {

}

function zoomtools_draw() {
	image(zoomIn, 1360, 660);
}
