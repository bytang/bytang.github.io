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
    //test(canvas);
}

function main(canvas) {
    var cxt = new Painter(canvas);
    cxt.setContext("2d");

    //cxt.drawBackground("black");

    var box = new Sandbox();

    // Stats vars
    var sand, pixels;

    setInterval(function() {
        cxt.clear();
        box.tick();
        var visible = box.getEntitiesWithin(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < visible.length; i++) {
            cxt.bufferPixel(visible[i].position[0], visible[i].position[1], "#EDC9AF");
        }
        sand = visible.length.toString();
        pixels = cxt.bufferedList.length.toString();
        cxt.flush();
        //drawStats();
    }, 16.6667);

    setInterval(function() {
        checkUserInput();
    }, 20);

    // Inputs
    var mouseDown = 0;
    var mouseUp = 0;
    var mouseX = NaN;
    var mouseY = NaN;
    var oldMouseX = NaN;
    var oldMouseY = NaN;
    var time = 0;
    var mouse;

    canvas.onmousemove = function(e) {
        mouse = e;
    };

    canvas.onmousedown = function() {
        mouseDown = (new Date()).getTime();
    };

    canvas.onmouseup = function() {
        mouseUp = (new Date()).getTime();
    };

    canvas.onkeyup = function() {
        box.empty();
    };

    function checkUserInput() {
        if (mouse) {
            oldMouseX = mouseX;
            oldMouseY = mouseY;
            mouseX = mouse.clientX;
            mouseY = mouse.clientY;
            time = (new Date()).getTime();
            if (mouseDown > mouseUp) {
                addSandLine(oldMouseX, oldMouseY, mouseX, mouseY);
                //box.addSand(new Sand(mouseX, mouseY));
            }
        }
    }

    function addSandLine(a, b, c, d) {
        a = Math.round(a);
        b = Math.round(b);
        c = Math.round(c);
        d = Math.round(d);
        var xD = c - a;
        var yD = d - b;
        var dist = Math.round(Math.sqrt(Math.pow(xD, 2) + Math.pow(yD, 2)));
        for (var t = 0; t < dist; t++) {
            box.addSand(new Sand(a + xD / dist * t, b + yD / dist * t));
        }
    }

    function drawStats() {
        cxt.drawText(0, 40, sand, "40px Consolas", "#fff");
        cxt.drawText(0, 80, pixels, "40px Consolas", "#fff");
        cxt.drawText(0, 120, mouseDown.toString() + "  " + mouseUp.toString(), "40px Consolas", "#fff");
        cxt.drawText(0, 160, mouseX.toString() + "  " + mouseY.toString(), "40px Consolas", "#fff");
        cxt.drawText(0, 200, oldMouseX.toString() + "  " + oldMouseY.toString(), "40px Consolas", "#fff");
    }
}

function test(canvas) {
    var cxt = new Painter(canvas);
    cxt.setContext("2d");
    cxt.bufferLine(0, 0, 400, 400, "#ffffff");
    cxt.flush();
}

function Sandbox() {
    this.entities = [];
    this.activeEntities = [];

    this.addSand = function(object) {
        object.setParent(this);
        this.entities.push(object);
    };

    this.getEntitiesWithin = function(a, b, c, d) {
        var entities = [];
        for (var i = 0; i < this.activeEntities.length; i++) {
            if (pointWithinRect(this.activeEntities[i].position, [a, b, c, d])) {
                entities.push(this.activeEntities[i]);
            }
        }
        return entities;
    };

    this.notify = function(object) {
        this.activeEntities.push(object);
    };

    this.tick = function() {
        this.activeEntities = [];
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].tick();
        }
    };

    this.empty = function() {
        this.entities = [];
        this.activeEntities = [];
    };
}

function Sand(x, y) {
    this.position = [x, y];

    this.setParent = function(object) {
        this.parent = object;
    };

    this.notify = function() {
        this.parent.notify(this);
    };

    this.tick = function() {
        this.notify();
    };
}

// Canvas Drawing Wrapper

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
        this.bgColour = style;
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
        c = (c || canvas.width);
        d = (d || canvas.height);
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
}

// Random Generators

// getRandom(a, b) produces a real number in the set [a, b)
function getRandom(min, max) {
    if (min == max) {
        return min;
    }
    return Math.random() * (max - min) + min;
}

// getRandomInt(a, b) produces an integer in the set [a, b]
function getRandomInt(min, max) {
    if (min == max) {
        return min;
    }
    return Math.floor(getRandom(min, max + 1));
}

// getRandomChoice(list-of-choices) produces an element from list-of-choices
function getRandomChoice(choices) {
    return choices[getRandomInt(0, choices.length - 1)];
}

function randomHexColour(min, max) {
    return hexColourString(randomColour(min, max));
}

function randomColour(min, max) {
    if (min === undefined) {
        min = [0, 0, 0];
    }
    if (max === undefined) {
        max = [255, 255, 255];
    }
    var red = getRandomInt(min[0], max[0]);
    var green = getRandomInt(min[1], max[1]);
    var blue = getRandomInt(min[2], max[2]);
    return [red, green, blue];
}

function hexColourString(rgb) {
    function help(string) {
        if (string.length == 1) {
            return "0" + string;
        }
        return string;
    }

    return help(rgb[0].toString(16)) + help(rgb[1].toString(16)) + help(rgb[2].toString(16));
}

// Booleans

function pointWithinRect(pointVertexArray, rectVertexArray) {
    return !(pointVertexArray[0] < rectVertexArray[0] || pointVertexArray[1] < rectVertexArray[1] || pointVertexArray[0] > rectVertexArray[2] || pointVertexArray[1] > rectVertexArray[3]);
}