/**
 * Created by BoYang on 2014-09-15.
 */

var graphics = new Canvas("canvas"),
  gl = graphics.newLayer(),
  stats = graphics.newLayer(),
  text = gl.add(new Text('HELLO WORLD\nxD\nayy lmao', 0, 0, 100)),
  updateStat = stats.add(new Text('', 0, 12)),
  //line = gl.add(new Line([40, 60], [1, 0.3], 999)),
  clock = new Clock(),
  clock2 = new Clock(),
  clock3 = new Clock(),
  time = stats.add(new Text('', 200, 12)),
  cur = undefined,
  updateTime = 0,
  lastUpdate = 0,
  updateDelay = 0,
  frames = 0,
  fps = 0;

text.set('colour', 'yellow');
text.set('align', 'center');
text.set('position', 'relative');
updateStat.set('colour', 'white');
//line.set('colour', 'blue');
clock.setScale(0.5);
clock2.setScale(4);
time.set('colour', 'red');

function update() {
  cur = (new Date()).getTime();

  if (lastUpdate) {
    updateDelay = cur - lastUpdate;
  }
  lastUpdate = cur;

  // Put logic loop code here
  clock.tick();
  clock2.tick();
  clock3.tick();
  time.set('string', clock3.seconds().toString() + "\n" + clock.seconds().toString() + "\n" + clock2.seconds().toString());
  //

  updateTime = (new Date()).getTime() - cur;
  frames ++;
  updateStat.set('string', updateTime.toString() + "\n" + updateDelay.toString() + "\n" + fps.toString());
}

setInterval(function() {
  update();
  graphics.clear();
  graphics.draw();
}, 1000/144);

setInterval(function() {
  fps = frames;
  frames = 0;
}, 1000);