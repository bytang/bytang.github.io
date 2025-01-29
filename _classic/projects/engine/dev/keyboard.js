/**
 * Created by BoYang on 2015-03-06.
 */

function Keyboard(object) {
  var kb = this;
  this.keyPress = [];

  this.keyDown = [];
  this.keyUp = [];

  this.keyHeld = [];

  this.keyDelta = [];
  this.keyDeltaMin = [];
  this.keyDeltaMax = [];

  this.keysDownCount = 0;

  this.keyStrings = [];
  this.keyStrings[8] = "backspace";
  this.keyStrings[9] = "tab";
  this.keyStrings[13] = "enter";
  this.keyStrings[16] = "shift";
  this.keyStrings[17] = "ctrl";
  this.keyStrings[18] = "alt";
  this.keyStrings[19] = "pauseBreak";
  this.keyStrings[20] = "capsLock";
  this.keyStrings[27] = "escape";
  this.keyStrings[32] = "spacebar";
  this.keyStrings[33] = "pageUp";
  this.keyStrings[34] = "pageDown";
  this.keyStrings[35] = "end";
  this.keyStrings[36] = "home";
  this.keyStrings[37] = "leftArrow";
  this.keyStrings[38] = "upArrow";
  this.keyStrings[39] = "rightArrow";
  this.keyStrings[40] = "downArrow";
  this.keyStrings[45] = "insert";
  this.keyStrings[46] = "delete";
  this.keyStrings[48] = "0";
  this.keyStrings[49] = "1";
  this.keyStrings[50] = "2";
  this.keyStrings[51] = "3";
  this.keyStrings[52] = "4";
  this.keyStrings[53] = "5";
  this.keyStrings[54] = "6";
  this.keyStrings[55] = "7";
  this.keyStrings[56] = "8";
  this.keyStrings[57] = "9";
  this.keyStrings[59] = "semiColon";
  this.keyStrings[65] = "a";
  this.keyStrings[66] = "b";
  this.keyStrings[67] = "c";
  this.keyStrings[68] = "d";
  this.keyStrings[69] = "e";
  this.keyStrings[70] = "f";
  this.keyStrings[71] = "g";
  this.keyStrings[72] = "h";
  this.keyStrings[73] = "i";
  this.keyStrings[74] = "j";
  this.keyStrings[75] = "k";
  this.keyStrings[76] = "l";
  this.keyStrings[77] = "m";
  this.keyStrings[78] = "n";
  this.keyStrings[79] = "o";
  this.keyStrings[80] = "p";
  this.keyStrings[81] = "q";
  this.keyStrings[82] = "r";
  this.keyStrings[83] = "s";
  this.keyStrings[84] = "t";
  this.keyStrings[85] = "u";
  this.keyStrings[86] = "v";
  this.keyStrings[87] = "w";
  this.keyStrings[88] = "x";
  this.keyStrings[89] = "y";
  this.keyStrings[90] = "z";
  this.keyStrings[91] = "leftWindow";
  this.keyStrings[92] = "rightWindow";
  this.keyStrings[93] = "select";
  this.keyStrings[96] = "num0";
  this.keyStrings[97] = "num1";
  this.keyStrings[98] = "num2";
  this.keyStrings[99] = "num3";
  this.keyStrings[100] = "num4";
  this.keyStrings[101] = "num5";
  this.keyStrings[102] = "num6";
  this.keyStrings[103] = "num7";
  this.keyStrings[104] = "num8";
  this.keyStrings[105] = "num9";
  this.keyStrings[106] = "multiply";
  this.keyStrings[107] = "add";
  this.keyStrings[109] = "subtract";
  this.keyStrings[110] = "decimal";
  this.keyStrings[111] = "divide";
  this.keyStrings[112] = "f1";
  this.keyStrings[113] = "f2";
  this.keyStrings[114] = "f3";
  this.keyStrings[115] = "f4";
  this.keyStrings[116] = "f5";
  this.keyStrings[117] = "f6";
  this.keyStrings[118] = "f7";
  this.keyStrings[119] = "f8";
  this.keyStrings[120] = "f9";
  this.keyStrings[121] = "f10";
  this.keyStrings[122] = "f11";
  this.keyStrings[123] = "f12";
  this.keyStrings[144] = "numLock";
  this.keyStrings[145] = "scrollLock";
  this.keyStrings[186] = "semiColon";
  this.keyStrings[187] = "equal";
  this.keyStrings[188] = "comma";
  this.keyStrings[189] = "dash";
  this.keyStrings[190] = "period";
  this.keyStrings[191] = "forwardSlash";
  this.keyStrings[192] = "graveAccent";
  this.keyStrings[219] = "openBracket";
  this.keyStrings[220] = "backSlash";
  this.keyStrings[221] = "closeBraket";
  this.keyStrings[222] = "singleQuote";

  this.keyCodes = {
    "backspace": 8,
    "tab": 9,
    "enter": 13,
    "shift": 16,
    "ctrl": 17,
    "alt": 18,
    "pauseBreak": 19,
    "capsLock": 20,
    "escape": 27,
    "spacebar": 32,
    "pageUp": 33,
    "pageDown": 34,
    "end": 35,
    "home": 36,
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
    "insert": 45,
    "delete": 46,
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,
    "a": 65,
    "b": 66,
    "c": 67,
    "d": 68,
    "e": 69,
    "f": 70,
    "g": 71,
    "h": 72,
    "i": 73,
    "j": 74,
    "k": 75,
    "l": 76,
    "m": 77,
    "n": 78,
    "o": 79,
    "p": 80,
    "q": 81,
    "r": 82,
    "s": 83,
    "t": 84,
    "u": 85,
    "v": 86,
    "w": 87,
    "x": 88,
    "y": 89,
    "z": 90,
    "leftWindow": 91,
    "rightWindow": 92,
    "select": 93,
    "num0": 96,
    "num1": 97,
    "num2": 98,
    "num3": 99,
    "num4": 100,
    "num5": 101,
    "num6": 102,
    "num7": 103,
    "num8": 104,
    "num9": 105,
    "multiply": 106,
    "add": 107,
    "subtract": 109,
    "decimal": 110,
    "divide": 111,
    "f1": 112,
    "f2": 113,
    "f3": 114,
    "f4": 115,
    "f5": 116,
    "f6": 117,
    "f7": 118,
    "f8": 119,
    "f9": 120,
    "f10": 121,
    "f11": 122,
    "f12": 123,
    "numLock": 144,
    "scrollLock": 145,
    "semiColon": 59,
    "equal": 187,
    "comma": 188,
    "dash": 189,
    "period": 190,
    "forwardSlash": 191,
    "graveAccent": 192,
    "openBracket": 219,
    "backSlash": 220,
    "closeBracket": 221,
    "singleQuote": 222
  };

  object.parentNode.onblur = function() {
    //console.log("window lost focus");
    if (kb.getKeysDownCount()) {
      kb.resetKeys();
    }
  };

  object.parentNode.oncontextmenu = function() {
    //console.log("window context menu");
    if (kb.getKeysDownCount()) {
      kb.resetKeys();
    }
  };

  object.onkeydown = function(e) {
    e.preventDefault();
    var time = (new Date()).getTime();
    if (!kb.keyPress[e.which]) {
      kb.keysDownCount++;
      kb.keyHeld[e.which] = 0;
      kb.keyPress[e.which] = true;
      var delta = time - kb.keyDown[e.which];
      kb.keyDeltaMin[e.which] = (Math.min(delta, kb.keyDeltaMin[e.which]) || delta || kb.keyDeltaMin[e.which]);
      kb.keyDeltaMax[e.which] = (Math.max(delta, kb.keyDeltaMax[e.which]) || delta || kb.keyDeltaMax[e.which]);
      kb.keyDelta[e.which] = delta;
    } else {
      kb.keyHeld[e.which] = kb.keyHeld[e.which] + time - kb.keyDown[e.which];
    }
    kb.keyDown[e.which] = time;
  };

  object.onkeyup = function(e) {
    kb.keysDownCount = Math.max(0, kb.keysDownCount - 1);
    kb.keyPress[e.which] = false;
    kb.keyUp[e.which] = (new Date()).getTime();
    kb.keyHeld[e.which] += kb.keyUp[e.which] - kb.keyDown[e.which];
  };

  this.isKeyDown = function(keyCode) {
    return this.keyDown[keyCode] > (this.keyUp[keyCode] || -1);
  };

  this.getKeysDownCount = function() {
    return this.keysDownCount;
  };

  this.getDoubleTapDelay = function(keyCode) {
    return this.keyDelta[keyCode] === undefined ? NaN : this.keyDelta[keyCode];
  };

  this.getDoubleTapDelayMin = function(keyCode) {
    return this.keyDeltaMin[keyCode] === undefined ? NaN : this.keyDeltaMin[keyCode];
  };

  this.getKeyString = function(keyCode) {
    return this.keyStrings[keyCode];
  };

  this.getKeyCode = function(keyString) {
    return this.keyCodes[keyString];
  };

  this.getKeysDown = function() {
    var keysDown = [];
    for (var i = 0; i < this.keyDown.length; i++) {
      if (this.isKeyDown(i)) {
        keysDown.push([i, this.keyDown[i]]);
      }
    }
    keysDown.sort(function(a, b) {
      return a[1] - b[1]
    });
    return keysDown;
  };

  this.getKeyHeldTime = function(keyCode) {
    if (this.keyPress[keyCode]) {
      return this.keyHeld[keyCode];
    }
    return NaN;
  };

  this.resetKeys = function() {
    this.keyDown = [];
    this.keyUp = [];
  };
}