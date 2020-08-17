const i2c = require('i2c-bus');

class Compass {
  constructor(data) {
    /* address of sensor */
    this.SLAVE_ADDRESS = data.slave_address;

    /* write */
    this.OPTION_0 = 0x00; // Magnetic high resolution, o/p data rate 50 Hz
    this.OPTION_1 = 0x01; // Magnetic full scale selection, +/- 12 gauss
    this.OPTION_2 = 0x02; // Normal mode, magnetic continuous conversion mode
    
    this.VALUE_0 = 0x98;
    this.VALUE_1 = 0xE0;
    this.VALUE_2 = 0x00;

    /* read */
    this.READ_0 = 0x03;
    this.READ_1 = 0x04;
    this.READ_2 = 0x05;
    this.READ_3 = 0x06;
    this.READ_4 = 0x07;
    this.READ_5 = 0x08;

    /* results */
    this.x_axis;
    this.y_axis;
    this.z_axis;
    // this.heading;

    /* for average */
    this.i = 0;
    this.bufferSize = 10;

    /* offset */
    this.xOffset = 0;
    this.yOffset = 0;
    this.zOffset = 0;

    /* filter */
    this.filter = .40;
    this.x_axis_f = 0;
    this.y_axis_f = 0;
    this.z_axis_f = 0;
  }

  start(sensor) {
    return new Promise((resolve, reject) => {
      Promise.all([
        sensor.writeByte(this.SLAVE_ADDRESS, this.OPTION_0, this.VALUE_0),
        sensor.writeByte(this.SLAVE_ADDRESS, this.OPTION_1, this.VALUE_1),
        sensor.writeByte(this.SLAVE_ADDRESS, this.OPTION_2, this.VALUE_2)
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
          this.z_axis += this.convert(c, d)
          this.y_axis += this.convert(e, f)
          this.i += 1
          if (this.i == this.bufferSize) {
            resolve()
          } else {
            resolve(this.recursiveRead(sensor))
          }
        })
        .catch(err => {
          reject("*** COMPASS: Error reading data")
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
          this.x_axis = (this.x_axis / this.bufferSize)
          this.y_axis = (this.y_axis / this.bufferSize)
          this.z_axis = (this.z_axis / this.bufferSize)
          this.x_axis_f = Math.round((1.0 - this.filter) * this.x_axis_f + this.filter * this.x_axis)
          this.y_axis_f = Math.round((1.0 - this.filter) * this.y_axis_f + this.filter * this.y_axis)
          this.z_axis_f = Math.round((1.0 - this.filter) * this.z_axis_f + this.filter * this.z_axis)
          resolve({
            x_axis: (this.x_axis_f + this.xOffset),
            y_axis: (this.y_axis_f + this.yOffset),
            z_axis: (this.z_axis_f + this.zOffset)
          })
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

module.exports = Compass;
