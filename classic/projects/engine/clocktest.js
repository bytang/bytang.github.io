var clock = new Clock();
var text = document.getElementById('text');
var scaleButton = document.getElementById('setScaleButton');
var slider = document.getElementById('myRange');
var scale = Math.round(slider.value/2.5)/10;
scaleButton.textContent = scale;
clock.start();
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