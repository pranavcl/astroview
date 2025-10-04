var fontstyle;
function topbar_setup() {
	fontstyle = loadFont("images/Space_Mono/SpaceMono-Bold.ttf");
}

function topbar_update() {

}

function topbar_draw() {
	fill(255,255,255,200);
	rect(0,0,windowWidth, 60);
	fill(0,0,0);
	textSize(30);
	textFont(fontstyle);
	textAlign(CENTER);
	text("ASTROVIEW",windowWidth/2-20, 5);
	textAlign(LEFT, TOP);

	topbar_update()
}
