var textstyle2;
var textstyle3;

var infopanel = {
	width: 230,
	height: 300
};
var padx = 30;

function infopanel_setup() {
	textstyle2 = loadFont("images/Instrument_Sans/InstrumentSans-VariableFont_wdth,wght.ttf");
	textstyle3 = loadFont("images/Instrument_Sans/static/InstrumentSans-Bold.ttf");
}

function infopanel_update() {

}

function infopanel_draw() {
	fill(255,255,255,190);
	infopanel.x = windowWidth-infopanel.width;
	infopanel.y = windowHeight/2-260;

	rect(infopanel.x, infopanel.y, infopanel.width - 50, infopanel.height-180,5);
	fill(0,0,0);
	textFont(textstyle3);

	textSize(24);
	text("Info Panel",infopanel.x + padx/2, infopanel.y + 10);

	textFont(textstyle2);
    textSize(13);
	text(`${urlParams.get('img')}.jpeg`,infopanel.x+padx/2, infopanel.y+50);
	text(`${urlParams.get('size')}MB `,infopanel.x+padx/2, infopanel.y+70);
	text(`${urlParams.get('dimensions')} pixels`,infopanel.x+padx/2, infopanel.y+90);

	infopanel_update();
}
