/**
 * Bo Yang Tang
 * boyangtang.ca
 */

var clock = Clock.prototype,
  unitStrings = ['milliseconds', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'years'],
  unitModulos = [1000, 60, 60, 24, 7, 52],
  unitValues = [0, 0, 0, 0, 0, 0, 0];

function Clock() {
  this.last = NaN;
  this.baseTime = 0;
  this.speed = 1;
}

Object.defineProperty(clock, 'time', {
  get: function() {
    if (isNaN(this.last)) {
      return this.baseTime;
    }
    return this.baseTime + ((new Date()).getTime() - this.last) * this.scale;
  },
  set: function(ms) {
    this.baseTime = ms;
    this.last = NaN;
    console.log('clock time set to ' + this.time.toString());
  }
});

Object.defineProperty(clock, 'scale', {
  get: function() {
    return this.speed;
  },
  set: function(n) {
    if (this.speed == n) {
      console.log('clock scale already at ' + this.speed.toString());
    } else {
      this.baseTime = this.time;
      this.speed = n;
      if (!isNaN(this.last)) {
        this.last = (new Date()).getTime();
      }
      console.log('clock scale set to ' + this.speed.toString());
    }
  }
});

Object.defineProperty(clock, 'milliseconds', {
  get: function() { return Math.floor(this.time) },
  set: function(t) { this.time = t }
});

Object.defineProperty(clock, 'seconds', {
  get: function() { return Math.floor(this.time / 1000) },
  set: function(t) { this.time = t * 1000 }
});

Object.defineProperty(clock, 'minutes', {
  get: function() { return Math.floor(this.time / 60000) },
  set: function(t) { this.time = t * 60000 }
});

Object.defineProperty(clock, 'hours', {
  get: function() { return Math.floor(this.time / 3600000) },
  set: function(t) { this.time = t * 3600000 }
});

Object.defineProperty(clock, 'days', {
  get: function() { return Math.floor(this.time / 86400000) },
  set: function(t) { this.time = t * 86400000 }
});

Object.defineProperty(clock, 'weeks', {
  get: function() { return Math.floor(this.time / 604800000) },
  set: function(t) { this.time = t * 604800000 }
});

Object.defineProperty(clock, 'years', {
  get: function() { return Math.floor(this.time / 31449600000) },
  set: function(t) { this.time = t * 31449600000 }
});

Clock.prototype.importSettings = function importSettings(settingsArray) {
  this.last = settingsArray[0];
  this.baseTime = settingsArray[1];
  this.speed = settingsArray[2];
};

Clock.prototype.exportSettings = function exportSettings() {
  return [this.last, this.baseTime, this.speed];
};

Clock.prototype.reset = function reset() {
  console.log('clock reset at ' + this.time.toString());
  this.last = NaN;
  this.baseTime = 0;
  this.speed = 1;
};

Clock.prototype.start = function start() {
  if (isNaN(this.last)) {
    console.log('clock started at ' + this.time.toString());
    this.last = (new Date()).getTime();
  } else {
    console.log('clock already ticking');
  }
};

Clock.prototype.stop = function stop() {
  this.time = this.time;
  console.log('clock stopped at ' + this.time.toString());
};