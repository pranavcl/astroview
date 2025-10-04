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
	rect(windowWidth-190,windowHeight-100,130,50);

	image(zoomIn,windowWidth-180,windowHeight-90);
	image(zoomOut,windowWidth-140, windowHeight-90);
	image(zoomReset,windowWidth-100, windowHeight-90);

	if(mouseDown){
		if(detectCollision(mouseX, mouseY, 1, 1, (windowWidth-190), (windowHeight-90), 32, 32)) {
			click_zoomIn();
		}
	}
}

function click_zoomIn(){
	zoom *= 1+zoom_step;

	if(zoom > maxZoom) zoom = maxZoom;

	viewer.viewport.zoomTo(zoom);
}

function detectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 &&
         x1 + w1 > x2 &&
         y1 < y2 + h2 &&
         y1 + h1 > y2;
}



function click_zoomOut(){
	zoom *= 1-zoom_step;
}

function click_zoomReset(){
	zoom = 1;
}
