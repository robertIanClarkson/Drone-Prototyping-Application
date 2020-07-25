const i2c = require('i2c-bus');

class Compass {
    constructor(data) {
        /* address of sensor */
        this.SLAVE_ADDRESS = data.slave_address;
        
        /* write */
        this.OPTION_0 = 0x24; // Magnetic high resolution, o/p data rate 50 Hz
        this.OPTION_1 = 0x25; // Magnetic full scale selection, +/- 12 gauss
        this.OPTION_2 = 0X26; // Normal mode, magnetic continuous conversion mode
        this.VALUE_0 = 0x70;
        this.VALUE_1 = 0x60;
        this.VALUE_2 = 0X00;
        
        /* read */
        this.READ_0 = 0x08;
        this.READ_1 = 0x0A;
        this.READ_2 = 0x0C;
        this.data_0;
        this.data_1;
        this.data_2;
    }

    start() {
        i2c.openPromisified(1)
            .then(sensor => {
                Promise.all([
                    sensor.writeByte(this.SLAVE_ADDRESS, this.OPTION_0, this.VALUE_0),
                    sensor.writeByte(this.SLAVE_ADDRESS, this.OPTION_1, this.VALUE_1),
                    sensor.writeByte(this.SLAVE_ADDRESS, this.OPTION_2, this.VALUE_2)
                ])
                .then( () => {
                    sensor.close()
                    console.log("Compass Ready")
                })
            })
    }

    read() {
        i2c.openPromisified(1)
        .then(sensor => {
            Promise.all([
                sensor.readWord(this.SLAVE_ADDRESS, this.READ_0),
                sensor.readWord(this.SLAVE_ADDRESS, this.READ_1),
                sensor.readWord(this.SLAVE_ADDRESS, this.READ_2)
            ])
            .then(results => {
                sensor.close()
                return results
            })     
        })
    }
}

module.exports = Compass;
