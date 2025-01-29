var box;
var pen;

var mouseX = -1;
var mouseY = -1;
var mouseMove = false;

var lines;

function random(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

function randomChoose(choicesArray) {
    return choicesArray[random(0, choicesArray.length - 1)];
}

function getWindowWidth() {
    var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    return width;
}

function getWindowHeight() {
    var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    return height - 4;
}

function startBox() {
    box = document.getElementById("box");
    pen = box.getContext("2d");

    box.width = 790;
    box.height = 590;

    makeLines();
    drawLines(lines);

    box.addEventListener('mouseover', getMousePos);
    box.addEventListener('mousemove', getMousePos);
    box.addEventListener('mouseup', makeLines);
    box.addEventListener('mouseout', function() {
        mouseX = -1;
    });
    setInterval(function() {
        update();
    }, 5);
}

function makeLines() {
    lines = new Array();
    for (var i = 0; i < 100; i++) {
        var line = [0, 0, 0, 0];
        var choice = random(0, 3);
        if (choice == 0) { // top
            line[0] = random(0, box.width);
            line[1] = 0;
            line[2] = random(0, box.width);
            line[3] = random(0, box.height * 0.2);
        }
        else if (choice == 1) { // left
            line[0] = 0;
            line[1] = random(0, box.height);
            line[2] = random(0, box.width * 0.2);
            line[3] = random(0, box.height);
        }
        else if (choice == 2) { // right
            line[0] = box.width;
            line[1] = random(0, box.height);
            line[2] = random(box.width * 0.8, box.width);
            line[3] = random(0, box.height);
        }
        else if (choice == 3) { // bottom
            line[0] = random(0, box.width);
            line[1] = box.height;
            line[2] = random(0, box.width);
            line[3] = random(box.height * 0.8, box.height);
        }
        lines.push(line);
    }
}

function update() {
    //box.width = getWindowWidth();
    //box.height = getWindowHeight();
    pen.save();

    // Use the identity matrix while clearing the canvas
    pen.setTransform(1, 0, 0, 1, 0, 0);
    pen.clearRect(0, 0, box.width, box.height);

    // Restore the transform
    pen.restore();
    pen.beginPath();
    drawLines(lines);
}

function drawLines(lines) {
    for (var i = 0; i < lines.length; i++) {
        drawLine(lines[i]);
    }
}

function getMousePos(evt) {
    var rect = box.getBoundingClientRect();
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
}

function drawLine(linePos) {
    var x1 = Math.min(linePos[0], box.width);
    var y1 = Math.min(linePos[1], box.height);
    var x2 = Math.min(linePos[2], box.width);
    var y2 = Math.min(linePos[3], box.height);
    pen.moveTo(x1, y1);
    if (mouseX > -1) {
        var scale = dotProduct([linePos[2], linePos[3]], [mouseX, mouseY]) / dotProduct([mouseX, mouseY], [mouseX, mouseY]);
        pen.lineTo(scale * mouseX, scale * mouseY);
    }
    else {
        pen.lineTo(x2, y2);
    }
    pen.stroke();
}

function dotProduct(a, b) {
    return a[0] * b[0] + a[1] * b[1];
}