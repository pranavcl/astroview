var tool = "Hand";
var zoom = 1;
var zoom_step = 0.05;
var maxZoom = 6.5;
var minZoom = 0.5;

var toolbar = {};
var tools = {};
tools.length = 7;
tools.cursor = {hover: false, name:"Hand"};
tools.pen = {hover: false, name:"Pen"};
tools.eraser = {hover: false, name:"Eraser"};
tools.text = {hover: false, name:"Text"};
tools.line = {hover: false, name:"Line"};
tools.rectangle = {hover: false, name:"Rectangle"};
tools.ellipse = {hover: false, name:"Ellipse"};

var toolWidth = 32;
var toolHeight = 32;

var panSpeed = 4;

var images = {};
var mouseDown = false;

var prevX;
var prevY;

var strokes = [];
var currentStroke = [];
var penColor = [255, 255, 255];
var penSize = 10;

var fontSize = 16;
var mainFont;

var texts = [];

// Fallback: 10552x2468
var imageWidth = 10552;
var imageHeight = 2468;

var linex = 0;
var liney = 0;

var viewer = OpenSeadragon({
	id: "openseadragon1",
	prefixUrl: "/openseadragon/images/",
	tileSources: "/dzi_images/m31_small.dzi",
	showNavigator: false,
	showZoomControl: false,
	showHomeControl: false,
	showFullPageControl: false
});

// viewer.viewport.zoomBy(1.2);
// viewer.viewport.panBy(new OpenSeadragon.Point(0, 0.01));

function detectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 &&
         x1 + w1 > x2 &&
         y1 < y2 + h2 &&
         y1 + h1 > y2;
}

function preload() {
	images.cursor = loadImage("/images/cursor.png");
	images.pen = loadImage("/images/pen.png");
	images.eraser = loadImage("/images/eraser.png");
	images.text = loadImage("/images/text.png");
	images.line = loadImage("/images/line.png");
	images.rectangle = loadImage("/images/rectangle.png");
	images.ellipse = loadImage("/images/ellipse.png");

	mainFont = loadFont("/fonts/ARIAL.ttf");

	zoomtools_preload();
	color_picker_preload();
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	textAlign(LEFT, TOP);

	prevX = mouseX;
	prevY = mouseY;

	toolbar.width = 48;
	toolbar.height = toolHeight*tools.length*2;
	toolbar.x = toolbar.width;
	toolbar.y = windowHeight/2 - toolbar.height/2;

	zoomtools_setup();
	imageWidth = viewer.world.getItemAt(0).source.dimensions.x;
	imageHeight = viewer.world.getItemAt(0).source.dimensions.y;

	infopanel_setup();
	topbar_setup();
	color_picker_setup();
}

function update() {
	zoomtools_update();
	infopanel_update();
	color_picker_update();
	topbar_update();

	if(mouseDown && prevX != mouseX && prevY != mouseY && tool === "Hand") {
		viewer.viewport.panBy(new OpenSeadragon.Point(((prevX - mouseX)/zoom)*0.001, ((prevY - mouseY)/zoom)*0.001));
	}
	prevX = mouseX;
	prevY = mouseY;

	if((tool === "Line" || tool === "Rectangle") && mouseDown && !linex && !liney) {
		linex = mouseX;
		liney = mouseY;
	}

	tools.cursor.x = toolbar.x + toolbar.width/6;
	tools.cursor.y = toolbar.y + toolbar.width/4;
	tools.pen.x = tools.cursor.x;
	tools.pen.y = tools.cursor.y + toolHeight*2;
	tools.eraser.x = tools.cursor.x;
	tools.eraser.y = tools.pen.y + toolHeight*2;
	tools.text.x = tools.cursor.x;
	tools.text.y = tools.eraser.y + toolHeight*2;
	tools.line.x = tools.cursor.x;
	tools.line.y = tools.text.y + toolHeight*2;
	tools.rectangle.x = tools.cursor.x;
	tools.rectangle.y = tools.line.y + toolHeight*2;
	tools.ellipse.x = tools.cursor.x;
	tools.ellipse.y = tools.rectangle.y + toolHeight*2;

	if(mouseDown && tool === "Pen" && mouseX > 100) {
		var pt = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(mouseX, mouseY));
		currentStroke.push([pt.x, pt.y, penColor, penSize]);
	}

	if(tool === "Eraser" && mouseDown) {
		for(var i=0; i < strokes.length; i++) {
			for(var j = 0; j < strokes[i].length; j++) {
				var pt = viewer.viewport.viewportToViewerElementCoordinates(new OpenSeadragon.Point(strokes[i][j][0], strokes[i][j][1]));
				if(dist(mouseX, mouseY, pt.x, pt.y) < penSize*2) {
					strokes.splice(i, 1);
					break;
				}
			}
		}
	}
}

function draw() {
	update();
	cursor();

	// background(0);
	clear();

	// fill(255, 255, 255, 0.8);

	noFill();

	// ================== DRAW CURRENT LINE ==================
	if(tool === "Line" && linex && liney) {
		stroke(255);
		beginShape();
		vertex(linex, liney);
		vertex(mouseX, mouseY);
		endShape();
	}


	// ================== DRAW CURRENT RECTANGLE ==================
	if(tool === "Rectangle" && linex && liney) {
		stroke(255);
		rect(linex, liney, mouseX - linex, mouseY - liney);
	}


	// ================== DRAW CURRENT STROKE ==================

	beginShape();
	for(var i = 0; i < currentStroke.length; i++) {
		stroke(currentStroke[i][2][0], currentStroke[i][2][1], currentStroke[i][2][2]);
		strokeWeight(currentStroke[i][3] * viewer.viewport.getZoom(true));
		var pt = viewer.viewport.viewportToViewerElementCoordinates(new OpenSeadragon.Point(currentStroke[i][0], currentStroke[i][1]));
		vertex(pt.x, pt.y);
	}
	endShape();

	// ================== DRAW ALL STROKES ==================

	for(var i = 0; i < strokes.length; i++) {
		beginShape();
		for(var j = 0; j < strokes[i].length; j++) {
			stroke(strokes[i][j][2][0], strokes[i][j][2][1], strokes[i][j][2][2]);
			strokeWeight(strokes[i][j][3] * viewer.viewport.getZoom(true));
			var pt = viewer.viewport.viewportToViewerElementCoordinates(new OpenSeadragon.Point(strokes[i][j][0], strokes[i][j][1]));
			vertex(pt.x, pt.y);
		}
		endShape();
	}
	noStroke();

	// ================== DRAW TEXTS ==================

	textFont(mainFont);
	for(var i = 0; i < texts.length; i++) {
		var pt = viewer.viewport.viewportToViewerElementCoordinates(new OpenSeadragon.Point(texts[i].x, texts[i].y));
		textSize(texts[i].fontSize*zoom);
		fill(texts[i].color);
		text(texts[i].content, pt.x, pt.y);

		var bbox = mainFont.textBounds(texts[i].content, pt.x, pt.y);
		texts[i].w = bbox.w;
		texts[i].h = bbox.h;

		if(tool === "Text" && detectCollision(mouseX, mouseY, 1, 1, bbox.x, bbox.y, bbox.w, bbox.h)) {
			cursor(TEXT);
			noFill();
			stroke(0, 0, 255);
			strokeWeight(1);
			rect(bbox.x, bbox.y, bbox.w, bbox.h);
		}
	}
	noStroke();

	textFont("Helvetica");
	fill(255,255,255,200); // white
	textSize(18);
	var pt = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(mouseX, mouseY));
	text("Zoom level: " + viewer.viewport.getZoom() + "\nImage X: " + parseInt(pt.x*imageWidth) + " | Image Y: " + parseInt(pt.y*imageWidth) + "\nX: " + mouseX + " | Y: " + mouseY + "\nTool: " + tool, 20, windowHeight-100);
	rect(toolbar.x, toolbar.y, toolbar.width, toolbar.height,5);

	for(var i in tools) {
		tools[i].hover = false;
		if(detectCollision(mouseX, mouseY, 1, 1, tools[i].x, tools[i].y, toolWidth, toolHeight)) {
			cursor(HAND);
			fill(220);
			noStroke();
			circle(tools[i].x + toolWidth/2, tools[i].y + toolHeight/2, toolWidth*1.2);
			tools[i].hover = true;
		}
		if(tool == tools[i].name) {
			fill(220);
			noStroke();
			circle(tools[i].x + toolWidth/2, tools[i].y + toolHeight/2, toolWidth*1.2);
		}
	}

	image(images.cursor, tools.cursor.x, tools.cursor.y);
	image(images.pen, tools.pen.x, tools.pen.y);
	image(images.eraser, tools.eraser.x, tools.eraser.y);
	image(images.text, tools.text.x, tools.text.y);
	image(images.line, tools.line.x, tools.line.y);
	image(images.rectangle, tools.rectangle.x, tools.rectangle.y);
	image(images.ellipse, tools.ellipse.x, tools.ellipse.y);

	zoomtools_draw();
	infopanel_draw();
	topbar_draw();
	color_picker_draw();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	toolbar.width = 48;
	toolbar.height = toolHeight*tools.length*2;
	toolbar.x = toolbar.width;
	toolbar.y = windowHeight/2 - toolbar.height/2;
}

function mouseClicked() {
	for(var i in tools) {
		if(tools[i].hover)
		if(tools[i].name === "Ellipse") return alert("Not implemented yet!");
		else tool = tools[i].name;
	}

	if(tool === "Text" && mouseX > 100) {
		var found = false;
		for(var i = 0; i < texts.length; i++) {
			var pt = viewer.viewport.viewportToViewerElementCoordinates(new OpenSeadragon.Point(texts[i].x, texts[i].y));
			if(detectCollision(mouseX, mouseY, 1, 1, pt.x, pt.y, texts[i].w, texts[i].h)) {
				newText = prompt("Change annotation (to delete, input nothing): ");
				if(!newText) return texts.splice(i, 1);
				texts[i].content = newText;
				found = true;
			}
		}
		if(found) return;
		var pt = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(mouseX, mouseY));
		var newText = {};
		newText.content = prompt("New annotation:");
		if(!newText.content) return;
		newText.x = pt.x;
		newText.y = pt.y;
		newText.fontSize = fontSize;
		newText.color = penColor;
		texts.push(newText);
	}
}

function mousePressed() {
	mouseDown = true;
}

function mouseReleased() {
	mouseDown = false;
	if(tool === "Line") {
		var pt1 = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(linex, liney));
		var pt2 = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(mouseX, mouseY));
		currentStroke.push([pt1.x, pt1.y, penColor, penSize]);
		currentStroke.push([pt2.x, pt2.y, penColor, penSize]);
		linex = liney = 0;
	}
	if(tool === "Rectangle") {
		var pt1 = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(linex, liney));
		var pt2 = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(mouseX, liney));
		var pt3 = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(mouseX, mouseY));
		var pt4 = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(linex, mouseY));
		var pts = [pt1, pt2, pt3, pt4, pt1];
		for(var i = 0; i < pts.length; i++) {
			currentStroke.push([pts[i].x, pts[i].y, penColor, penSize]);
		}
		linex = liney = 0;
	}
	if(currentStroke.length != 0) strokes.push(currentStroke);
	currentStroke = [];
}

function mouseWheel(event) {
	if(event.delta < 0) zoom *= 1-zoom_step;
	else zoom += 1+zoom_step;

	if(zoom > maxZoom) zoom = maxZoom;
	if(zoom < minZoom) zoom = minZoom;

	viewer.viewport.zoomTo(zoom);
}
