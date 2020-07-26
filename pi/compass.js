const i2c = require('i2c-bus');

class Compass {
    constructor(data) {
        /* address of sensor */
        this.SLAVE_ADDRESS = data.slave_address;
        
        /* write */
        this.OPTION_0 = 0x24; // Magnetic high resolution, o/p data rate 50 Hz
        this.OPTION_1 = 0x25; // Magnetic full scale selection, +/- 12 gauss
        this.OPTION_2 = 0x26; // Normal mode, magnetic continuous conversion mode
        this.VALUE_0 = 0xF0;
        this.VALUE_1 = 0x60;
        this.VALUE_2 = 0X00;
        
        //Default
        // this.VALUE_0 = 0x18;
        // this.VALUE_1 = 0x20;
        // this.VALUE_2 = 0X02;

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
    }

    start() {
        return new Promise( (resolve, reject) => {
            i2c.openPromisified(1)
            .then(sensor => {
                Promise.all([
                    sensor.writeByte(this.SLAVE_ADDRESS, this.OPTION_0, this.VALUE_0),
                    sensor.writeByte(this.SLAVE_ADDRESS, this.OPTION_1, this.VALUE_1),
                    sensor.writeByte(this.SLAVE_ADDRESS, this.OPTION_2, this.VALUE_2)
                ])
                .then( () => {
                    sensor.close()
                    resolve()
                })
	        .catch((err) => {
		    reject(err)
                })
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

    read() {
        return new Promise((resolve, reject) => {
            i2c.openPromisified(1)
            .then(sensor => {
                sensor.readWord(this.SLAVE_ADDRESS, this.READ_0).then( x => {
                    sensor.readWord(this.SLAVE_ADDRESS, this.READ_2).then( y => {
                        sensor.readWord(this.SLAVE_ADDRESS, this.READ_4).then( z => {
                            sensor.close( () => {
                                console.log(`X --> ${x}`)
                                console.log(`Y --> ${y}`)
                                console.log(`Z --> ${z}`)
                                resolve([x, y, z])
                            })
                            .catch(err =>{
                                reject("*** Error closing i2c bus")    
                            })
                        })
                        .catch(err =>{
                            reject("*** Error reading mag z-axis")    
                        })
                    })
                    .catch(err =>{
                        reject("*** Error reading mag y-axis")    
                    })
                })
                .catch(err =>{
                    reject("*** Error reading mag x-axis")    
                })
            })
            .catch(err => {
                sensor.close()
                reject("*** Error opening i2c bus")
            })
        })
    }
}

module.exports = Compass;
