const socketIo = require( 'socket.io' )
const Motor = require('../pi/motor')
const Compass = require('../pi/compass')

const init = ( app, server ) => {
  const io = socketIo( server )

  app.set( 'io', io )

  var motor_0;
  var motor_1;

  var compass;

  io.on( 'connection', socket => {
    console.log( 'client connected' )

    socket.on( 'disconnect', data => {
      console.log( 'client disconnected' )
    })

    socket.on('init-motors', data => {
      this.motor_0 = new Motor(data.motor_0_pin)
      this.motor_1 = new Motor(data.motor_1_pin)
      console.log('*** Motors Ready')
    })

    socket.on('init-sensors', data => {
      this.compass = new Compass(data.compass)
      this.compass.start().then(() => {
        console.log('*** Compass Ready')
      })
    })

    socket.on('motor-on', data => {
      if(data.motor == 0) {
        this.motor_0.setOn().then(() => {
          console.log("*** motor_0 on")
        });
      } else if(data.motor == 1) {
        this.motor_1.setOn().then(() => {
          console.log("*** motor_1 on")
        });
      }
    })

    socket.on('motor-off', data => {
      if(data.motor == 0) {
        this.motor_0.setOff();
        console.log('*** motor_0 off')
      } else if(data.motor == 1) {
        this.motor_1.setOff();
        console.log('*** motor_1 off')
      }
    })

    socket.on('adjust-speed', data => {
      if(data.motor == 0) {
        this.motor_0.setSpeed(data.speed)
        console.log('*** motor_0 adjust speed')
      } else if(data.motor == 1) {
        this.motor_1.setSpeed(data.speed)
        console.log('*** motor_1 adjust speed')
      }
    })

    socket.on('tune', data => {
      var mid = 68;
      this.motor_0.tune(mid - data.offset);
      this.motor_1.tune(data.offset - mid);
      console.log(`*** tune ${data.offset}`);
    })

    socket.on('ready-for-data', data => {
      var transmit = setInterval(() => {
      this.compass.read()
      .then( result => {  
          io.emit('new-data', {
              motor_0: {
                isOn: this.motor_0.getOnStatus(),
                speed: this.motor_0.getSpeed()
              },
              motor_1: {
                isOn: this.motor_1.getOnStatus(),
                speed: this.motor_1.getSpeed()
              },
              compass: {
                value: result
              }
          })
        })
      }, 500);
    })
  })
}

module.exports = { init }
