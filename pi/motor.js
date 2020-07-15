/* THIS IS WHERE HARDWARE CODE BELONGS */
var rpio = require('rpio');
const Gpio = require('pigpio').Gpio;
const motor;


let isOn = false;
let PWD_VALUE = 1130;
let PWD_AMOUNT = 20;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function init(pin) {
  motor = new Gpio(pin, {mode: Gpio.OUTPUT});
}

async function setOn() {
  isOn = true
  
  motor.servoWrite(1860)
  await sleep(2000);
  
  motor.servoWrite(1060)
  await sleep(2000);
  
  motor.servoWrite(0)
  await sleep(1000);
  
  motor.servoWrite(1130)
};

function setOff() {
  isOn = false
  motor.servoWrite(0)
};

function setDown() {
  PWD_VALUE -= PWD_AMOUNT
  motor.servoWrite(PWD_VALUE)
};

function setUp() {
  PWD_VALUE += PWD_AMOUNT
  motor.servoWrite(PWD_VALUE)
};

function setSpeed(data) {
  PWD_VALUE = 1130 + (data.speed * 5)
  motor.servoWrite(PWD_VALUE)
};

function getOnStatus() {
  return isOn
};

function getSpeed() {
  return PWD_VALUE
};

module.exports = {
    setOn,
    setOff,
    setDown,
    setUp,
    getOnStatus,
    getSpeed,
    setSpeed
}