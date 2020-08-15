// const i2c = require('i2c-bus');

class Accel {
  constructor(data) {
    /* address of sensor */
    this.SLAVE_ADDRESS = data.slave_address;

    /* write */
    this.OPTION_0 = 0x20;
    this.OPTION_1 = 0x21;
    this.VALUE_0 = 0x67;
    this.VALUE_1 = 0x00;

    /* read */
    this.READ_0 = 0x28;
    this.READ_1 = 0x29;
    this.READ_2 = 0x2A;
    this.READ_3 = 0x2B;
    this.READ_4 = 0x2C;
    this.READ_5 = 0x2D;

    /* results */
    this.x_axis;
    this.y_axis;
    this.z_axis;

    /* for average */
    this.i = 0;
    this.bufferSize = 20;

    /* offset */
    this.xOffset = 0;
    this.yOffset = 0;
    this.zOffset = 0;

    /* filter */
    this.filter = .20;
    this.x_axis_f = 0;
    this.y_axis_f = 0;
    this.z_axis_f = 0;
  }

  start(sensor) {
    return new Promise((resolve, reject) => {
      Promise.all([
        sensor.writeByte(this.SLAVE_ADDRESS, this.OPTION_0, this.VALUE_0),
        sensor.writeByte(this.SLAVE_ADDRESS, this.OPTION_1, this.VALUE_1)
      ])
        .then(() => {
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    });
  }

  convert(lsb, msb) {
    var result = ((msb & 0xFF) * 256 + (lsb & 0xFF))
    if (result > 32767) {
      result -= 65536
    }
    return result
  }

  recursiveRead(sensor) {
    return new Promise((resolve, reject) => {
      Promise.all([
        sensor.readByte(this.SLAVE_ADDRESS, this.READ_0),
        sensor.readByte(this.SLAVE_ADDRESS, this.READ_1),
        sensor.readByte(this.SLAVE_ADDRESS, this.READ_2),
        sensor.readByte(this.SLAVE_ADDRESS, this.READ_3),
        sensor.readByte(this.SLAVE_ADDRESS, this.READ_4),
        sensor.readByte(this.SLAVE_ADDRESS, this.READ_5)
      ])
        .then(([a, b, c, d, e, f]) => {
          this.x_axis += this.convert(a, b)
          this.y_axis += this.convert(c, d)
          this.z_axis += this.convert(e, f)
          this.i += 1
          if (this.i == this.bufferSize) {
            resolve()
          } else {
            resolve(this.recursiveRead(sensor))
          }
        })
        .catch(err => {
          reject("*** ACCEL: Error reading data")
        })
    })
  }

  read(sensor) {
    this.x_axis = 0;
    this.y_axis = 0;
    this.z_axis = 0;
    return new Promise((resolve, reject) => {
      this.recursiveRead(sensor)
        .then(() => {
          this.i = 0;
          this.x_axis = Math.floor((this.x_axis / this.bufferSize) / 256) + this.xOffset
          this.y_axis = Math.floor((this.y_axis / this.bufferSize) / 256) + this.yOffset
          this.z_axis = Math.floor((this.z_axis / this.bufferSize) / 256) + this.zOffset
          this.x_axis_f = (1.0 - this.filter) * this.x_axis_f + this.filter * this.x_axis
          this.y_axis_f = (1.0 - this.filter) * this.y_axis_f + this.filter * this.y_axis
          this.z_axis_f = (1.0 - this.filter) * this.z_axis_f + this.filter * this.z_axis
          resolve([Math.round(this.x_axis_f), Math.round(this.y_axis_f), Math.round(this.z_axis_f)])
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  zeroXY(sensor) {
    this.read(sensor)
      .then(([x, y, z]) => {
        this.xOffset = (- x)
        this.yOffset = (- y)
      })
  }

  zeroZ(sensor) {
    this.read(sensor)
      .then(([x, y, z]) => {
        this.zOffset = (- z)
      })
  }
}

module.exports = Accel;
