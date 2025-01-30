/**
 * Created by Bo Yang Tang on 27/08/2014.
 */

function Canvas(canvasID) {
  this.canvas = document.getElementById(canvasID);
  this.cxt = this.canvas.getContext('2d');
  this.layers = [];
  this.resize = false;
  this.canvasRefresh = true;

  this.canvas.style.margin = '0';
  this.canvas.style.padding = '0';
  this.canvas.style.display = 'block';
  this.canvas.style.outline = 'none';
  this.canvas.tabIndex = 1000;
  this.canvas.parentNode.style.padding = '0';
  this.canvas.parentNode.style.backgroundColor = '#000';
  if (this.canvas.parentNode == document.body) {
    this.canvas.parentNode.style.margin = '0';
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  } else {
    this.canvas.width = this.canvas.parentNode.offsetWidth;
    this.canvas.height = this.canvas.parentNode.offsetHeight;
  }

  this.width = this.canvas.width;
  this.height = this.canvas.height;
}

Canvas.prototype.background = function background(cssColour) {
  this.canvas.parentNode.style.backgroundColor = cssColour;
};

Canvas.prototype.newLayer = function newLayer() {
  var layer = new Layer(this);
  layer.bind(this.cxt);
  this.layers.push(layer);
  return layer;
};

Canvas.prototype.draw = function draw() {
  var i = 0;
  if (this.canvasRefresh) {
    this.clear();
    for (; i < this.layers.length; i++) {
      this.layers[i].draw();
    }
    this.canvasRefresh = false;
    //console.log('canvas drawn');
  }
};

Canvas.prototype.fillWindow = function fillWindow() {
  var height = 0,
    width = 0,
    i = 0;
  if (this.canvas.parentNode == document.body) {
    width = window.innerWidth;
    height = window.innerHeight;
  } else {
    width = this.canvas.parentNode.offsetWidth;
    height = this.canvas.parentNode.offsetHeight;
  }
  if (this.width != width || this.height != height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    for (; i < this.layers.length; i++) {
      this.layers[i].resize();
    }
    this.canvasRefresh = true;
    this.resize = true;
    console.log('canvas size ' + width.toString() + ' x ' + height.toString());
  } else {
    this.resize = false;
  }
};

Canvas.prototype.clear = function clear(a, b, c, d) {
  a = (a || 0);
  b = (b || 0);
  c = (c || this.width);
  d = (d || this.height);
  // Store the current transformation matrix
  this.cxt.save();

  // Use the identity matrix while clearing the canvas
  this.cxt.setTransform(1, 0, 0, 1, 0, 0);
  this.cxt.clearRect(a, b, c, d);

  //console.log("canvas cleared");

  // Restore the transform
  this.cxt.restore();
};

Canvas.prototype.notify = function notify() {
  this.canvasRefresh = true;
};

function Layer(canvas) {
  this.parent = canvas;
  this.drawables = [];
  this.width = this.parent.width;
  this.height = this.parent.height;
}

Layer.prototype.bind = function bind(drawer) {
  this.display = drawer;
};

Layer.prototype.add = function add(obj) {
  this.drawables.push(obj);
  obj.parent(this);
  return obj;
};

Layer.prototype.update = function update() {
  var time = this.parent.seconds();
  for (var i = 0; i < this.drawables.length; i++) {
    this.drawables[i].tick(time);
  }
};

Layer.prototype.draw = function draw() {
  for (var i = 0; i < this.drawables.length; i++) {
    this.drawables[i].draw(this.display);
  }
  //console.log('layer drawn');
};

Layer.prototype.resize = function resize() {
  this.width = this.parent.width;
  this.height = this.parent.height;
};

Layer.prototype.notify = function notify() {
  this.parent.notify();
};

function LayerObject() {
  this.properties = {};
}

LayerObject.prototype.notify = function notify() {
  this.properties.parent.notify();
};

LayerObject.prototype.parent = function parent(owner) {
  this.properties.parent = owner;
};

LayerObject.prototype.set = function set(property, value) {
  this.properties[property] = value;
  this.notify();
};

LayerObject.prototype.get = function get(property) {
  return this.properties[property];
};

function Text(text, x, y, size, fontFamily, colour, align, pos) {
  LayerObject.call(this);
  this.properties = {
    stringArray: (parse(text) || []),
    x: (x || 0),
    y: (y || 0),
    fontSize: (size || 12),
    fontFamily: (fontFamily || 'Arial'),
    colour: (colour || '#000000'),
    align: (align || 'left'),
    position: (pos || 'absolute')
  };
  //var animation = {};
}

Text.prototype = Object.create(LayerObject.prototype);
Text.prototype.constructor = Text;

function parse(str) {
  var stringLines = [],
    start = 0,
    i = 0;

  for (; i < str.length; i++) {
    if (str[i] == '\n') {
      stringLines.push(str.substring(start, i));
      start = i + 1;
    }
  }

  stringLines.push(str.substring(start));
  return stringLines;
}

/*Text.prototype.addAnimation = function(property, func, duration) {
  animation[property] = new Animation(func, duration);
};
*/

Text.prototype.set = function set(property, value) {
  if (property == 'string') {
    this.properties.stringArray = parse(value);
  }
  else {
    this.properties[property] = value;
  }
  this.notify();
};

/*Text.prototype.tick = function(t) {

};*/

Text.prototype.draw = function draw(cxt) {
  var i = 0;
  cxt.font = Math.round(this.properties.fontSize).toString() + 'px ' + this.properties.fontFamily;
  cxt.fillStyle = this.properties.colour;
  cxt.textAlign = this.properties.align;
  for (; i < this.properties.stringArray.length; i++) {
    if (this.properties.position == 'absolute') {
      cxt.fillText(this.properties.stringArray[i], this.properties.x, this.properties.y + this.properties.fontSize * i);
    }
    else if (this.properties.position == 'relative') {
      cxt.fillText(this.properties.stringArray[i], this.properties.x + this.properties.parent.width / 2, this.properties.y + this.properties.parent.height / 2 + this.properties.fontSize * i - (this.properties.stringArray.length - 1.5) * this.properties.fontSize / 2);
    }
  }
  //console.log('text drawn');
};

/*function Line(o, d, scale) {
  var properties = {
    origin: o,
    point: d,
    direction: d,
    magnitude: scale,
    colour: "#000"
  };

  this.set = function(property, value) {
    if (value) {
      properties[property] = value;
    }
  };

  this.tick = function(t) {

  };

  this.draw = function(cxt) {
    if (properties.magnitude) {
      properties.point = [properties.origin[0] + properties.direction[0] * properties.magnitude, properties.origin[1] + properties.direction[1] * properties.magnitude];
    }
    cxt.strokeStyle = properties.colour;
    cxt.beginPath();
    cxt.moveTo(properties.origin[0], properties.origin[1]);
    cxt.lineTo(properties.point[0], properties.point[1]);
    cxt.stroke();
  }
}*/

/*function animation(func, duration) {
  var begin = nan;
  var action = func;
  var pre = 0;
  var lifetime = (duration || infinity);
  var dead = false;

  this.tick = function(t) {
    if (dead) {
      return nan;
    }
    if (!begin) {
      begin = t;
    }
    var life = t - begin;
    if (lifetime <= life) {
      dead = true;
      life = lifetime;
    }
    var cur = action(life) - pre;
    pre += cur;
    return cur;
  };
}*/



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