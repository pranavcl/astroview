function infopanel_setup() {

}

function infopanel_update() {

}

function infopanel_draw() {

	fill(255,255,255,200)
	rect(windowWidth-250,windowHeight-500,190,300);
	fill(0,0,0);
	textFont("Instrumental Sans", 30);
	text("Info",windowWidth-230,windowHeight-460);

	infopanel_update();
}
