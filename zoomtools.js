function zoomtools_setup() {

}

function zoomtools_update() {

}

function zoomtools_draw() {

	fill(0, 255, 0);

	rect(1260, 660, 32, 32);
	rect(1300, 660, 32, 32);
	rect(1340, 660, 32, 32);

	rect(zoombar.x, zoombar.y, zoombar.width, zoombar.height);

	// zoomIn = createButton('zoom in');
	// zoomIn.position(1260, 660)
	// zoomIn.position(1000,1900);
	// zoomOut = createButton('zoom out');
	// resetZoom = createButton('zoom out');

	// zoom_in.mousePressed(repaint);
}
