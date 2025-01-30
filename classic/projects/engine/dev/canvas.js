/**
 * Bo Yang Tang
 * boyangtang.ca
 */
var boFloor = boFloor || {};

(function (namespace) {
  namespace.random = namespace.random || {};

  // getRandom(a, b) produces a real number in the set [a, b)
  namespace.random.floatNum = function floatNum(min, max) {
    if (min == max) {
      return min;
    }
    return Math.random() * (max - min) + min;
  };

  // getRandomInt(a, b) produces an integer in the set [a, b]
  namespace.random.intNum = function intNum(min, max) {
    if (min == max) {
      return min;
    }
    return Math.floor(namespace.random.floatNum(min, max + 1));
  };

  // getRandomChoice(list-of-choices) produces an element from list-of-choices
  namespace.random.element = function element(array) {
    return array[namespace.random.intNum(0, array.length - 1)];
  };

  namespace.random.hexColour = function hexColour(min) {
    var rgb = namespace.random.colour(min);
    return [rgb[0].toString(16), rgb[1].toString(16), rgb[2].toString(16)];
  };

  namespace.random.colour = function colour(min) {
    var red = namespace.random.intNum(0, 255),
      green = namespace.random.intNum(0, 255),
      blue = namespace.random.intNum(0, 255);
    min = (min === 'undefined') ? 0 : min;
    while (red + blue + green < min) {
      red = namespace.random.intNum(0, 255);
      green = namespace.random.intNum(0, 255);
      blue = namespace.random.intNum(0, 255);
    }
    return [red, green, blue];
  };

  namespace.random.hexColourString = function hexColourString(min) {
    var hex = namespace.random.hexColour(min);

    function help(string) {
      if (string.length == 1) {
        return "0" + string;
      }
      return string;
    }

    return help(hex[0]) + help(hex[1]) + help(hex[2]);
  };

  namespace.Canvas = function Canvas(canvasID) {
    var cxt;
    this.canvasElement = document.getElementById(canvasID);
    cxt = this.canvasElement.getContext('2d');
    this.container = this.canvasElement.parentNode;
    this.layers = [];
    this.resize = false;
    this.refresh = true;
    this.renderProcess = null;
    this.statsProcess = null;
    this.stats = {
      visible: false,
      targetFPS: 1000/60,
      fps: 0,
      frames: 0,
      updateTime: 0,
      lastUpdate: 0,
      currentUpdate: 0,
      updateDelay: 0,
      layer: undefined,
      text: undefined,
      objects: {
        total: 0,
        visible: 0
      }
    };
    this.render = {
      cxt: cxt,
      offset: [0, 0],
      position: [0, 0],
      width: 0,
      height: 0,
      scale: 1,
      defaultRender: {
        cxt: cxt,
        offset: [0, 0],
        position: [0, 0],
        width: 0,
        height: 0,
        scale: 1
      }
    };

    this.canvasElement.style.margin = '0';
    this.canvasElement.style.padding = '0';
    this.canvasElement.style.display = 'block';
    this.canvasElement.style.outline = 'none';
    this.canvasElement.tabIndex = 1000;
    this.container.style.padding = '0';
    this.container.style.backgroundColor = '#000';
    if (this.container == document.body) {
      this.container.style.margin = '0';
      this.canvasElement.width = window.innerWidth;
      this.canvasElement.height = window.innerHeight;
    } else {
      this.canvasElement.width = this.container.offsetWidth;
      this.canvasElement.height = this.container.offsetHeight;
    }

    this.width = this.canvasElement.width;
    this.height = this.canvasElement.height;
    this.render.defaultRender.width = this.width;
    this.render.defaultRender.height = this.height;

    this.stats.layer = new namespace.Layer(this);
    this.stats.layer.bind(this.render);
    this.stats.layer.id = 'Canvas Performance Statistics';
    this.stats.layer.visible = false;
    this.stats.layer.overlay = true;
    this.stats.text = this.stats.layer.add(new namespace.Text(0, 12));
    this.stats.text.colour = 'white';
  };

  namespace.Canvas.prototype.handleEvent = function(event) {
    console.log(event.type + ' event');
    switch (event.type) {
      case 'resize':
        this.resize = true;
        break;
    }
  };

  namespace.Canvas.prototype.startRender = function startRender(foo) {
    var canvas = this;

    this.renderProcess = setInterval(function(){
      canvas.stats.objects.visible = 0;
      canvas.stats.currentUpdate = (new Date()).getTime();
      canvas.stats.updateDelay = canvas.stats.currentUpdate - canvas.stats.lastUpdate;
      canvas.stats.lastUpdate = canvas.stats.currentUpdate;
      if (foo) foo();
      if (canvas.resize) canvas.fillWindow();
      canvas.draw();
      canvas.stats.updateTime = (new Date()).getTime() - canvas.stats.currentUpdate;
      canvas.stats.frames ++;
      if (canvas.stats.visible) {
        canvas.stats.text.string = 'objects: ' + canvas.stats.objects.total.toString() +
                                 '\ndrawn: ' + canvas.stats.objects.visible.toString() +
                                 '\ndraw time: ' + canvas.stats.updateTime.toString() +
                                 '\nframe time: ' + canvas.stats.updateDelay.toString() +
                                 '\nfps: ' + canvas.stats.fps.toString() +
                               '\n\nzoom: ' + canvas.render.scale.toString() +
                                 '\ncenter: ' + canvas.render.position.toString() +
                                 '\noffset: ' + canvas.render.offset.toString();
        //console.log(canvas.stats.text);
        canvas.stats.layer.draw();
      }
    }, canvas.stats.targetFPS);

    this.statsProcess = setInterval(function(){
      canvas.stats.fps = canvas.stats.frames;
      canvas.stats.frames = 0;
    }, 1000);
  };

  namespace.Canvas.prototype.stopRender = function stopRender() {
    clearInterval(this.renderProcess);
    clearInterval(this.statsProcess);
    this.renderProcess = null;
    this.statsProcess = null;
  };

  namespace.Canvas.prototype.showStats = function showStats() {
    this.stats.visible = true;
    this.stats.layer.visible = true;
  };

  namespace.Canvas.prototype.background = function background(cssColour) {
    this.container.style.backgroundColor = cssColour;
  };

  namespace.Canvas.prototype.newLayer = function newLayer() {
    var layer = new namespace.Layer(this);
    layer.bind(this.render);
    this.layers.push(layer);
    layer.id = 'Layer ' + this.layers.length.toString();
    return layer;
  };

  namespace.Canvas.prototype.draw = function draw() {
    var i = 0;
    if (this.refresh) {
      this.clear();
      for (; i < this.layers.length; i++) {
        this.layers[i].draw();
      }
      this.refresh = false;
      //console.log('canvas drawn');
    }
  };

  namespace.Canvas.prototype.fillWindow = function fillWindow() {
    var height = 0,
      width = 0,
      i = 0;

    if (this.container == document.body) {
      width = window.innerWidth;
      height = window.innerHeight;
    } else {
      width = this.container.offsetWidth;
      height = this.container.offsetHeight;
    }
    if (this.width != width || this.height != height) {
      this.width = this.render.defaultRender.width = this.canvasElement.width = width;
      this.height = this.render.defaultRender.height = this.canvasElement.height = height;
      for (; i < this.layers.length; i++) {
        this.layers[i].resize();
      }
      this.refresh = true;
      console.log('canvas size ' + width.toString() + ' x ' + height.toString());
    }
    this.resize = false;
  };

  // autofill
  // true: Canvas will resize to fit its parent element after window resize event
  // false: Canvas will stay at its original size
  Object.defineProperty(namespace.Canvas.prototype, 'autofill', {
    set: function(x) {
      if (x == true) {
        window.addEventListener('resize', this, false);
        console.log('canvas will fill ' + this.container.tagName);
      } else {
        window.removeEventListener('resize', this, false);
        console.log('canvas will stay fixed size');
      }
    }
  });

  Object.defineProperty(namespace.Canvas.prototype, 'fps', {
    set: function(x) {
      this.stats.targetFPS = 1000/x;
    }
  });

  Object.defineProperty(namespace.Canvas.prototype, 'showStats', {
    set: function(x) {
      if (x) {
        this.stats.visible = true;
        this.stats.layer.visible = true;
      }
    }
  });

  Object.defineProperty(namespace.Canvas.prototype, 'width', {
    set: function(n) {
      this.render.offset[0] = Math.floor(n * 5) / 10;
      this.render.width = n;
      this.calibrate();
    },
    get: function() {
      return this.render.width;
    }
  });

  Object.defineProperty(namespace.Canvas.prototype, 'height', {
    set: function(n) {
      this.render.offset[1] = Math.floor(n * 5) / 10;
      this.render.height = n;
      this.calibrate();
    },
    get: function() {
      return this.render.height;
    }
  });

  namespace.Canvas.prototype.zoom = function zoom(n) {
    this.render.scale *= n;
    this.render.cxt.scale(n, n);
  };

  Object.defineProperty(namespace.Canvas.prototype, 'scale', {
    set: function(n) {
      this.render.scale = n;
      this.calibrate();
    },
    get: function() {
      return this.render.scale;
    }
  });

  namespace.Canvas.prototype.pan = function pan(x, y) {
    this.render.position[0] += x;
    this.render.position[1] += y;
    this.render.cxt.translate(x,y);
  };

  Object.defineProperty(namespace.Canvas.prototype, 'center', {
    set: function(x, y) {
      this.render.position[0] = x;
      this.render.position[1] = y;
      this.calibrate();
    },
    get: function() {
      return this.render.position;
    }
  });

    namespace.Canvas.prototype.getElementById = function getElementById(idString) {
    var i = 0,
      end = this.layers.length,
      result;

    for (; i < end; i++) {
      if (this.layers[i].id == idString) return this.layers[i];
      result = this.layers[i].getElementById(idString);
      if (result) return result;
    }

    return null;
  };

  namespace.Canvas.prototype.calibrate = function calibrate() {
    this.render.cxt.setTransform(this.render.scale, 0, 0, this.render.scale, this.render.offset[0] + this.render.position[0], this.render.offset[1] + this.render.position[1]);
  };

  namespace.Canvas.prototype.clear = function clear(a, b, c, d) {
    a = (a || 0);
    b = (b || 0);
    c = (c || this.width);
    d = (d || this.height);
    // Store the current transformation matrix
    this.render.cxt.save();

    // Use the identity matrix while clearing the canvas
    this.render.cxt.setTransform(1, 0, 0, 1, 0, 0);
    this.render.cxt.clearRect(a, b, c, d);

    //console.log("canvas cleared");

    // Restore the transform
    this.render.cxt.restore();
  };

  namespace.Canvas.prototype.notify = function notify(msg) {
    switch (msg) {
      case 'add':
        this.stats.objects.total ++;
        break;
      case 'draw':
        this.stats.objects.visible ++;
        break;
      case 'update':
        this.refresh = true;
        break;
      default:
        break;
    }
  };

  // Layer

  namespace.Layer = function Layer(canvas) {
    this.parent = canvas;
    this.drawables = [];
    this.width = this.parent.width;
    this.height = this.parent.height;
    this.id = '';
    this.visible = true;
    this.overlay = false;
    this.stats = {
      'objects': 0
    };
  };

  namespace.Layer.prototype.bind = function bind(drawer) {
    this.render = drawer;
  };

  namespace.Layer.prototype.add = function add(layerObject) {
    layerObject.parent = this;
    this.drawables.push(layerObject);
    this.stats.objects ++;
    this.parent.notify('add');
    return layerObject;
  };

  namespace.Layer.prototype.getElementById = function getElementById(idString) {
    var i = 0,
      end = this.drawables.length;

    for (; i < end; i++) {
      if (this.drawables[i].id == idString) return this.drawables[i];
    }

    return null;
  };

  /*Layer.prototype.update = function update() {
    var time = this.parent.seconds();
    for (var i = 0; i < this.drawables.length; i++) {
      this.drawables[i].tick(time);
    }
  };*/

  namespace.Layer.prototype.draw = function draw() {
    var render = this.overlay ? this.render.defaultRender : this.render,
      bounds = [[render.position[0] - render.width / render.scale, render.position[1] - render.height / render.scale],
                [render.position[0] + render.width / render.scale, render.position[1] + render.height / render.scale]];
    if (this.overlay) {
      render.cxt.save();
      render.cxt.setTransform(1, 0, 0, 1, 0, 0);
    }
    if (this.visible) {
      for (var i = 0; i < this.drawables.length; i++) {
        if (namespace.rectIntersect(bounds,this.drawables[i].bounds)) this.drawables[i].draw(render);
      }
      //console.log(this.id + ' drawn');
    }
    if (this.overlay) {
      render.cxt.restore();
    }
  };

  namespace.Layer.prototype.resize = function resize() {
    this.width = this.parent.width;
    this.height = this.parent.height;
  };

  namespace.Layer.prototype.notify = function notify(msg) {
    this.parent.notify(msg);
  };

  // LayerObject abstract

  namespace.LayerObject = function LayerObject() {
    this.properties = {};
  };

  namespace.LayerObject.prototype.init = function init(args, vars, defaults) {
    var i = 0,
      argsLength = args.length,
      varsLength = vars.length;

    for ( ; i < argsLength; i++) {
      this[vars[i]] = args[i];
    }

    for ( ; i < varsLength; i++) {
      this[vars[i]] = defaults[i];
    }
  };

  Object.defineProperty(namespace.LayerObject.prototype, 'parent', {
    set: function(x) { this.properties.parent = x },
    get: function() { return this.properties.parent }
  });

  namespace.LayerObject.prototype.notify = function notify(msg) {
    if (this.properties.parent) {
      this.properties.parent.notify(msg);
    }
  };

  Object.defineProperty(namespace.LayerObject.prototype, 'id', {
    set: function(x) { this.properties.id = x },
    get: function() { return this.properties.id }
  });

  namespace.Text = function Text(x,y,string,size,font,colour,align,position) {
    var names = ['x','y','string','size','font','colour','align','position'],
      defaults = [0,0,'',12,'Arial','#000','left','absolute'];
    namespace.LayerObject.call(this);
    this.init(arguments,names,defaults);
    //var animation = {};
  };

  namespace.Text.prototype = Object.create(namespace.LayerObject.prototype);
  namespace.Text.prototype.constructor = namespace.Text;
  namespace.protoInit(namespace.Text.prototype,['x','y','string','size','font','colour','align','position']);

  /*Text.prototype.addAnimation = function(property, func, duration) {
    animation[property] = new Animation(func, duration);
  };
  */


  /*Text.prototype.tick = function(t) {

  };*/

  namespace.Text.prototype.draw = function draw(render) {
    var i = 0,
      stringArray = this.string.split('\n'),
      stringArrayLength = stringArray.length,
      size = this.size * render.scale,
      x = this.x * render.scale + render.offset[0] + render.position[0],
      y = this.y * render.scale + render.offset[1] + render.position[1],
      cxt = render.cxt,
      bounds,
      width,
      visible;

    cxt.font = Math.round(this.size).toString() + 'px ' + this.font;
    cxt.fillStyle = this.colour;
    cxt.textAlign = this.align;

    if (this.position == 'absolute') {
      for ( ; i < stringArrayLength; i++) {
        width = cxt.measureText(stringArray[i]).width;
        bounds = [[x - width * (this.align == 'left' ? 0 : 1) / (this.align == 'center' ? 2 : 1), y + size * (i - 1)],
                  [x + width * (this.align == 'right' ? 0 : 1) / (this.align == 'center' ? 2 : 1), y + size * i]];
        if (this.parent.isVisible(bounds)) {
          cxt.fillText(stringArray[i], this.x, this.y + this.size * i);
          visible = true;
        }
        //console.log(stringArray[i] + '  ' + bounds.toString() + '  ' + this.parent.isVisible(bounds));
      }
    }
    else if (this.position == 'relative') {
     for ( ; i < stringArrayLength; i++) {
       cxt.fillText(stringArray[i],
         x + this.parent.width / 2,
         y + this.parent.height / 2 + size * i - (stringArray.length - 1.5) * size / 2);
       visible = true;
     }
    }
    if (visible) this.notify('draw');
  };

  namespace.Line = function Line(o, d, scale) {
    var names = ['origin','direction','magnitude','colour','width'],
      defaults = [[0,0],[0,0],0,'#000',1];
    namespace.LayerObject.call(this);
    this.init(arguments,names,defaults);
  };

  namespace.Line.prototype = Object.create(namespace.LayerObject.prototype);
  namespace.Line.prototype.constructor = namespace.Line;
  namespace.protoInit(namespace.Line.prototype,['origin','direction','magnitude','colour','width'],[],[0,this.trace,this.trace,0,0]);

  namespace.Line.prototype.trace = function trace() {
    this.point = [this.origin[0] + this.direction[0] * this.magnitude,
                  this.origin[1] + this.direction[1] * this.magnitude];
  };

  namespace.Line.prototype.draw = function draw(render) {
    var cxt = render.cxt;
    cxt.strokeStyle = this.colour;
    cxt.beginPath();
    cxt.moveTo(this.origin[0], this.origin[1]);
    cxt.lineTo(this.point[0], this.point[1]);
    cxt.lineWidth = this.width;
    cxt.stroke();
    cxt.lineWidth = 1;
    this.notify('draw');
  };

  Object.defineProperty(namespace.Line.prototype, 'bounds', {
    get: function() {
      var x1, y1, x2, y2;
      this.point = [this.origin[0] + this.direction[0] * this.magnitude,
        this.origin[1] + this.direction[1] * this.magnitude];
      x1 = (this.origin[0] + render.position[0]) * render.scale + render.offset[0];
      y1 = (this.origin[1] + render.position[1]) * render.scale + render.offset[1];
      x2 = (this.point[0] + render.position[0]) * render.scale + render.offset[0];
      y2 = (this.point[1] + render.position[1]) * render.scale + render.offset[1];
      return [[x1, y1],[x2, y2]];
    }
  });

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

  namespace.Arc = function Arc(x, y, r, a, b, cc, colour, fill) {
    var names =  ['x','y','r','a','b','clockwise','colour','fill'],
      defaults = [0,0,1,0,Math.PI,true,'#000',false];
    namespace.LayerObject.call(this);
    this.init(arguments, names, defaults);
  };

  namespace.Arc.prototype = Object.create(namespace.LayerObject.prototype);
  namespace.Arc.prototype.constructor = namespace.Arc;

  Object.defineProperty(namespace.Arc.prototype, 'x', {
    get: function() {
      return this.properties.x;
    },
    set: function(n) {
      this.properties.x = n;
    }
  });

  Object.defineProperty(namespace.Arc.prototype, 'y', {
    get: function() {
      return this.properties.y;
    },
    set: function(n) {
      this.properties.y = n;
    }
  });

  Object.defineProperty(namespace.Arc.prototype, 'position', {
    get: function() {
      return [this.x, this.y];
    },
    set: function(position) {
      this.x = position[0];
      this.y = position[1];
    }
  });

  Object.defineProperty(namespace.Arc.prototype, 'r', {
    get: function() {
      return this.properties.r;
    },
    set: function(n) {
      this.properties.r = n;
    }
  });

  Object.defineProperty(namespace.Arc.prototype, 'd', {
    get: function() {
      return this.properties.r * 2;
    },
    set: function(n) {
      this.properties.r = n / 2;
    }
  });

  Object.defineProperty(namespace.Arc.prototype, 'a', {
    get: function() {
      
    },
    set: function() {

    }
  });

  Object.defineProperty(namespace.Arc.prototype, 'b', {
    get: function() {

    },
    set: function() {

    }
  });

  Object.defineProperty(namespace.Arc.prototype, 'clockwise', {
    get: function() {

    },
    set: function() {

    }
  });

  Object.defineProperty(namespace.Arc.prototype, 'colour', {
    get: function() {

    },
    set: function() {

    }
  });

  Object.defineProperty(namespace.Arc.prototype, 'fill', {
    get: function() {

    },
    set: function() {

    }
  });

  namespace.Arc.prototype.draw = function draw(render) {
    var cxt = render.cxt;
    cxt.beginPath();
    cxt.arc(this.x, this.y, this.r, this.a, this.b, this.cc);
    if (this.fill) {
      cxt.fillStyle = this.colour;
      cxt.fill();
    } else {
      cxt.strokeStyle = this.colour;
      cxt.stroke();
    }
    this.notify('draw');
  };

  Object.defineProperty(namespace.Arc.prototype, 'bounds', {
    get: function() {
      return [[this.x - this.r, this.y - this.r],[this.x + this.r, this.y + this.r]];
    }
  });

  namespace.Circle = function Circle(x, y, r, colour, fill) {
    var names = ['x','y','r','colour', 'fill'],
      defaults = [0,0,1,'#000',true];
    namespace.Arc.call(this);
    this.init(arguments,names,defaults);
    this.properties.a = 0;
    this.properties.b = 6.28318530718;
  };

  namespace.Circle.prototype = Object.create(namespace.Arc.prototype);
  namespace.Circle.prototype.constructor = namespace.Circle;

})(boFloor);