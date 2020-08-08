/* THIS IS WHERE HARDWARE CODE BELONGS */
// const rpio = require('rpio');
const Gpio = require('pigpio').Gpio;

class Motor {
  constructor(pin) {
    this.motor;
    this.isOn = false;
    this.PWM_VALUE = 1130;
    this.PWM_AMOUNT = 20;
    this.motor = new Gpio(pin, {mode: Gpio.OUTPUT});
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setOn() {
    return new Promise((resolve, reject) => {
        this.motor.servoWrite(1120)
        this.sleep(500)
        .then(() => {
          this.motor.servoWrite(1130)
          this.sleep(500)
          .then(() => {
            this.motor.servoWrite(1140)
            this.sleep(500)
            .then(() => {
              this.motor.servoWrite(1150)
              this.isOn = true
              resolve()
            })
          })    
        })
        .catch(err => {
          reject(err)
        })
    });    
  };

  setOff() {
    this.isOn = false
    this.motor.servoWrite(0)
  };

  setDown() {
    this.PWM_VALUE -= this.PWM_AMOUNT
    this.motor.servoWrite(this.PWM_VALUE)
  };

  setUp() {
    this.PWM_VALUE += this.PWM_AMOUNT
    this.motor.servoWrite(this.PWM_VALUE)
  };

  setSpeed(speed) {
    this.PWM_VALUE = 1130 + (speed * 5)
    this.motor.servoWrite(this.PWM_VALUE)
  };

  getOnStatus() {
    return this.isOn
  };

  getSpeed() {
    return this.PWM_VALUE
  };

  tune(offset) {
    this.motor.servoWrite(this.PWM_VALUE + (offset * 5))
  };
}

module.exports = Motor;
