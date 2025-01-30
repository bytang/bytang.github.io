window.onload = init();

function init() {
    var canvas = document.getElementById("box");

    canvas.style.margin = "0";
    canvas.style.padding = "0";
    canvas.style.display = "block";
    canvas.style.outline = "none";
    canvas.tabIndex = 1000;
    canvas.parentNode.style.padding = "0";
    canvas.parentNode.style.backgroundColor = "black";

    if (canvas.parentNode == document.body) {
        canvas.parentNode.style.margin = "0";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        canvas.width = canvas.parentNode.offsetWidth;
        canvas.height = canvas.parentNode.offsetHeight;
    }

    canvas.onmouseover = function() {
        canvas.focus();
    };

    main(canvas);
}

function main(canvas) {
    var cxt = new Painter(canvas);
    cxt.setContext("2d");

    var kb = new Keyboard(canvas);
    var mouse = new Mouse(canvas);

    var readIntro;
    var lowestTime = NaN;

    setInterval(function() {
        cxt.resize();
        cxt.clear();
        if (kb.getKeysDownCount()) {
            readIntro = true;
            drawKeys();
        }
        if (mouse.getButtonsDownCount()) {
            drawButtons();
        }
        if (readIntro) {
            cxt.drawText(canvas.width / 2, canvas.height - 40, kb.getKeysDownCount().toString(), "40px Consolas", "#ffffff", "center");
            cxt.drawText(canvas.width / 2, 40, "Score: " + (Math.floor(1000000 / lowestTime) || 0).toString(), "40px Consolas", "#ffffff", "center");
            var mousePos = mouse.getPos();
            cxt.drawText(canvas.width / 2, 80, mousePos[0].toString() + "  " + mousePos[1].toString(), "40px Consolas", "#ffffff", "center");
        } else {
            drawIntro();
        }
    }, 5);

    function drawKeys() {
        var keysDown = kb.getKeysDown();
        var outString = "";
        for (var i = 0; i < keysDown.length; i++) {
            outString += kb.getKeyString(keysDown[i][0]) + " + ";
        }
        cxt.drawText(canvas.width / 2, canvas.height / 2 - 80, outString.substring(0, outString.length - 3), "40px Consolas", "#ffffff", "center");
        outString = "";
        for (i = 0; i < keysDown.length; i++) {
            outString += keysDown[i][0] + " + ";
        }
        cxt.drawText(canvas.width / 2, canvas.height / 2 - 40, outString.substring(0, outString.length - 3), "40px Consolas", "#ffffff", "center");
        outString = "";
        for (i = 0; i < keysDown.length; i++) {
            outString += kb.getDoubleTapDelay(keysDown[i][0]) + "ms + ";
        }
        cxt.drawText(canvas.width / 2, canvas.height / 2, outString.substring(0, outString.length - 3), "40px Consolas", "#ffffff", "center");
        outString = "";
        for (i = 0; i < keysDown.length; i++) {
            lowestTime = (Math.min((lowestTime || Infinity), kb.getDoubleTapDelayMin(keysDown[i][0])) || lowestTime);
            outString += kb.getDoubleTapDelayMin(keysDown[i][0]) + "ms + ";
        }
        cxt.drawText(canvas.width / 2, canvas.height / 2 + 40, outString.substring(0, outString.length - 3), "40px Consolas", "#ffffff", "center");
        outString = "";
        for (i = 0; i < keysDown.length; i++) {
            outString += kb.getKeyHeldTime(keysDown[i][0]) + "ms + ";
        }
        cxt.drawText(canvas.width / 2, canvas.height / 2 + 80, outString.substring(0, outString.length - 3), "40px Consolas", "#ffffff", "center");
    }

    function drawButtons() {
        var buttonsDown = mouse.getButtonsDown();
        var outString = "";
        for (var i = 0; i < buttonsDown.length; i++) {
            outString += buttonsDown[i][0] + " + ";
        }
        cxt.drawText(canvas.width / 2, 120, outString.substring(0, outString.length - 3), "40px Consolas", "#ffffff", "center");
    }

    function drawIntro() {
        cxt.drawText(canvas.width / 2, canvas.height / 2, "mash a button", "40px Consolas", "#ffffff", "center");
    }
}

function Keyboard(object) {
    var kb = this;
    this.keyPress = [];

    this.keyDown = [];
    this.keyUp = [];

    this.keyHeld = [];

    this.keyDelta = [];
    this.keyDeltaMin = [];
    this.keyDeltaMax = [];

    this.keysDownCount = 0;

    this.keyStrings = [];
    this.keyStrings[8] = "backspace";
    this.keyStrings[9] = "tab";
    this.keyStrings[13] = "enter";
    this.keyStrings[16] = "shift";
    this.keyStrings[17] = "ctrl";
    this.keyStrings[18] = "alt";
    this.keyStrings[19] = "pauseBreak";
    this.keyStrings[20] = "capsLock";
    this.keyStrings[27] = "escape";
    this.keyStrings[32] = "spacebar";
    this.keyStrings[33] = "pageUp";
    this.keyStrings[34] = "pageDown";
    this.keyStrings[35] = "end";
    this.keyStrings[36] = "home";
    this.keyStrings[37] = "leftArrow";
    this.keyStrings[38] = "upArrow";
    this.keyStrings[39] = "rightArrow";
    this.keyStrings[40] = "downArrow";
    this.keyStrings[45] = "insert";
    this.keyStrings[46] = "delete";
    this.keyStrings[48] = "0";
    this.keyStrings[49] = "1";
    this.keyStrings[50] = "2";
    this.keyStrings[51] = "3";
    this.keyStrings[52] = "4";
    this.keyStrings[53] = "5";
    this.keyStrings[54] = "6";
    this.keyStrings[55] = "7";
    this.keyStrings[56] = "8";
    this.keyStrings[57] = "9";
    this.keyStrings[59] = "semiColon";
    this.keyStrings[65] = "a";
    this.keyStrings[66] = "b";
    this.keyStrings[67] = "c";
    this.keyStrings[68] = "d";
    this.keyStrings[69] = "e";
    this.keyStrings[70] = "f";
    this.keyStrings[71] = "g";
    this.keyStrings[72] = "h";
    this.keyStrings[73] = "i";
    this.keyStrings[74] = "j";
    this.keyStrings[75] = "k";
    this.keyStrings[76] = "l";
    this.keyStrings[77] = "m";
    this.keyStrings[78] = "n";
    this.keyStrings[79] = "o";
    this.keyStrings[80] = "p";
    this.keyStrings[81] = "q";
    this.keyStrings[82] = "r";
    this.keyStrings[83] = "s";
    this.keyStrings[84] = "t";
    this.keyStrings[85] = "u";
    this.keyStrings[86] = "v";
    this.keyStrings[87] = "w";
    this.keyStrings[88] = "x";
    this.keyStrings[89] = "y";
    this.keyStrings[90] = "z";
    this.keyStrings[91] = "leftWindow";
    this.keyStrings[92] = "rightWindow";
    this.keyStrings[93] = "select";
    this.keyStrings[96] = "num0";
    this.keyStrings[97] = "num1";
    this.keyStrings[98] = "num2";
    this.keyStrings[99] = "num3";
    this.keyStrings[100] = "num4";
    this.keyStrings[101] = "num5";
    this.keyStrings[102] = "num6";
    this.keyStrings[103] = "num7";
    this.keyStrings[104] = "num8";
    this.keyStrings[105] = "num9";
    this.keyStrings[106] = "multiply";
    this.keyStrings[107] = "add";
    this.keyStrings[109] = "subtract";
    this.keyStrings[110] = "decimal";
    this.keyStrings[111] = "divide";
    this.keyStrings[112] = "f1";
    this.keyStrings[113] = "f2";
    this.keyStrings[114] = "f3";
    this.keyStrings[115] = "f4";
    this.keyStrings[116] = "f5";
    this.keyStrings[117] = "f6";
    this.keyStrings[118] = "f7";
    this.keyStrings[119] = "f8";
    this.keyStrings[120] = "f9";
    this.keyStrings[121] = "f10";
    this.keyStrings[122] = "f11";
    this.keyStrings[123] = "f12";
    this.keyStrings[144] = "numLock";
    this.keyStrings[145] = "scrollLock";
    this.keyStrings[186] = "semiColon";
    this.keyStrings[187] = "equal";
    this.keyStrings[188] = "comma";
    this.keyStrings[189] = "dash";
    this.keyStrings[190] = "period";
    this.keyStrings[191] = "forwardSlash";
    this.keyStrings[192] = "graveAccent";
    this.keyStrings[219] = "openBracket";
    this.keyStrings[220] = "backSlash";
    this.keyStrings[221] = "closeBraket";
    this.keyStrings[222] = "singleQuote";

    this.keyCodes = {
        "backspace": 8,
        "tab": 9,
        "enter": 13,
        "shift": 16,
        "ctrl": 17,
        "alt": 18,
        "pauseBreak": 19,
        "capsLock": 20,
        "escape": 27,
        "spacebar": 32,
        "pageUp": 33,
        "pageDown": 34,
        "end": 35,
        "home": 36,
        "left": 37,
        "up": 38,
        "right": 39,
        "down": 40,
        "insert": 45,
        "delete": 46,
        "0": 48,
        "1": 49,
        "2": 50,
        "3": 51,
        "4": 52,
        "5": 53,
        "6": 54,
        "7": 55,
        "8": 56,
        "9": 57,
        "a": 65,
        "b": 66,
        "c": 67,
        "d": 68,
        "e": 69,
        "f": 70,
        "g": 71,
        "h": 72,
        "i": 73,
        "j": 74,
        "k": 75,
        "l": 76,
        "m": 77,
        "n": 78,
        "o": 79,
        "p": 80,
        "q": 81,
        "r": 82,
        "s": 83,
        "t": 84,
        "u": 85,
        "v": 86,
        "w": 87,
        "x": 88,
        "y": 89,
        "z": 90,
        "leftWindow": 91,
        "rightWindow": 92,
        "select": 93,
        "num0": 96,
        "num1": 97,
        "num2": 98,
        "num3": 99,
        "num4": 100,
        "num5": 101,
        "num6": 102,
        "num7": 103,
        "num8": 104,
        "num9": 105,
        "multiply": 106,
        "add": 107,
        "subtract": 109,
        "decimal": 110,
        "divide": 111,
        "f1": 112,
        "f2": 113,
        "f3": 114,
        "f4": 115,
        "f5": 116,
        "f6": 117,
        "f7": 118,
        "f8": 119,
        "f9": 120,
        "f10": 121,
        "f11": 122,
        "f12": 123,
        "numLock": 144,
        "scrollLock": 145,
        "semiColon": 59,
        "equal": 187,
        "comma": 188,
        "dash": 189,
        "period": 190,
        "forwardSlash": 191,
        "graveAccent": 192,
        "openBracket": 219,
        "backSlash": 220,
        "closeBracket": 221,
        "singleQuote": 222
    };

    object.parentNode.onblur = function() {
        //console.log("window lost focus");
        if (kb.getKeysDownCount()) {
            kb.resetKeys();
        }
    };

    object.parentNode.oncontextmenu = function() {
        //console.log("window context menu");
        if (kb.getKeysDownCount()) {
            kb.resetKeys();
        }
    };

    object.onkeydown = function(e) {
        e.preventDefault();
        var time = (new Date()).getTime();
        if (!kb.keyPress[e.which]) {
            kb.keysDownCount++;
            kb.keyHeld[e.which] = 0;
            kb.keyPress[e.which] = true;
            var delta = time - kb.keyDown[e.which];
            kb.keyDeltaMin[e.which] = (Math.min(delta, kb.keyDeltaMin[e.which]) || delta || kb.keyDeltaMin[e.which]);
            kb.keyDeltaMax[e.which] = (Math.max(delta, kb.keyDeltaMax[e.which]) || delta || kb.keyDeltaMax[e.which]);
            kb.keyDelta[e.which] = delta;
        } else {
            kb.keyHeld[e.which] = kb.keyHeld[e.which] + time - kb.keyDown[e.which];
        }
        kb.keyDown[e.which] = time;
    };

    object.onkeyup = function(e) {
        kb.keysDownCount = Math.max(0, kb.keysDownCount - 1);
        kb.keyPress[e.which] = false;
        kb.keyUp[e.which] = (new Date()).getTime();
        kb.keyHeld[e.which] += kb.keyUp[e.which] - kb.keyDown[e.which];
    };

    this.isKeyDown = function(keyCode) {
        return this.keyDown[keyCode] > (this.keyUp[keyCode] || -1);
    };

    this.getKeysDownCount = function() {
        return this.keysDownCount;
    };

    this.getDoubleTapDelay = function(keyCode) {
        return this.keyDelta[keyCode] === undefined ? NaN : this.keyDelta[keyCode];
    };

    this.getDoubleTapDelayMin = function(keyCode) {
        return this.keyDeltaMin[keyCode] === undefined ? NaN : this.keyDeltaMin[keyCode];
    };

    this.getKeyString = function(keyCode) {
        return this.keyStrings[keyCode];
    };

    this.getKeyCode = function(keyString) {
        return this.keyCodes[keyString];
    };

    this.getKeysDown = function() {
        var keysDown = [];
        for (var i = 0; i < this.keyDown.length; i++) {
            if (this.isKeyDown(i)) {
                keysDown.push([i, this.keyDown[i]]);
            }
        }
        keysDown.sort(function(a, b) {
            return a[1] - b[1]
        });
        return keysDown;
    };

    this.getKeyHeldTime = function(keyCode) {
        if (this.keyPress[keyCode]) {
            return this.keyHeld[keyCode];
        }
        return NaN;
    };

    this.resetKeys = function() {
        this.keyDown = [];
        this.keyUp = [];
    };
}

function Mouse(object) {
    var mouse = this;
    this.x = NaN;
    this.y = NaN;
    this.buttonDown = [];
    this.buttonUp = [];
    this.buttonDelta = [];
    this.buttonDeltaMin = [];
    this.buttonsDownCount = 0;

    object.onmousedown = function(e) {
        mouse.buttonDown[e.which] = [(new Date()).getTime(), [mouse.x, mouse.y]];
        mouse.buttonsDownCount++;
    };

    object.onmouseup = function(e) {
        mouse.buttonUp[e.which] = [(new Date()).getTime(), [mouse.x, mouse.y]];
        mouse.buttonsDownCount--;
    };

    object.onmousemove = function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };

    this.isButtonDown = function(button) {
        if (this.buttonDown[button]) {
            if (this.buttonUp[button]) {
                return this.buttonDown[button][0] > this.buttonUp[button][0];
            }
            return true;
        }
        return false;
    };

    this.getButtonsDown = function() {
        var buttonsDown = [];
        if (this.getButtonsDownCount()) {
            for (var i = 0; i < this.buttonDown.length; i++) {
                if (this.isButtonDown(i)) {
                    buttonsDown.push([i, this.buttonDown[i]]);
                }
            }
            buttonsDown.sort(function(a, b) {
                return a[1] - b[1];
            });
        }
        return buttonsDown;
    };

    this.getButtonsDownCount = function() {
        return this.buttonsDownCount;
    };

    this.getPos = function() {
        return [this.x, this.y];
    };
}

function Painter(canvas) {
    this.canvas = canvas;
    this.cxt = this.canvas.getContext("2d");
    this.buffer = [];
    this.bufferedList = [];
    this.lastFlush = (new Date()).getTime();

    this.setContext = function(drawMode) {
        this.cxt = this.canvas.getContext(drawMode);
    };

    this.contains = function(x, y) {
        return !(x < 0 || x >= canvas.width || y < 0 || y >= canvas.height);
    };

    this.drawBackground = function(style) {
        this.bgColour = (style || "#000");
        this.drawRect(0, 0, this.canvas.width, this.canvas.height, style);
    };

    this.drawText = function(x, y, string, font, style, align, baseline) {
        x = Math.round(x);
        y = Math.round(y);
        this.cxt.fillStyle = "black";
        if (font !== undefined) {
            this.cxt.font = font;
        }
        if (style !== undefined) {
            this.cxt.fillStyle = style;
        }
        if (align !== undefined) {
            this.cxt.textAlign = align;
        }
        if (baseline !== undefined) {
            this.cxt.textBaseline = baseline;
        }
        this.cxt.fillText(string, x, y);
    };

    this.drawLine = function(a, b, c, d, colour) {
        a = Math.round(a);
        b = Math.round(b);
        c = Math.round(c);
        d = Math.round(d);
        this.cxt.strokeStyle = (colour || "#000");
        this.cxt.beginPath();
        this.cxt.moveTo(a, b);
        this.cxt.lineTo(c, d);
        this.cxt.stroke();
    };

    this.drawRect = function(a, b, c, d, colour) {
        a = Math.round(a);
        b = Math.round(b);
        c = Math.round(c);
        d = Math.round(d);
        this.cxt.fillStyle = (colour || "#000");
        this.cxt.fillRect(a, b, c - a, d - b);
    };

    this.drawPixel = function(x, y, colour) {
        x = Math.round(x);
        y = Math.round(y);
        this.cxt.fillStyle = (colour || "#000");
        this.cxt.fillRect(x, y, 1, 1);
    };

    this.bufferLine = function(a, b, c, d, colour) {
        a = Math.round(a);
        b = Math.round(b);
        c = Math.round(c);
        d = Math.round(d);
        var xD = c - a;
        var yD = d - b;
        var dist = Math.ceil(Math.sqrt(Math.pow(xD, 2) + Math.pow(yD, 2)));
        for (var t = 0; t < dist; t++) {
            this.bufferPixel(a + xD / dist * t, b + yD / dist * t, colour);
        }
    };

    this.bufferPixel = function(x, y, colour) {
        x = Math.round(x);
        y = Math.round(y);
        if (this.contains(x, y)) {
            if (this.buffer[x + this.canvas.width * y] === undefined || this.buffer[x + this.canvas.width * y][0] != this.lastFlush) {
                this.bufferedList.push(x + this.canvas.width * y);
            }
            this.buffer[x + this.canvas.width * y] = [this.lastFlush, (colour || "#000")];
        }
    };

    this.flush = function() {
        for (var i = 0; i < this.bufferedList.length; i++) {
            this.drawPixel(this.bufferedList[i] % this.canvas.width, Math.floor(this.bufferedList[i] / this.canvas.width), this.buffer[this.bufferedList[i]][1]);
        }
        this.bufferedList = [];
        this.lastFlush = (new Date()).getTime();
    };

    this.clear = function(a, b, c, d) {
        a = (a || 0);
        b = (b || 0);
        c = (c || this.canvas.width);
        d = (d || this.canvas.height);
        // Store the current transformation matrix
        this.cxt.save();

        // Use the identity matrix while clearing the canvas
        this.cxt.setTransform(1, 0, 0, 1, 0, 0);
        this.cxt.clearRect(a, b, c, d);

        // Restore the transform
        this.cxt.restore();
        if (this.bgColour !== undefined) {
            this.drawBackground(this.bgColour);
        }
    };

    this.resize = function() {
        if (this.canvas.parentNode == document.body) {
            if (this.canvas.width != window.innerWidth) {
                this.canvas.width = window.innerWidth;
            }
            if (this.canvas.height != window.innerHeight) {
                this.canvas.height = window.innerHeight;
            }
        } else {
            if (this.canvas.width != this.canvas.parentNode.offsetWidth) {
                this.canvas.width = this.canvas.parentNode.offsetWidth;
            }
            if (this.canvas.height != this.canvas.parentNode.offsetHeight) {
                this.canvas.height = this.canvas.parentNode.offsetHeight;
            }
        }
    };
}