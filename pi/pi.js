/* THIS IS WHERE HARDWARE CODE BELONGS */
var rpio = require('rpio');
const Gpio = require('pigpio').Gpio;
const motor = new Gpio(18, {mode: Gpio.OUTPUT});


let isOn = false;
let PWD_VALUE = 0;
let PWD_AMOUNT = 100;

function setOn() {
  // let pulseWidth = 1860;
  let pulseWidth = 1000;
  let increment = 100;
  
  setInterval(() => {
    motor.servoWrite(pulseWidth);
  
    pulseWidth += increment;
    if (pulseWidth >= 2000) {
      increment = -100;
    } else if (pulseWidth <= 1000) {
      increment = 100;
    }
  }, 1000);
  isOn = true
};

function setOff() {
  isOn = false
};

function setDown() {
  PWD_VALUE -= PWD_AMOUNT
};

function setUp() {
  PWD_VALUE += PWD_AMOUNT
};

function getStatus() {
  return isOn
};

function getValue() {
  return PWD_VALUE
};

function test() {
  var pin = 12;           /* P12/GPIO18 */
  var range = 1024;       /* LEDs can quickly hit max brightness, so only use */
  var max = 128;          /*   the bottom 8th of a larger scale */
  var clockdiv = 8;       /* Clock divider (PWM refresh rate), 8 == 2.4MHz */
  var interval = 5;       /* setInterval timer, speed of pulses */
  var times = 5;          /* How many times to pulse before exiting */
  
  /*
  * Enable PWM on the chosen pin and set the clock and range.
  */
  rpio.open(pin, rpio.PWM);
  rpio.pwmSetClockDivider(clockdiv);
  rpio.pwmSetRange(pin, range);
  
  /*
  * Repeatedly pulse from low to high and back again until times runs out.
  */
  var direction = 1;
  var data = 0;
  var pulse = setInterval(function() {
    rpio.pwmSetData(pin, data);
    if (data === 0) {
      direction = 1;
      if (times-- === 0) {
        clearInterval(pulse);
        rpio.open(pin, rpio.INPUT);
        return;
      }
    } else if (data === max) {
      direction = -1;
    }
    data += direction;
  }, interval, data, direction, times);
}

module.exports = {
    setOn,
    setOff,
    setDown,
    setUp,
    getStatus,
    getValue,
    test
}