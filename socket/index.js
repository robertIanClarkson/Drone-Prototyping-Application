const socketIo = require( 'socket.io' )
const Motor = require('../pi/motor')

var motor_0
var motor_1

const init = ( app, server ) => {
  const io = socketIo( server )

  app.set( 'io', io )

  io.on( 'connection', socket => {
    console.log( 'client connected' )

    socket.on( 'disconnect', data => {
      console.log( 'client disconnected' )
    })

    socket.on('init-motors', data => {
      motor_0 = new Motor(18)
      motor_1 = new Motor(23)
    })

    // socket.on('init-sensors', data => {

    // })

    socket.on('ready-for-data', data => {
      var transmit = setInterval(() => {
        io.emit('new-data', {
          motor_0: {
            isOn: this.motor_0.getOnStatus(),
            speed: this.motor_0.getSpeed()
          },
          motor_1: {
            isOn: this.motor_1.getOnStatus(),
            speed: this.motor_1.getSpeed()
          }
        })
      }, 2000);
    })
  })
}

module.exports = { init }