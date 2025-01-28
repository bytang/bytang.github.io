/**
 * Bo Yang Tang
 * boyangtang.ca
 */
(function(ns){

  var mouse = new ns.Mouse("canvas"),
    graphics = new ns.Canvas("canvas"),
    backgroundLayer = graphics.newLayer(),
    textLayer = graphics.newLayer(),
    statsLayer = graphics.newLayer(),
    text,
    ms,
    string,
    clock = new ns.Clock(),
    time = statsLayer.add(new ns.Text(200, 12)),
    spawnChoice = 'circle',
    spawns = 0,
    width = graphics.width / 4,
    height = graphics.height / 4,
    dir = [ns.random.floatNum(-1,1),ns.random.floatNum(-1,1)],
    speed = 0.5;

  textLayer.add(new ns.Text()).id = 'text';
  text = graphics.getElementById('text');
  text.string = 'HELLO WORLD\nxD\nayy lmao';
  text.size = '2';
  text.colour = 'yellow';
  text.align = 'center';
  text.position = 'absolute';
  text.font = 'Comic Sans MS';
  time.colour = 'red';
  statsLayer.overlay = true;

  function update() {
    ms = Math.floor(clock.milliseconds/100);
    string = (ms/10).toString() + (ms % 10 ? '' : '.0');
    time.string = string;
    text.string = 'x: ' + mouse.properties.x.toString() + ' y: ' + mouse.properties.y.toString();
    while (graphics.center[0] + speed * dir[0] < -30 || graphics.center[0] + speed * dir[0] > 30 || graphics.center[1] + speed * dir[1] < -30 || graphics.center[1] + speed * dir[1] > 30) {
      dir = [ns.random.floatNum(-1,1),ns.random.floatNum(-1,1)];
    }
    graphics.pan(speed * dir[0],speed * dir[1]);
  }

  graphics.autofill = true;
  graphics.startRender(update);
  graphics.showStats = true;

  mouse.mouseDownAction(function() {
    graphics.zoom(1.05);
  });

  clock.start();

  function spawnObject() {
    var r = ns.random.intNum(1,30),
      a,
      b,
      shape;
    setTimeout(function(){
      if (spawnChoice == 'circle') {
        shape = new ns.Circle(ns.random.floatNum(0, width) - width/2, ns.random.floatNum(0, height) - height/2, r, '#' + ns.random.hexColourString());
        spawnChoice = 'line';
      } else if (spawnChoice == 'line') {
        shape = new ns.Line([ns.random.floatNum(0, width) - width/2, ns.random.floatNum(0, height) - height/2], [ns.random.floatNum(-1, 1), ns.random.floatNum(-1, 1)], ns.random.floatNum(100, 300));
        shape.colour = '#' + ns.random.hexColourString();
        shape.width = ns.random.floatNum(1,10);
        //spawnChoice = 'arc';
      } else if (spawnChoice == 'arc') {
        a = ns.random.floatNum(0,Math.PI * 2);
        b = ns.random.floatNum(a,Math.PI * 2);
        shape = new ns.Arc(ns.random.floatNum(0, width) - width/2, ns.random.floatNum(0, height) - height/2, r, a, b, false, '#' + ns.random.hexColourString());
        shape.cc = ns.random.element([true,false]);
        //spawnChoice = 'circle';
      }
      backgroundLayer.add(shape);
      spawns ++;
      if (spawns < 100) {
        spawnObject();
      }
    }, 50)
  }

  spawnObject();
})(boFloor);