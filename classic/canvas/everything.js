var firefox = true;//navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

var canvas;
var cxt;

var mouseX = 400;
var mouseY = 300;

var dots = [];

var timeScale = 2;
var timeBetweenFrames = 0;

var cleanIndex = 0;

var updates = 0;
var frames = 0;
var fps = 0;
var targetFPS = 30;

var showStats = false;
var showStatsTimeout = undefined;

var grav = 3;

var hueOffset = 0;

var maxDots = 1000;
var amountOfDots;
var visible;
var dotColour;
var dotMode = 1;

var maxVel = 350;
var minVel = 0;

var frame;
var noPixel;

var windowChange;

var lastButton = 1;

var gravPoints = [
    [200, 150],
    [200, 450],
    [600, 150],
    [600, 450]
];

window.onload = init();

function getRandom(min, max) {
    if (min == max) {
        return min;
    }
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    if (min == max) {
        return min;
    }
    return Math.floor(getRandom(min, max + 1));
}

function getRandomChoice(choices) {
    return choices[getRandomInt(0, choices.length - 1)];
}

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
}

function randomHexColour(min) {
    return hexColourString(randomColour(min));
}

function randomColour(min) {
    var red = getRandomInt(0, 255);
    var green = getRandomInt(0, 255);
    var blue = getRandomInt(0, 255);
    while (red + blue + green < min) {
        red = getRandomInt(0, 255);
        green = getRandomInt(0, 255);
        blue = getRandomInt(0, 255);
    }
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

function speedToColour(xV, yV) {
    xV = abs(xV);
    yV = abs(yV);
    //return hslToRgb(0, 0, Math.min((xV + yV) * 2, 255) / 255); // Greyscale
    //return hslToRgb((Math.min((xV + yV) * 2, 255) / 255 * 360 + hueOffset) % 360 / 360, 1, 0.5); // Colour Mode 1
    return hslToRgb(((abs(xV) + abs(yV) - minVel) / maxVel * 360 + hueOffset) % 360 / 360, 1, 0.5); // Colour Mode 2
}

function abs(n) {
    if (n < 0) {
        n = -n;
    }
    return n;
}

function Particle(xPos, yPos, xVel, yVel) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVel = xVel;
    this.yVel = yVel;
    this.mass = 1;
    this.radius = getRandom(2, 6);
    this.colour = randomColour(0);
    this.active = true;
    this.life = true;

    var that = this;

    this.accelerate = function(xAcc, yAcc, duration) {
        that.xVel += xAcc * duration;
        that.yVel += yAcc * duration;
        if (abs(xAcc) + abs(yAcc) > 3000) {
            that.life = false;
        }
        //var b = 110;
        //that.xVel = bound(that.xVel, -b, b);
        //that.yVel = bound(that.yVel, -b, b);
    }

    this.displace = function(duration) {
        that.xPos += that.xVel * duration;
        that.yPos += that.yVel * duration;
        if (that.life == false && Math.sqrt(Math.pow(that.xVel, 2) + Math.pow(that.yVel, 2)) < 10) {
            that.active = false;
            amountOfDots--;
        }
    }
}

function bound(n, lower, upper) {
    return Math.max(Math.min(n, upper), lower);
}

function init() {
    canvas = document.getElementById("box");
    canvas.style.margin = "0";
    canvas.style.padding = "0";
    canvas.style.display = "block";
    canvas.parentNode.style.padding = "0";
    if (canvas.parentNode == document.body) {
        canvas.parentNode.style.backgroundColor = "black";
        canvas.parentNode.style.margin = "0";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        canvas.width = canvas.parentNode.offsetWidth;
        canvas.height = canvas.parentNode.offsetHeight;
    }
    cxt = canvas.getContext("2d");
    if (firefox) {
        noPixel = [];
        for (var i = 0; i < canvas.height; i++) {
            noPixel[i] = [];
            for (var j = 0; j < canvas.width; j++) {
                noPixel[i][j] = true;
            }
        }
        //frame = new FrameBuffer(canvas.width, canvas.height, 0, 0);
    } else {
        frame = new FrameBuffer(canvas.width, canvas.height, 0, 0);
    }

    clear(canvas);

    newcanvas();
    sprinkledots();
    //drawdots();

    //time = d.getTime();

    timeBetweenFrames = timeScale / 200;
    canvas.addEventListener('mousemove', function() {
        clearTimeout(showStatsTimeout);
        if (lastButton == 1 || showStats) {
            showStats = true;
            showStatsTimeout = setTimeout(function() {
                showStats = false;
            }, 2000);
        }
    });
    canvas.addEventListener('mouseout', function() {
        showStats = false;
    });
    //canvas.addEventListener('mousemove', getMousePos);
    canvas.addEventListener('mouseup', function(e) {
        if (e.which == 1) {
            if (lastButton == 1) {
                newcanvas();
                sprinkledots();
            }
        }
        lastButton = e.which;
    });
    //canvas.addEventListener('mousedown', function(e){getMousePos(e); spawnDot(mouseX, mouseY, 100, 0);});
    setInterval(function() {
        update();
    }, timeScale);
    setInterval(function() {
        render();
    }, 1000/targetFPS);
    setInterval(function(){cleanup();}, 1000);
    setInterval(function() {
        fps = frames;
        frames = 0;
    }, 1000);

    windowChange = false;
}

function newcanvas() {
    dots = [];
}

function sprinkledots() {
    var randStart = getRandom(10, 100);
    var choice = getRandomInt(0, 5);
    var startX = getRandom(0, canvas.width);
    amountOfDots = maxDots;
    hueOffset = getRandomInt(0, 360);
    grav = getRandom(1, 7);
    gravPoints = [
        [canvas.width / 2, canvas.height / 2]
    ];
    //for (var i = 0; i < 1; i++) {
    //   gravPoints.push([getRandom(0, canvas.width), getRandom(0, canvas.height)]);
    //}
    if (choice == 0) {
        for (var i = 0; i < amountOfDots; i++) {
            spawnDot(startX, box.height / 2, getRandom(-randStart, randStart), getRandom(-randStart, randStart));
        }
    }
    else if (choice == 1) {
        for (var i = 0; i < amountOfDots; i++) {
            spawnDot(startX, box.height / 2, 0, getRandom(-randStart, randStart));
        }
    }
    else if (choice == 2) {
        for (var i = 0; i < amountOfDots; i++) {
            var speed = getRandom(-randStart, randStart);
            var mult = getRandomChoice([-1, 1]);
            spawnDot(startX, box.height / 2, speed, mult * speed);
        }
    }
    else if (choice == 3) {
        for (var i = 0; i < amountOfDots; i++) {
            var speed = getRandom(-randStart, randStart);
            spawnDot(startX, box.height / 2, speed, speed);
        }
    }
    else if (choice == 4) {
        var spacing = getRandomInt(5, 80);
        var mult = getRandomChoice([-1, 1]);
        for (var i = 0; i < amountOfDots; i++) {
            spawnDot(getRandom(box.width / 2, box.width / 2 + box.width / 2 * -mult), getRandomChoice([box.height / 2 - spacing, box.height / 2 + spacing]), getRandom(20, 80) * mult, 0);
        }
    }
    else if (choice == 5) {
        gravPoints = [];
        for (var i = 0; i < 2; i++) {
            gravPoints.push([getRandom(0, canvas.width), getRandom(0, canvas.height)]);
        }
        for (var i = 0; i < amountOfDots; i++) {
            spawnDot(getRandom(0, canvas.width), getRandom(0, canvas.height), 0, 0);
        }
    }
}

function spawnDot(xP, yP, xV, yV) {
    dots.push(new Particle(xP, yP, xV, yV));
}

function update() {
    updates++;
    gravitate(timeBetweenFrames);
    displaceAll(timeBetweenFrames);
}

function gravitate(time) {
    if (mouseX > -1) {
        for (var i = 0; i < dots.length; i++) {
            if (dots[i].active) {
                var xAcc = 0;
                var yAcc = 0;
                for (var k = 0; k < gravPoints.length; k++) {
                    var xdist = gravPoints[k][0] - dots[i].xPos;
                    var ydist = gravPoints[k][1] - dots[i].yPos;
                    var dist = Math.sqrt(Math.pow(xdist, 2) + Math.pow(ydist, 2));
                    dist = Math.max(dist, 0.00000001);
                    acc = grav / dist * 1000;
                    xAcc += acc * xdist / dist;
                    yAcc += acc * ydist / dist;
                }
                dots[i].accelerate(xAcc, yAcc, time);
            }
        }
    }
}

function displaceAll(time) {
    for (var i = 0; i < dots.length; i++) {
        if (dots[i].active) {
            dots[i].displace(time);
        }
    }
}

function render() {
    if (updates > 3) {
        frames++;
        clear(canvas);
        drawdots();
        if (firefox) {
            for (var i = 0; i < canvas.height; i++) {
                for (var j = 0; j < canvas.width; j++) {
                    noPixel[i][j] = true;
                }
            }
            //frame.clear();
        } else {
            frame.clear();
        }
        drawStats();
        updates = 0;
    }
}

function drawdots() {
    visible = 0;
    for (var i = 0; i < dots.length; i++) {
        if (dots[i].active) {
            if (dots[i].life) {
                dotColour = speedToColour(dots[i].xVel, dots[i].yVel);
            }
            else {
                dotColour = randomColour(0);//dots[i].colour;
            }
            if (dotMode == 0) {
                drawPixel(dots[i].xPos, dots[i].yPos, dotColour);
            }
            else if (dotMode == 1) {
                drawCircle(dots[i].xPos, dots[i].yPos, dots[i].radius, dotColour);
            }
        }
    }
    if (firefox) {
        //frame.draw(cxt, "2d");
    } else {
        frame.draw(cxt, "2d");
    }
}

function drawStats() {
    if (showStats) {
        drawGrav();
        cxt.font = "10px Verdana";
        cxt.fillStyle = "#fafafa";
        cxt.fillText(fps.toString() + " fps", 0, 10);
        cxt.fillText(amountOfDots.toString() + " particles, " + visible.toString() + " visible", 0, 20);
        cxt.fillText("G: " + grav.toString(), 0, 30);
        cxt.fillText("V: [" + minVel.toString() + "," + maxVel.toString() + "]", 0, 50);
        cxt.fillText("Left click for new pattern", 0, 70);
    }
}

function drawGrav() {
    cxt.fillStyle = "#fafafa";
    for (var k = 0; k < gravPoints.length; k++) {
        cxt.fillRect(gravPoints[k][0] - 1, gravPoints[k][1] - 1, 2, 2);
    }
}

function drawCircle(x, y, r, rgb) {
    if (x + r < 0 || x - r >= canvas.width || y + r < 0 || y - r >= canvas.height) {
    }
    else {
        cxt.beginPath();
        cxt.arc(x, y, r, 0, 6.28318530718, false);
        cxt.fillStyle = "#" + hexColourString(rgb);
        cxt.fill();
        visible++;
    }
}

function drawPixel(x, y, rgb) {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
    }
    else {
        if (firefox) {
            //if (!frame.isSet(x, y)) {
            //   frame.set(x, y, [rgb[0], rgb[1], rgb[2], 255]);
            //   cxt.fillStyle = "#" + hexColourString(rgb);
            //   cxt.fillRect(x, y, 1, 1);
            //}
            if (noPixel[y][x]) {
                cxt.fillStyle = "#" + hexColourString(rgb);
                cxt.fillRect(x, y, 1, 1);
                noPixel[y][x] = false;
            }
        } else {
            if (!frame.isSet(x, y)) {
            }
        }
        visible++;
    }
}

function cleanup() {
    /*for (var i = 0; i < Math.min(cleanIndex, dots.length); i++) {
        if (!dots[i].active) {
            dots.splice(i, 1);
        }
    }
    if (cleanIndex > dots.length) {
        cleanIndex = 0;
    }
    else {
        cleanIndex += 200;
    }*/
    if (!windowChange) {
        windowChange = resize();
    }
    if (windowChange) {
        resize();
        noPixel = [];
        for (var i = 0; i < canvas.height; i++) {
            noPixel[i] = [];
            for (var j = 0; j < canvas.width; j++) {
                noPixel[i][j] = true;
            }
        }
        windowChange = false;
        console.log("window resize")
    }
}

function clear(canvas) {
    // Store the current transformation matrix
    //ctx.save();

    // Use the identity matrix while clearing the canvas
    //ctx.setTransform(1, 0, 0, 1, 0, 0);
    cxt.clearRect(0, 0, canvas.width, canvas.height);

    // Restore the transform
    //ctx.restore();
    cxt.fillStyle = "#000";
    cxt.fillRect(0, 0, canvas.width, canvas.height);
}


/* FRAME BUFFER + PIXEL */

function FrameBuffer(width, height, xOffset, yOffset) {
    this.width = width;
    this.height = height;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.frame = [];
    this.pixelOn = [];
    var that = this;

    this.set = function(x, y, pixel) {
        that.frame[width * y + x] = pixel;
        if (!(that.frame[width * y + x] === undefined)) {
            that.pixelOn.push(width * y + x);
        }
    }

    this.get = function(x, y) {
        return that.frame[width * y + x];
    }

    this.isSet = function(x, y) {
        return that.frame[width * y + x] !== undefined;
    }

    this.draw = function(context, contextType) {
        var count = 0;
        if (firefox) {
            for (var i = 0; i < that.pixelOn.length; i++) {
                context.fillStyle = "#" + hexColourString(that.frame[that.pixelOn[i]]);
                context.fillRect(that.pixelOn[i] % that.width, Math.floor(that.pixelOn[i] / that.width), 1, 1);
            }
        } else {
            var imgData = context.createImageData(width, height);
            var buffer = that.pixelOn.length * 4;
            for (var i = 0; i < imgData.data.length; i += 4) {
                imgData.data[i + 0] = 0;
                imgData.data[i + 1] = 0;
                imgData.data[i + 2] = 0;
                imgData.data[i + 3] = 255;
            }
            for (var i = 0; i < that.pixelOn.length; i++) {
                imgData.data[that.pixelOn[i] * 4] = that.frame[that.pixelOn[i]][0];
                imgData.data[that.pixelOn[i] * 4 + 1] = that.frame[that.pixelOn[i]][1];
                imgData.data[that.pixelOn[i] * 4 + 2] = that.frame[that.pixelOn[i]][2];
                imgData.data[that.pixelOn[i] * 4 + 3] = that.frame[that.pixelOn[i]][3];
            }
            context.putImageData(imgData, xOffset, yOffset);
        }
    }

    this.clear = function() {
        that.frame = [];
        that.pixelOn = [];
    }
}

// Source: http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

// Canvas Size

function getWindowWidth() {
    return window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
}

function getWindowHeight() {
    return (window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight) - 4;
}

function resize() {
    if (canvas.parentNode == document.body) {
        if (canvas.width != window.innerWidth || canvas.height != window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            return true;
        }
    }
    else {
        if (canvas.width != canvas.parentNode.offsetWidth || canvas.height != canvas.parentNode.offsetHeight) {
            canvas.width = canvas.parentNode.offsetWidth;
            canvas.height = canvas.parentNode.offsetHeight;
            return true;
        }
    }
    return false;
}