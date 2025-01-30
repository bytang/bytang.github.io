var firefox = !0, box, pen, mouseX = 400, mouseY = 300, dots = [], timeScale = 2, timeBetweenFrames = 0, cleanIndex = 0, updates = 0, frames = 0, fps = 0, showStats = !1, grav = 3, hueOffset = 0, maxDots = 5E3, amountOfDots, maxVel = -1, minVel = -1, frame, noPixel;
function randomInt(a, b) {
    return Math.floor(random(a, b))
}
function random(a, b) {
    if (a > b) {
        var c = a;
        a = b;
        b = c
    }
    return Math.random() * (b - a + 1) + a
}
function randomChoice(a) {
    return a[randomInt(0, a.length - 1)]
}
function getMousePos(a) {
    var b = box.getBoundingClientRect();
    mouseX = a.clientX - b.left;
    mouseY = a.clientY - b.top
}
function randomHexColour(a) {
    return hexColourString(randomColour(a))
}
function randomColour(a) {
    for (var b = randomInt(0, 255), c = randomInt(0, 255), e = randomInt(0, 255); b + e + c < a;)b = randomInt(0, 255), c = randomInt(0, 255), e = randomInt(0, 255);
    return [b, c, e]
}
function hexColourString(a) {
    function b(a) {
        return 1 == a.length ? "0" + a : a
    }

    return b(a[0].toString(16)) + b(a[1].toString(16)) + b(a[2].toString(16))
}
function speedToColour(a, b) {
    a = abs(a);
    b = abs(b);
    return hslToRgb(((abs(a) + abs(b) - minVel) / maxVel * 360 + hueOffset) % 360 / 360, 1, .5)
}
function abs(a) {
    0 > a && (a = -a);
    return a
}
function particle(a, b, c, e) {
    this.xPos = a;
    this.yPos = b;
    this.xVel = c;
    this.yVel = e;
    this.mass = 1;
    this.colour = randomColour(0);
    this.life = this.active = !0;
    var d = this;
    this.accelerate = function(a, b, c) {
        d.xVel += a * c;
        d.yVel += b * c;
        4E3 < abs(a) + abs(b) && (d.life = !1)
    };
    this.displace = function(a) {
        d.xPos += d.xVel * a;
        d.yPos += d.yVel * a;
        5 > abs(d.xVel) + abs(d.yVel) && !1 == d.life && (d.active = !1, amountOfDots--);
        d.life && (0 > maxVel ? (maxVel = abs(d.xVel) + abs(d.yVel), minVel = abs(d.xVel) + abs(d.yVel)) : (maxVel = Math.max(abs(d.xVel) + abs(d.yVel), maxVel), minVel =
            Math.min(abs(d.xVel) + abs(d.yVel), minVel)))
    }
}
function magnitudeBound(a, b, c) {
    return Math.max(Math.min(a, c), b)
}
function startBox() {
    box = document.getElementById("box");
    pen = box.getContext("2d");
    box.width = 800;
    box.height = 600;
    if (firefox) {
        noPixel = [];
        for (var a = 0; 600 > a; a++) {
            noPixel[a] = [];
            for (var b = 0; 800 > b; b++)noPixel[a][b] = !0
        }
    } else frame = new frameBuffer(box.width, box.height, 0, 0);
    clear(box);
    newBox();
    sprinkledots();
    timeBetweenFrames = timeScale / 200;
    box.addEventListener("mouseover", function() {
        showStats = !0
    });
    box.addEventListener("mouseout", function() {
        showStats = !1
    });
    box.addEventListener("mouseup", function() {
        newBox();
        sprinkledots()
    });
    setInterval(function() {
        update()
    }, timeScale);
    setInterval(function() {
        render()
    }, 16.6667);
    setInterval(function() {
        cleanup()
    }, 1E3);
    setInterval(function() {
        fps = frames;
        frames = 0
    }, 1E3)
}
function newBox() {
    dots = [];
    grav = random(2, 9)
}
function sprinkledots() {
    var a = random(10, 100), b = randomInt(0, 4), c = random(0, 800);
    amountOfDots = maxDots;
    hueOffset = randomInt(0, 360);
    if (0 == b)for (b = 0; b < amountOfDots; b++)dots.push(new particle(c, randomInt(298, 302), random(-a, a), random(-a, a))); else if (1 == b)for (b = 0; b < amountOfDots; b++)dots.push(new particle(c, randomInt(298, 302), 0, random(-a, a))); else if (2 == b)for (b = 0; b < amountOfDots; b++) {
        var e = random(-a, a), d = randomChoice([-1, 1]);
        dots.push(new particle(c, randomInt(298, 302), e, d * e))
    } else if (3 == b)for (b = 0; b < amountOfDots; b++)e =
        random(-a, a), dots.push(new particle(c, randomInt(298, 302), e, e)); else if (4 == b)for (a = randomInt(0, 50), d = randomChoice([-1, 1]), b = 0; b < amountOfDots; b++)dots.push(new particle(randomInt(400, 400 + 400 * -d), randomChoice([290 - a, 310 + a]), random(20, 80) * d, 0))
}
function spawnDot(a, b, c, e) {
    dots.push(new particle(a, b, c, e))
}
function update() {
    updates++;
    gravitate(timeBetweenFrames);
    displaceAll(timeBetweenFrames)
}
function gravitate(a) {
    if (-1 < mouseX)for (var b = 0; b < dots.length; b++)if (dots[b].active) {
        var c = 400 - dots[b].xPos, e = 300 - dots[b].yPos, d = Math.sqrt(Math.pow(c, 2) + Math.pow(e, 2)), d = Math.max(d, 1E-8), h = grav / d * 1E3;
        dots[b].accelerate(h * c / d, h * e / d, a)
    }
}
function displaceAll(a) {
    for (var b = 0; b < dots.length; b++)dots[b].active && dots[b].displace(a)
}
function render() {
    if (3 < updates) {
        frames++;
        clear(box);
        drawdots();
        if (firefox)for (var a = 0; 600 > a; a++)for (var b = 0; 800 > b; b++)noPixel[a][b] = !0; else frame.clear();
        drawStats();
        updates = 0
    }
}
function drawdots() {
    for (var a = 0; a < dots.length; a++)dots[a].active && (dots[a].life ? drawPixel(dots[a].xPos, dots[a].yPos, speedToColour(dots[a].xVel, dots[a].yVel)) : drawPixel(dots[a].xPos, dots[a].yPos, dots[a].colour));
    firefox || frame.draw(pen, "2d")
}
function drawStats() {
    showStats && (drawCursor(), pen.font = "10px Verdana", pen.fillStyle = "#fafafa", pen.fillText(amountOfDots.toString() + " particles " + fps.toString() + " fps", 0, 10), pen.fillText("G: " + grav.toString(), 0, 20), pen.fillText("Left click for new pattern", 0, 40))
}
function drawCursor() {
    -1 < mouseX && (pen.fillStyle = "#fafafa", pen.fillRect(mouseX - 1, mouseY - 1, 2, 2))
}
function drawPixel(a, b, c) {
    0 > a || a >= box.width || 0 > b || b >= box.height || (a = Math.floor(a), b = Math.floor(b), firefox ? noPixel[b][a] && (pen.fillStyle = "#" + hexColourString(c), pen.fillRect(a, b, 1, 1), noPixel[b][a] = !1) : frame.isSet(a, b) || frame.set(a, b, [c[0], c[1], c[2], 255]))
}
function cleanup() {
    for (var a = 0; a < Math.min(cleanIndex, dots.length); a++)dots[a].active || dots.splice(a, 1);
    cleanIndex = cleanIndex > dots.length ? 0 : cleanIndex + 200
}
function clear(a) {
    pen.clearRect(0, 0, a.width, a.height);
    pen.fillStyle = "#000";
    pen.fillRect(0, 0, a.width, a.height)
}
function frameBuffer(a, b, c, e) {
    this.width = a;
    this.height = b;
    this.xOffset = c;
    this.yOffset = e;
    this.frame = [];
    var d = this;
    this.set = function(b, c, e) {
        d.frame[a * c + b] = e
    };
    this.get = function(b, c) {
        return d.frame[a * c + b]
    };
    this.isSet = function(b, c) {
        return void 0 === d.frame[a * c + b] ? !1 : !0
    };
    this.draw = function(h, k) {
        for (var g = h.createImageData(a, b), f = 0; f < g.data.length; f += 4)void 0 !== d.frame[Math.floor(f / 4)] ? (g.data[f + 0] = d.frame[Math.floor(f / 4)][0], g.data[f + 1] = d.frame[Math.floor(f / 4)][1], g.data[f + 2] = d.frame[Math.floor(f / 4)][2],
            g.data[f + 3] = d.frame[Math.floor(f / 4)][3]) : (g.data[f + 0] = 0, g.data[f + 1] = 0, g.data[f + 2] = 0, g.data[f + 3] = 255);
        h.putImageData(g, c, e)
    };
    this.clear = function() {
        d.frame = []
    }
}
function hslToRgb(a, b, c) {
    if (0 == b)c = b = a = c; else {
        var e = .5 > c ? c * (1 + b) : c + b - c * b, d = 2 * c - e;
        c = hue2rgb(d, e, a + 1 / 3);
        b = hue2rgb(d, e, a);
        a = hue2rgb(d, e, a - 1 / 3)
    }
    return [Math.round(255 * c), Math.round(255 * b), Math.round(255 * a)]
}
function hue2rgb(a, b, c) {
    0 > c && (c += 1);
    1 < c && (c -= 1);
    return c < 1 / 6 ? a + 6 * (b - a) * c : .5 > c ? b : c < 2 / 3 ? a + (b - a) * (2 / 3 - c) * 6 : a
};