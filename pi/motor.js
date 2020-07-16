/* THIS IS WHERE HARDWARE CODE BELONGS */
const rpio = require('rpio');
const Gpio = require('pigpio').Gpio;
class Motor {
  constructor(pin) {
    this.motor;
    this.isOn = false;
    this.PWD_VALUE = 1130;
    this.PWD_AMOUNT = 20;
    this.motor = new Gpio(pin, {mode: Gpio.OUTPUT});
  }
  
  

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setOn() {
    this.isOn = true
    this.motor.servoWrite(1860)
    sleep(2000).then(() => {
      this.motor.servoWrite(1060)
      sleep(2000).then(() => {
        this.motor.servoWrite(0)
        sleep(1000).then(() => {
          this.motor.servoWrite(1130)
        })
      })
    });    
  };

  setOff() {
    this.isOn = false
    this.motor.servoWrite(0)
  };

  setDown() {
    this.PWD_VALUE -= this.PWD_AMOUNT
    this.motor.servoWrite(this.PWD_VALUE)
  };

  setUp() {
    this.PWD_VALUE += this.PWD_AMOUNT
    this.motor.servoWrite(this.PWD_VALUE)
  };

  setSpeed(speed) {
    this.PWD_VALUE = 1130 + (speed * 5)
    motor.servoWrite(this.PWD_VALUE)
  };

  getOnStatus() {
    return this.isOn
  };

  getSpeed() {
    return this.PWD_VALUE
  };
}

module.exports = Motor;