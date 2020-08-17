import * as Motors from './motors.js';
import * as Grapher from './graphs.js';
import * as Updater from './update.js';
import * as Zero from './zeroSensors.js';
import { CubeAnimation } from './cube_animation.js';

var socket = io();

/* MAIN CONTROLLER */
var i = 0
var then = Date.now();
var now;
$(document).ready(() => {
  // Zero Sensors
  Zero.zeroCompass(socket)
  Zero.zeroAccel(socket)

  // Motors Listeners
  Motors.motorOn(socket)
  Motors.motorOff(socket)
  Motors.adjustSpeed(socket)
  Motors.tune(socket)
  Motors.coupled(socket)

  // Init Graphs 
  var compassLine  = Grapher.compassLineGraph()
  var accelLine    = Grapher.accelLineGraph()
  var accelLive_xy = Grapher.accelLiveGraph_xy()
  var accelLive_z  = Grapher.accelLiveGraph_z()

  // 3D Cube
  let cube = new CubeAnimation()
  cube.init()
  //cube.set(10, 10 , 10)

  /* SOCKETIO */
  // Set GPIO pins for motors
  socket.emit('init-motors', {
    motor_0_pin: 18,
    motor_1_pin: 23
  })

  // Set hex addresses for 'compass, gyro, accel'
  socket.emit('init-sensors', {
    compass: {
      slave_address: 0x1E
    },
    accel: {
      slave_address: 0x19
    }
  })

  // Ready for motor & sensor data from server
  socket.emit('ready-for-data', {})

  // Incoming data handler
  socket.on('new-data', (data) => {
    // Fields
    Updater.updateCompassFields(data.compass)
    Updater.updateAccelFields(data.accel)

    // Graphs
    Updater.updateCompassGraphs(compassLine, data.compass)
    Updater.updateAccelGraphs([accelLive_xy, accelLive_z, accelLine], data.accel)

    // Cube
    Updater.updateCubeSliders(data)
    cube.set(data.accel.roll, data.accel.pitch)

    // ++i;
    // now = Date.now()
    // if (now - then >= 1000) {
    //   console.log(`Refreshes = ${i}`)
    //   console.log(`Time      = ${now - then}`)
    //   then = now;
    //   i = 0;
    // }
    // socket.emit('ready-for-data', {})
    // console.log(data)
  })

  // Catch for failed to read data
  socket.on('error-reading-data', (data) => {
    console.log(data.error)
    $('#error').text(data.error)
  })

  // Update motor GUI elements on user input
  socket.on('motor-data', (data) => {
    Updater.updateMotorFields(data.motor_0, data.motor_1)
  })
});
