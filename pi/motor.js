/* THIS IS WHERE HARDWARE CODE BELONGS */

class Motor {
  // rpio = require('rpio');
  Gpio = require('pigpio').Gpio;
  motor;
  isOn = false;
  PWD_VALUE = 1130;
  PWD_AMOUNT = 20;
  constructor(pin) {
    this.motor = new Gpio(pin, {mode: Gpio.OUTPUT});
  }
  
  

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setOn() {
    isOn = true
    
    motor.servoWrite(1860)
    await sleep(2000);
    
    motor.servoWrite(1060)
    await sleep(2000);
    
    motor.servoWrite(0)
    await sleep(1000);
    
    motor.servoWrite(1130)
  };

  setOff() {
    isOn = false
    motor.servoWrite(0)
  };

  setDown() {
    PWD_VALUE -= PWD_AMOUNT
    motor.servoWrite(PWD_VALUE)
  };

  setUp() {
    PWD_VALUE += PWD_AMOUNT
    motor.servoWrite(PWD_VALUE)
  };

  setSpeed(speed) {
    PWD_VALUE = 1130 + (speed * 5)
    motor.servoWrite(PWD_VALUE)
  };

  getOnStatus() {
    return isOn
  };

  getSpeed() {
    return PWD_VALUE
  };
}

module.exports = Motor;