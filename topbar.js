var fontstyle;
var backArrow = {
	x: 25,
	y: 15,
	width: 32,
	height: 32,
	hover: false
};
var shareBtn = {
	width: 32,
	height: 32,
	hover: false
};
function topbar_setup() {
	fontstyle = loadFont("images/Space_Mono/SpaceMono-Bold.ttf");
	backArrow.image = loadImage("images/arrow.png");

	shareBtn.image = loadImage("/images/share.png");
}

function topbar_update() {
	backArrow.hover = false;
	shareBtn.hover = false;
	var btns = [backArrow, shareBtn];

	shareBtn.x = windowWidth - shareBtn.width*1.2;
	shareBtn.y = 15;
	for(var i in btns) {
		if(detectCollision(mouseX, mouseY, 1, 1, btns[i].x, btns[i].y, btns[i].width, btns[i].height)) {
			cursor(HAND);
			btns[i].hover = true;
		}
	}

	if(!mouseDown) return;
	if(backArrow.hover) window.location.href = "/lobby.html";
	if(shareBtn.hover) {
		alert("Not implemented yet!");
		mouseDown = false;
		shareBtn.hover = false;
	}
}

function topbar_draw() {
	fill(255,255,255,200);
	rect(0,0,windowWidth, 60);
	fill(0,0,0);
	textSize(30);
	textFont(fontstyle);
	textAlign(CENTER);
	text("ASTROVIEW",(windowWidth > 1188) ? (windowWidth/2-20):(windowWidth-200), 5);
	textAlign(LEFT, TOP);

	textFont(textstyle2);
	textSize((windowWidth > 778) ? 28:14);
	text("Messier 31 (Andromeda Galaxy)", 80, 10);
	textFont(fontstyle);

	image(backArrow.image, backArrow.x, backArrow.y);
	image(shareBtn.image, shareBtn.x, shareBtn.y);

	topbar_update()
}
