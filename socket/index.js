const Logger = require('./logger')

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
  var accel;
  var logCompass = false;

  app.set('io', io)

  function emitMotorData() {
    io.emit('motor-data', {
      motor_0: {
        isOn: motor_0.getOnStatus(),
        speed: motor_0.getSpeed(),
        value: motor_0.getValue(),
        tune: motor_0.getTune()
      },
      motor_1: {
        isOn: motor_1.getOnStatus(),
        speed: motor_1.getSpeed(),
        value: motor_1.getValue(),
        tune: motor_1.getTune()
      }
    })
  }

  function getPitch(accel) {
    let accXnorm = accel.x_axis / Math.sqrt(accel.x_axis * accel.x_axis + accel.y_axis * accel.y_axis + accel.z_axis * accel.z_axis);
    return Math.asin(accXnorm)
  }

  function getRoll(accel) {
    let accYnorm = accel.y_axis / Math.sqrt(accel.x_axis * accel.x_axis + accel.y_axis * accel.y_axis + accel.z_axis * accel.z_axis);
    return Math.asin(accYnorm);
  }

  function getHeading(compass, accel) {
    // let pitch = getPitch(accel)
    // let roll = getRoll(accel)
    // let magX = compass.x_axis * Math.cos(pitch) + compass.z_axis * Math.sin(pitch);
    // let magY = compass.x_axis * Math.sin(roll) * Math.sin(pitch) + compass.y_axis * Math.cos(roll) - compass.z_axis * Math.sin(roll) * Math.cos(pitch);
    // let heading = Math.round(180 * Math.atan2(magY, magX) / Math.PI);
    let heading = 180 * Math.atan2(compass.y_axis, compass.x_axis) / Math.PI;
    if (heading < 0) {
      heading += 360
    }
    return heading.toFixed(1)
  }

  function emitSensorData(sensor) {
    Promise.all([
      compass.read(sensor),
      accel.read(sensor)
    ])
      .then(([compass_data, accel_data]) => {
        io.emit('new-data', {
          compass: {
            x_axis: compass_data.x_axis,
            y_axis: compass_data.y_axis,
            z_axis: compass_data.z_axis,
            heading: getHeading(compass_data, accel_data)
          },
          accel: {
            x_axis: accel_data.x_axis,
            y_axis: accel_data.y_axis,
            z_axis: accel_data.z_axis,
            x_off: accel_data.x_off,
            y_off: accel_data.y_off,
            z_off: accel_data.z_off,
            roll: getRoll(accel_data),
            pitch: getPitch(accel_data)
          }
        })
        if(logCompass) {
          Logger.logCompass(compass_data.x_axis, compass_data.y_axis, compass_data.z_axis)
        }
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

        /* SENSORS W/ I2C */
        socket.on('init-sensors', data => {
          compass = new Compass(data.compass)
          // gyro = new Gyro(data.gyro)
          accel = new Accel(data.accel)

          compass.start(sensor).then(() => {
            console.log('*** Compass Ready')
            accel.start(sensor).then(() => {
              console.log('*** Accel Ready')
            })
          })
        })

        socket.on('ready-for-data', data => {
          setInterval(emitSensorData, 100, sensor)
        })

        socket.on('disconnect', data => {
          sensor.close()
          console.log('client disconnected')
        })
      })

    /* SET HEADING */
    socket.on('set-heading', data => {
      console.log(data)
    })

    /* SENSORS w/o I2C */
    socket.on('zero-accel-xy', _ => {
      accel.zeroXY()
    })

    socket.on('zero-accel-z', _ => {
      accel.zeroZ()
    })

    socket.on('zero-accel-clear', _ => {
      accel.zeroClear()
    })

    socket.on('zero-compass', _ => {
      logCompass = true;
      setTimeout(function() {
        logCompass = false;
      }, 5000);
    })

    socket.on('zero-compass-clear', _ => {
      accel.zeroClear()
    })

    /* MOTORS */
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
      motor_0.setTune(- data.offset);
      motor_1.setTune(data.offset);
      // console.log(`*** tune ${data.offset}`);
      emitMotorData()
    })
  })
}

module.exports = { init }
