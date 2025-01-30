/**
 * Created by BoYang on 2014-10-09.
 */

/* States: 0 = program initialized and waiting for user input to begin test
 1 = user waiting for prompt to click
 2 = measures time from prompt to user input
 3 = displays measurement and prompts for further testing
 4 = test failed
 */

function Reaction() {
  var state = 0,
    display = new Canvas('canvas'),
    input = new Mouse('canvas'),
    layer = display.newLayer(),
    textOutput = layer.add(new Text('Sample Text', 0, 0, 35, '"Open Sans", sans-serif', 'white', 'center', 'relative')),
    history = [],
    average = 0,
    timer,
    accurateTimer,
    delay,
    stateSet = true,
    process,
    render,
    idleBackgroundColour = '#000000',
    idleTextColour = '#FFFFFF',
    reactBackgroundColour = '#B20033',
    reactTextColour = '#00FF1F';

  display.background(idleBackgroundColour);
  textOutput.set('colour', idleTextColour);

  function main() {
    if (state == 0) {
      if (stateSet) {
        textOutput.set('string', 'Instructions: click when the background turns dark pink.\n\nClick to begin.');
        stateSet = false;
      }
      if (input.isClick()) {
        state = 1;
        stateSet = true;
      }
    }
    else if (state == 1) {
      if (stateSet) {
        textOutput.set('string', 'Click when the background turns dark pink.');
        stateSet = false;
        delay = setTimeout(function() {
          state = 2;
          stateSet = true;
          display.background(reactBackgroundColour);
          accurateTimer = new Date().getTime();
          console.log(accurateTimer);
          textOutput.set('string', '');
        }, getRandomInt(1400, 4000));
      }
      if (input.isClick()) {
        clearTimeout(delay);
        state = 4;
        stateSet = true;
      }
    }
    else if (state == 2) {
      if (stateSet) {
        stateSet = false;
      }
      if (input.isClick()) {
        console.log(input.getLastClickTime());
        accurateTimer -= input.getLastClickTime();
        state = 3;
        stateSet = true;
      }
    }
    else if (state == 3) {      
      if (stateSet) {
        textOutput.set('colour', reactTextColour);
        textOutput.set('string', (-accurateTimer).toString() + ' milliseconds\n\nClick to measure again.');
        stateSet = false;
      }
      if (input.isClick()) {
        display.background(idleBackgroundColour);
        textOutput.set('colour', idleTextColour);
        state = 1;
        stateSet = true;
      }
    }
    else if (state == 4) {
      if (stateSet) {
        display.background(idleBackgroundColour);
        textOutput.set('colour', idleTextColour);
        textOutput.set('string', 'You clicked too soon.\n\nClick to measure again.');
        stateSet = false;
      }
      if (input.isClick()) {
        state = 1;
        stateSet = true;
      }
    }
  }

  render = setInterval(function() {
    main();
    display.draw();
  }, 1000/144);
}

Reaction();