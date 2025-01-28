/**
 * Created by BoYang on 2014-09-18.
 */
var fonts = ['\'Lucida Console\', Monaco, monospace', '\'Cutive Mono\'', '\'Fira Mono\'', '\'Share Tech Mono\'', '\'Ubuntu Mono\''],
  fontChoice = 0,
  unitStrings = ['year','week', 'day', 'hour', 'minute', 'second', ''],
  unitValues = [52, 7, 24, 60, 60, 1000, 1],
  maxStringLength = 7,
  maxStringLines = unitStrings.length,
  padding = 20,  // canvas padding (px) for maximum font size
  tickButton = document.getElementById("tick"),
  resetButton = document.getElementById("reset"),
  buttonFontSize = 0,
  run = false,
  clock = new Clock(),
  display = new Canvas("canvas"),
  drawLayer = display.newLayer(),
  timeString = drawLayer.add(new Text('', 0, 0, fontFit(), fonts[fontChoice], 'white', 'center')),
  updateTime = 0,
  lastUpdate = 0,
  updateDelay = 0,
  cur,
  process,
  fps = 144;

tickButton.style.fontFamily = fonts[fontChoice];
resetButton.style.fontFamily = fonts[fontChoice];

function load() {
  var loader;
  loader = localStorage.getItem('timerFont');
  if (loader) {
    loader = parseInt(loader);
    console.log('timerFont = ' + fonts[loader]);
    fontChoice = loader;
    applyFont();
  }
  loader = localStorage.getItem('timerClock');
  if (loader) {
    console.log('timerClock = ' + loader);
    loader = loader.split(',');
    if (loader.length == 3) {
      if (loader[0] == 'NaN') {
        loader[0] = NaN;
      } else {
        loader[0] = parseFloat(loader[0]);
      }
      loader[1] = parseFloat(loader[1]);
      loader[2] = parseFloat(loader[2]);
      clock.importSettings(loader);
      console.log('clock loaded to ' + clock.milliseconds.toString());
    } else {
      console.log('corrupted clock cannot load');
    }
  }
  loader = localStorage.getItem('timerState');
  if (loader) {
    console.log('timerState = ' + loader);
    run = (loader == 'true');
    if (run) {
      tickButton.innerHTML = "Stop";
      process = setInterval(function() {
        update();
      }, 1000 / fps);
    } else {
      tickButton.innerHTML = "Start";
      update();
    }
  }
}

function prepend(string, length, prependString) {
  var i = string.length,
    output = '';
  for (; i < length; i += prependString.length) {
    output += prependString;
  }
  return output.substring(0, length) + string;
}

function humanize(milliseconds) {
  var denom = mult(unitValues),
    units,
    out = '',
    string = '';
  for (var i = 0; i < unitValues.length; i++) {
    units = Math.floor(milliseconds / denom);
    if (unitValues[i] == 1 || units) {
      string = units.toString() + (unitStrings[i].length ? " " : "") + pluralize(unitStrings[i], units);
      if (unitValues[i] == 1) {
        string = prepend(string, 3, '0');
      }
      out += string + "\n";
    }
    milliseconds %= denom;
    denom /= unitValues[i];
  }
  if (out.length) {
    return out.substring(0, out.length - 1);
  }
  return "0";
}

function pretty(milliseconds) {
  var denom = mult(unitValues),
    units,
    out = "",
    i = 0;

  for (; i < unitValues.length; i++) {
    units = Math.floor(milliseconds / denom);
    if (i) {
      out += prepend(units.toString(), (unitValues[i - 1] - 1).toString().length, '0');
    } else {
      out += units.toString();
    }
    out += ":";
    milliseconds %= denom;
    denom /= unitValues[i];
  }
  return out.substring(0, out.length - 1);
}

function mult(array, start, stop) {
  var result = NaN;
  start = (start || 0);
  stop = (stop || array.length);  
  if (array.length) {
    result = 1;
    for (var i = start; i < stop; i++) {
      result *= array[i];
    }
  }
  return result;
}

function pluralize(string, quantity) {
  if (quantity == 1) {
    return string;
  }
  else {
    if (string) {
      return string + "s";
    }
    return string;
  }
}

function fontFit() {
  return Math.min((display.width - padding * 2) / maxStringLength, (display.height - padding * 2) / maxStringLines);
}

function buttonFontFit() {
  var fontSize;
  diff = Math.max(Math.floor(Math.min(display.height * 0.08, display.width * 0.08)), 2) - buttonFontSize;
  if (Math.abs(diff) > 2) {
    buttonFontSize += diff;
    fontSize = buttonFontSize.toString() + 'px';
    tickButton.style.fontSize = fontSize;
    resetButton.style.fontSize = fontSize;
  }
}

function cycleFont() {
  if (fonts.length - fontChoice == 1) {
    fontChoice = 0;
  } else {
    fontChoice ++;
  }
  applyFont();
}

function applyFont() {
  timeString.set('fontFamily', fonts[fontChoice]);
  tickButton.style.fontFamily = fonts[fontChoice];
  resetButton.style.fontFamily = fonts[fontChoice];
}

timeString.set('position', 'relative');
timeString.set('string', humanize(clock.milliseconds));

function update() {
  timeString.set('string', humanize(clock.milliseconds));
}

function render() {
  cur = (new Date()).getTime();
  if (lastUpdate) {
    updateDelay = cur - lastUpdate;
  }
  lastUpdate = cur;

  // Put render loop code here
  display.draw();
  //

  updateTime = (new Date()).getTime() - cur;
}

function startStop() {
  if (run) {
    clock.stop();
    tickButton.innerHTML = "Start";
    clearInterval(process);
    update();
  } else {
    clock.start();
    tickButton.innerHTML = "Stop";
    process = setInterval(function() {
      update();
    }, 1000/fps);
  }
  run = !run;
}

function reset() {
  clock.reset();
  if (run) {
    clock.start();    
  } else {
    update();
  }
}

window.onunload = function() {
  localStorage.setItem('timerClock', clock.exportSettings());
  localStorage.setItem('timerFont', fontChoice);
  localStorage.setItem('timerState', run);
  console.log('clock saved');
};

window.onresize = function() {
  display.fillWindow();
  timeString.set('fontSize', fontFit());
  buttonFontFit();
};

buttonFontFit();
load();

setInterval(function() {
  render();
}, 1000/fps);