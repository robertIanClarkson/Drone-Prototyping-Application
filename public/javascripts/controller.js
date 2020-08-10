import * as Motors from './motors';
import * as Grapher from './graphs';
import * as Updater from './update';

var socket = io();

/* MAIN CONTROLLER */
var i = 0
var then = Date.now();
var now;
$(document).ready(() => {
  // Motors Listeners
  Motors.motorOn()
  Motors.motorOff()
  Motors.adjustSpeed()
  Motors.tune()
  Motors.coupled()

  // Init Graphs 
  var compassLine  = Grapher.compassLineGraph()
  var gyroLine     = Grapher.gyroLineGraph()
  var accelLine    = Grapher.accelLineGraph()
  var accelLive_xy = Grapher.accelLiveGraph_xy()
  var accelLive_z  = Grapher.accelLiveGraph_z()

  /* SOCKETIO */
  // Set GPIO pins for motors
  socket.emit('init-motors', {
    motor_0_pin: 18,
    motor_1_pin: 23
  })

  // Set hex addresses for 'compass, gyro, accel'
  socket.emit('init-sensors', {
    compass: {
      slave_address: 0x1D
    },
    accel: {
      slave_address: 0x1D
    },
    gyro: {
      slave_address: 0x6B
    }
  })

  // Ready for motor & sensor data from server
  socket.emit('ready-for-data', {})

  // Incoming data handler
  socket.on('new-data', (data) => {
    // Fields
    Updater.updateMotorFields(data.motor_0, data.motor_1)
    Updater.updateCompassFields(data.compass)
    Updater.updateGyroFields(data.gyro)
    Updater.updateAccelFields(data.accel)

    // Graphs
    Updater.updateCompassGraphs(compassLine, data.compass)
    Updater.updateGyroGraphs(gyroLine, data.gyro)
    Updater.updateAccelGraphs([accelLive_xy, accelLive_z, accelLine], data.accel)

    ++i;
    now = Date.now()
    if (now - then >= 1000) {
      console.log(`Refreshes = ${i}`)
      console.log(`Time      = ${now - then}`)
      then = now;
      i = 0;
    }
    socket.emit('ready-for-data', {})
    // console.log(data)
  })

  // Catch for failed to read data
  socket.on('error-reading-data', () => {
    socket.emit('ready-for-data', {})
  })
});
