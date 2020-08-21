/* THIS IS WHERE HARDWARE CODE BELONGS */
// const rpio = require('rpio');
const Gpio = require('pigpio').Gpio;

class Motor {
  constructor(pin) {
    this.motor;
    this.isOn = false;
    this.PWM_VALUE = 0;
    this.TUNE = 0;
    this.motor = new Gpio(pin, { mode: Gpio.OUTPUT });
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
                  this.PWM_VALUE = 1150
                  this.motor.servoWrite(this.PWM_VALUE)
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
    this.PWM_VALUE = 0
    this.motor.servoWrite(this.PWM_VALUE)
  };

  setSpeed(speed) {
    this.PWM_VALUE = 1150 + (speed * 5)
    this.motor.servoWrite(this.PWM_VALUE)
  };

  setTune(tune) {
    if(this.PWM_VALUE >= 1150) {
      this.TUNE = tune
      this.motor.servoWrite(this.PWM_VALUE + (this.TUNE * 5))
    }
  };

  getOnStatus() {
    return this.isOn
  };

  getSpeed() {
    return (this.PWM_VALUE + (this.TUNE * 5))
  };

  getValue() {
    let val = (this.PWM_VALUE - 1150) / 5
    if(val < 0) return 0
    return val
  };

  getTune() {
    return this.TUNE;
  }
}

module.exports = Motor;
