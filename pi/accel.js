// const i2c = require('i2c-bus');

class Accel {
    constructor(data) {
        /* address of sensor */
        this.SLAVE_ADDRESS = data.slave_address;
        
        /* write */
        this.OPTION_0 = 0x20;
        this.OPTION_1 = 0x21;
        this.VALUE_0 = 0x67;
        this.VALUE_1 = 0x20;

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

        this.i = 0;
        
        this.sum = {
            x_axis = 0,
            y_axis = 0,
            z_axis = 0
        }
    }

    start(sensor) {
        return new Promise( (resolve, reject) => {
            Promise.all([
                sensor.writeByte(this.SLAVE_ADDRESS, this.OPTION_0, this.VALUE_0),
                sensor.writeByte(this.SLAVE_ADDRESS, this.OPTION_1, this.VALUE_1)
            ])
            .then( () => {
                resolve()
            })
            .catch((err) => {
                reject(err)
            })
        });
    }

    convert(lsb, msb) {
        var result = ((msb & 0xFF) * 256 + (lsb & 0xFF))
		if(result > 32767) {
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
                this.sum.x_axis += this.convert(a, b)
                this.sum.y_axis += this.convert(c, d)
                this.sum.z_axis += this.convert(e, f)
                this.i += 1
                if(this.i == 100) {
                    resolve()
                } else {
                    this.recursiveRead(sensor)
                }
            })
            .catch(err => {
                reject("*** ACCEL: Error reading data")
            })
        })
    }

    read(sensor) {
        return new Promise((resolve, reject) => {
            this.recursiveRead(sensor)
            .then( () => {
                this.x_axis = Math.floor(this.sum.x_axis / this.i)
                this.y_axis = Math.floor(this.sum.y_axis / this.i)
                this.z_axis = Math.floor(this.sum.z_axis / this.i)
                this.sum.x_axis = 0;
                this.sum.y_axis = 0;
                this.sum.z_axis = 0;
                this.i = 0;
                resolve([this.x_axis, this.y_axis, this.z_axis])
            })
            .catch( err => {
                reject(err)
            })
        })
    }
}

module.exports = Accel;
