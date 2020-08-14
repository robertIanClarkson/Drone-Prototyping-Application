const socketIo = require('socket.io')
const i2c = require('i2c-bus');

const Motor = require('../pi/motor')
const Compass = require('../pi/compass')
const Gyro = require('../pi/gyro')
const Accel = require('../pi/accel')

const init = (app, server) => {

  const io = socketIo(server)

  var motor_0;
  var motor_1;
  var compass;
  var gyro;
  var accel;

  app.set('io', io)

  function emitMotorData() {
    io.emit('motor-data', {
      motor_0: {
        isOn: motor_0.getOnStatus(),
        speed: motor_0.getSpeed(),
        value: motor_0.getValue()
      },
      motor_1: {
        isOn: motor_1.getOnStatus(),
        speed: motor_1.getSpeed(),
        value: motor_1.getValue()
      }
    })
  }

  function emitSensorData(sensor) {
    Promise.all([
      compass.read(sensor),
      gyro.read(sensor),
      accel.read(sensor)
    ])
      .then(([compass_result, gyro_result, accel_result]) => {
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
        io.emit('error-reading-data', {
          error: err
        })
      })
  }

  io.on('connection', socket => {
    console.log('client connected')
    // Open Bus
    i2c.openPromisified(1)
      .then(sensor => {
        socket.on('init-sensors', data => {
          compass = new Compass(data.compass)
          gyro = new Gyro(data.gyro)
          accel = new Accel(data.accel)

          compass.start(sensor).then(() => {
            console.log('*** Compass Ready')
            gyro.start(sensor).then(() => {
              console.log('*** Gyro Ready')
              accel.start(sensor).then(() => {
                console.log('*** Accel Ready')
              })
            })
          })
        })

        socket.on('ready-for-data', data => {
          setInterval(emitSensorData, 100, sensor)
        })

        socket.on('zero-accel', _ => {
          accel.zero(sensor)
        })

        socket.on('disconnect', data => {
          sensor.close()
          console.log('client disconnected')
        })
      })

    socket.on('init-motors', data => {
      motor_0 = new Motor(data.motor_0_pin)
      motor_1 = new Motor(data.motor_1_pin)
      console.log('*** Motors Ready')
      emitMotorData()
    })



    socket.on('motor-on', data => {
      if (data.motor == 0) {
        motor_0.setOn().then(() => {
          emitMotorData()
        })
      } else if (data.motor == 1) {
        motor_1.setOn().then(() => {
          emitMotorData()
        })
      }
    })

    socket.on('motor-off', data => {
      if (data.motor == 0) {
        motor_0.setOff();
        // console.log('*** motor_0 off')
      } else if (data.motor == 1) {
        motor_1.setOff();
        // console.log('*** motor_1 off')
      }
      emitMotorData()
    })

    socket.on('adjust-speed', data => {
      if (data.motor == 0) {
        motor_0.setSpeed(data.speed)
        // console.log('*** motor_0 adjust speed')
      } else if (data.motor == 1) {
        motor_1.setSpeed(data.speed)
        // console.log('*** motor_1 adjust speed')
      }
      emitMotorData()
    })

    socket.on('tune', data => {
      var mid = 68;
      motor_0.tune(mid - data.offset);
      motor_1.tune(data.offset - mid);
      // console.log(`*** tune ${data.offset}`);
      emitMotorData()
    })
  })
}

module.exports = { init }
