window.onload = function(event) {
    document.getElementById("box").style.height = window.innerHeight.toString() + "px";
    document.getElementById("box").style.width = window.innerWidth.toString() + "px";
    document.getElementById("molly").innerHTML = "MOLLY";
    document.getElementById("molly_loop").addEventListener("play", function() {
        setInterval(function() {
            flashMolly();
        }, 429);
        setInterval(function() {
            fontFluctuate();
        }, 857);
    });
    document.getElementById("molly_loop").volume = 0.4;
}
window.onresize = function(event) {
    document.getElementById("box").style.height = window.innerHeight.toString() + "px";
    document.getElementById("box").style.width = window.innerWidth.toString() + "px";
}

var styles = ['bw', 'grey', 'colour']
var style = -1;

function changeStyle(id) {
    if (style < 0) {
        document.getElementById("molly_loop").play();
        document.getElementById("molly").style.fontSize = "0vw";
        style = 0;
    }
    else {
        style++;
        if (style >= styles.length) {
            style = 0;
        }
        id.class = styles[style];
    }
}

var font_list = ['Georgia, serif', '"Palatino Linotype", "Book Antiqua", Palatino, serif', '"Times New Roman", Times, serif', 'Arial, Helvetica, sans-serif', '"Arial Black", Gadget, sans-serif', '"Comic Sans MS", cursive, sans-serif', 'Impact, Charcoal, sans-serif', '"Lucida Sans Unicode", "Lucida Grande", sans-serif', 'Tahoma, Geneva, sans-serif', '"Trebuchet MS", Helvetica, sans-serif', 'Verdana, Geneva, sans-serif', '"Courier New", Courier, monospace', '"Lucida Console", Monaco, monospace'];

var font = -1;

function random(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

function chance(percent) {
    if (random(1, 100) <= percent) {
        return true;
    }
    return false;
}

function hexColour() {
    var red = random(0, 255);
    var green = random(0, 255);
    var blue = random(0, 255);
    var hexColour = red.toString(16) + green.toString(16) + blue.toString(16);
    return hexColour;
}

function fontFluctuate() {
    /*
     if (document.getElementById("molly").style.fontSize > "25vw") {
     document.getElementById("molly").style.fontSize = random(10, 20).toString() + "vw";
     }
     else {
     document.getElementById("molly").style.fontSize = random(30, 40).toString() + "vw";
     }
     */
    newSize = random(10, 38).toString() + "vw";
    while (document.getElementById("molly").style.fontSize == newSize) {
        newSize = random(10, 38).toString() + "vw";
    }
    document.getElementById("molly").style.fontSize = newSize;

    /*newFont = random(0, 12);
     while (font == newFont) {
     newFont = random(0, 12);
     }
     font = newFont;
     document.getElementById("molly").style.fontFamily = font_list[font];*/
}

function flashMolly() {
    if (document.getElementById("molly").class == 'bw') {
        flashBW();
    }
    else if (document.getElementById("molly").class == 'colour') {
        flashColour();
    }
    else if (document.getElementById("molly").class == 'grey') {
        flashGrey();
    }
    else {
        document.getElementById("molly").class == 'bw';
        flashBW();
    }
}

function flashColour() {
    document.bgColor = hexColour();
    document.getElementById("molly").style.color = "#" + hexColour();
}

function flashBW() {
    if (document.bgColor == "ffffff") {
        document.bgColor = "000000";
        document.getElementById("molly").style.color = "#ffffff";
    }
    else {
        document.bgColor = "ffffff";
        document.getElementById("molly").style.color = "#000000";
    }
}

function flashGrey() {
    document.getElementById("molly").style.color = "#7f7f7f";
    /*if (document.bgColor == "e5e5e5") {
     document.bgColor = "191919";
     }
     else {
     document.bgColor = "e5e5e5";
     }*/
    var rand = random(32, 204).toString(16);
    if (chance(20)) {
        rand = "7f";
    }
    document.bgColor = rand + rand + rand;
}

/*function flashFonts() {
 newFont = random(0, 12);
 while (font == newFont) {
 newFont = random(0, 12);
 }
 font = newFont;
 document.getElementById("molly").style.fontFamily = font_list[font];
 }*/