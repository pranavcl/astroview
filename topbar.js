var text_size;

function topbar_setup() {

}

function topbar_update() {

}

function topbar_draw() {
	let mytext="ASTROVIEW";
	text_size=textWidth(mytext);
	fill(255,255,255,200);
	rect(0,0,windowWidth,60);
	fill('Black');
	text(mytext,(windowWidth/2)-(text_size/2),40);

	topbar_update()
}
