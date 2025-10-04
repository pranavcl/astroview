var myPicker;

function color_picker_preload() {
    myPicker = document.createElement("input");
    myPicker.setAttribute("type", "color");
	myPicker.value = "#FFFFFF";
    myPicker.style.position = "fixed";
    myPicker.style.top = "100px";
    myPicker.style.left = "47px";
    myPicker.style.zIndex = "300";
    document.body.appendChild(myPicker);
    return myPicker;
}

function hexToRgb(hex) {
	hex = hex.replace(/^#/, '');

	if (hex.length === 3) {
		hex = hex.split('').map(char => char + char).join('');
	}

	if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
		return null;
	}

	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	return [r,g,b];
}


function color_picker_setup() {
    color_picker_preload();
    // myPicker.position(48, 100);
}

function color_picker_update() {
    penColor = hexToRgb(myPicker.value);
}

function color_picker_draw() {

}

