/**
 * Created by BoYang on 2015-01-29.
 */
var boFloor = boFloor || {};
(function (namespace) {
  namespace.Mouse = function Mouse(elementID) {
    var mouse = this;
    this.capture = document.getElementById(elementID);
    this.properties = {
      x: NaN,
      y: NaN,
      buttonDown: [],
      buttonUp: [],
      buttonDelta: [],
      buttonDeltaMin: [],
      buttonsDownCount: 0,
      click: false,
      clickButton: NaN
    };

    this.capture.onmousedown = function(e) {
      mouse.properties.buttonDown[e.which] = [(new Date()).getTime(), [mouse.properties.x, mouse.properties.y]];
      mouse.properties.buttonsDownCount++;
      mouse.properties.click = true;
      mouse.properties.clickButton = e.which;
    };

    this.capture.onmouseup = function(e) {
      mouse.properties.buttonUp[e.which] = [(new Date()).getTime(), [mouse.properties.x, mouse.properties.y]];
      mouse.properties.buttonsDownCount--;
    };

    this.capture.onmousemove = function(e) {
      mouse.properties.x = e.clientX;
      mouse.properties.y = e.clientY;
    };
  };

  namespace.Mouse.prototype.isButtonDown = function isButtonDown(button) {
    if (this.properties.buttonDown[button]) {
      if (this.properties.buttonUp[button]) {
        return this.properties.buttonDown[button][0] > this.properties.buttonUp[button][0];
      }
      return true;
    }
    return false;
  };

  namespace.Mouse.prototype.getButtonsDown = function getButtonsDown() {
    var buttonsDown = [];
    if (this.getButtonsDownCount()) {
      for (var i = 0; i < this.properties.buttonDown.length; i++) {
        if (this.isButtonDown(i)) {
          buttonsDown.push([i, this.properties.buttonDown[i]]);
        }
      }
      buttonsDown.sort(function(a, b) {
        return a[1] - b[1];
      });
    }
    return buttonsDown;
  };

  namespace.Mouse.prototype.getButtonsDownCount = function getButtonsDownCount() {
    return this.properties.buttonsDownCount;
  };

  namespace.Mouse.prototype.mouseDownAction = function mouseDownAction(foo) {
    this.capture.onmousedown = function(e) {
      foo();
    }
  };

  namespace.Mouse.prototype.isClick = function isClick() {
    if (this.properties.click) {
      this.properties.click = false;
      return true;
    }
    return false;
  };

  namespace.Mouse.prototype.getLastClickTime = function getLastClickTime() {
    return this.properties.buttonDown[this.properties.clickButton][0];
  };

  namespace.Mouse.prototype.getPos = function getPos() {
    return [this.properties.x, this.properties.y];
  };
})(boFloor);