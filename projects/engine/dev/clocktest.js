var clock = new boFloor.Clock(),
  text = document.getElementById('text'),
  startButton = document.getElementById('startStopButton'),
  scaleButton = document.getElementById('setScaleButton'),
  slider = document.getElementById('myRange'),
  scale = Math.round(slider.value/2.5)/10,
  run = false;

scaleButton.textContent = scale;

setInterval(function(){
  text.textContent = clock.milliseconds;
  scale = Math.round(slider.value/2.5)/10;
  scaleButton.textContent = scale;
}, 1000/60);

function setScale() {
  scale = Math.round(slider.value/2.5)/10;
  if(clock.scale != scale) {
    clock.scale = scale;
  }
}

function startStop() {
  if (run) {
    clock.stop();
    startButton.textContent = 'Start';
    run = false;
  } else {
    clock.start();
    startButton.textContent = 'Stop';
    run = true;
  }
}