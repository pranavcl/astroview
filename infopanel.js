var boldFont;
var normalFont;
var milky_way;
var forward;

var infopanel = {
	width: 230,
	height: 300
};
var padx = 32;

function infopanel_setup() {
	boldFont = loadFont("/fonts/ARIALBD.ttf");
	normalFont = loadFont("/fonts/ARIAL.ttf");
	milky_way=loadImage("/images/milky_way.png");
	forward=loadImage("/images/next.png");
}

function infopanel_update() {

}

function infopanel_draw() {
	fill(255,255,255,235);
	infopanel.x = windowWidth-infopanel.width;
	infopanel.y = windowHeight/2-infopanel.height/2;
	rect(infopanel.x, infopanel.y, infopanel.width, infopanel.height-160);
	fill(0,0,0);
	textFont(boldFont);
	textSize(24);
	image(forward,infopanel.x+padx/2, infopanel.y+padx*1-12, 16, 16);
	text("    Info Panel",infopanel.x+padx, infopanel.y+padx);
	textFont(normalFont);
    textSize(16);
	text("    Image Name:Image1.jpeg",infopanel.x+padx/2, infopanel.y+padx*2-12);
	image(milky_way, infopanel.x+padx/2, infopanel.y+padx*2.5-12, 16, 16);
	text("    ImageSize :9.7MB ",infopanel.x+padx/2, infopanel.y+padx*2.5);
	text("    Window Width: 10552 ",infopanel.x+padx/2, infopanel.y+padx*3.1);
	text(" Window Height:2468 ",infopanel.x+padx/1.01, infopanel.y+padx*3.7);
	infopanel_update();
}
