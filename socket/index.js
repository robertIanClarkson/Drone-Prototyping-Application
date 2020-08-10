const socketIo = require( 'socket.io' )
const i2c = require('i2c-bus');

const Motor = require('../pi/motor')
const Compass = require('../pi/compass')
const Gyro = require('../pi/gyro')
const Accel = require('../pi/accel')

const init = ( app, server ) => {
  const io = socketIo( server )

  app.set( 'io', io )

  var motor_0;
  var motor_1;
  var compass;
  var gyro;
  var accel;

  io.on( 'connection', socket => {
    console.log( 'client connected' )
    // Open Bus
    i2c.openPromisified(1)
    .then(sensor => {
      socket.on( 'init-sensors' , data => {
        this.compass = new Compass(data.compass)
        this.gyro = new Gyro(data.gyro)
        this.accel = new Accel(data.accel)
  
        this.compass.start(sensor).then(() => {
          console.log('*** Compass Ready')
          this.gyro.start(sensor).then(() => {
            console.log('*** Gyro Ready')
            this.accel.start(sensor).then(() => {
              console.log('*** Accel Ready')
            }) 
          })
        })
      })

      socket.on( 'ready-for-data' , data => {
        Promise.all([
          this.compass.read(sensor),
          this.gyro.read(sensor),
          this.accel.read(sensor)
        ])
        .then( ([compass_result, gyro_result, accel_result]) => {
          io.emit('new-data', {
            compass: {
              x_axis: compass_result[0],
              y_axis: compass_result[1],
              z_axis: compass_result[2]
            },
            gyro: {
              x_axis: gyro_result[0],
              y_axis: gyro_result[1],
              z_axis: gyro_result[2]
            },
            accel: {
              x_axis: accel_result[0],
              y_axis: accel_result[1],
              z_axis: accel_result[2]
            }
          })
        })
        .catch(err => {
          console.log(err)
          io.emit( 'error-reading-data' , {})
        })     
      })

      socket.on( 'disconnect', data => {
        sensor.close()
        console.log( 'client disconnected' )
      })
    })

    socket.on( 'init-motors' , data => {
      this.motor_0 = new Motor(data.motor_0_pin)
      this.motor_1 = new Motor(data.motor_1_pin)
      console.log('*** Motors Ready')
      io.emit('motor-data', {
        motor_0: {
          isOn: this.motor_0.getOnStatus(),
          speed: this.motor_0.getSpeed(),
          value: ((this.motor_0.getSpeed() - 1150) / 5)
        },
        motor_1: {
          isOn: this.motor_1.getOnStatus(),
          speed: this.motor_1.getSpeed(),
          value: ((this.motor_1.getSpeed() - 1150) / 5)
        },
      })
    })

    

    socket.on( 'motor-on' , data => {
      if(data.motor == 0) {
        this.motor_0.setOn().then(() => {
          // console.log("*** motor_0 on")
        });
      } else if(data.motor == 1) {
        this.motor_1.setOn().then(() => {
          // console.log("*** motor_1 on")
        });
      }
      io.emit('motor-data', {
        motor_0: {
          isOn: this.motor_0.getOnStatus(),
          speed: this.motor_0.getSpeed(),
          value: ((this.motor_0.getSpeed() - 1150) / 5)
        },
        motor_1: {
          isOn: this.motor_1.getOnStatus(),
          speed: this.motor_1.getSpeed(),
          value: ((this.motor_1.getSpeed() - 1150) / 5)
        },
      })
    })

    socket.on( 'motor-off' , data => {
      if(data.motor == 0) {
        this.motor_0.setOff();
        // console.log('*** motor_0 off')
      } else if(data.motor == 1) {
        this.motor_1.setOff();
        // console.log('*** motor_1 off')
      }
      io.emit('motor-data', {
        motor_0: {
          isOn: this.motor_0.getOnStatus(),
          speed: this.motor_0.getSpeed(),
          value: ((this.motor_0.getSpeed() - 1150) / 5)
        },
        motor_1: {
          isOn: this.motor_1.getOnStatus(),
          speed: this.motor_1.getSpeed(),
          value: ((this.motor_1.getSpeed() - 1150) / 5)
        },
      })
    })

    socket.on( 'adjust-speed' , data => {
      if(data.motor == 0) {
        this.motor_0.setSpeed(data.speed)
        // console.log('*** motor_0 adjust speed')
      } else if(data.motor == 1) {
        this.motor_1.setSpeed(data.speed)
        // console.log('*** motor_1 adjust speed')
      }
      io.emit('motor-data', {
        motor_0: {
          isOn: this.motor_0.getOnStatus(),
          speed: this.motor_0.getSpeed(),
          value: ((this.motor_0.getSpeed() - 1150) / 5)
        },
        motor_1: {
          isOn: this.motor_1.getOnStatus(),
          speed: this.motor_1.getSpeed(),
          value: ((this.motor_1.getSpeed() - 1150) / 5)
        },
      })
    })

    socket.on( 'tune' , data => {
      var mid = 68;
      this.motor_0.tune(mid - data.offset);
      this.motor_1.tune(data.offset - mid);
      // console.log(`*** tune ${data.offset}`);
      io.emit('motor-data', {
        motor_0: {
          isOn: this.motor_0.getOnStatus(),
          speed: this.motor_0.getSpeed(),
          value: ((this.motor_0.getSpeed() - 1150) / 5)
        },
        motor_1: {
          isOn: this.motor_1.getOnStatus(),
          speed: this.motor_1.getSpeed(),
          value: ((this.motor_1.getSpeed() - 1150) / 5)
        },
      })
    })
  })
}

module.exports = { init }
