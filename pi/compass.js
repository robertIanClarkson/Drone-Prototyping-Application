const i2c = require('i2c-bus');

class Compass {
  constructor(data) {
    /* address of sensor */
    this.SLAVE_ADDRESS = data.slave_address;

    /* write */
    this.OPTION_0 = 0x24; // Magnetic high resolution, o/p data rate 50 Hz
    this.OPTION_1 = 0x25; // Magnetic full scale selection, +/- 12 gauss
    this.OPTION_2 = 0x26; // Normal mode, magnetic continuous conversion mode
    this.VALUE_0 = 0x70;
    this.VALUE_1 = 0x00;
    this.VALUE_2 = 0x00;

    /* read */
    this.READ_0 = 0x08;
    this.READ_1 = 0x09;
    this.READ_2 = 0x0A;
    this.READ_3 = 0x0B;
    this.READ_4 = 0x0C;
    this.READ_5 = 0x0D;

    /* results */
    this.x_axis;
    this.y_axis;
    this.z_axis;

    /* for average */
    this.i = 0;
    this.bufferSize = 20;
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
          this.x_axis = Math.floor((this.x_axis / this.i) / 256)
          this.y_axis = Math.floor((this.y_axis / this.i) / 256)
          this.z_axis = Math.floor((this.z_axis / this.i) / 256)
          this.i = 0;
          resolve([this.x_axis, this.y_axis, this.z_axis])
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

module.exports = Compass;
