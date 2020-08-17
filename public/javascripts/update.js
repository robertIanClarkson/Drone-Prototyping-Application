/* UPDATE FUNCTIONS */
/* update motors raw data output from server */
function updateMotorFields(motor_0, motor_1) {
  // on/off
  $('#status-0').text(motor_0.isOn)
  $('#status-1').text(motor_1.isOn)

  // speed
  $('#pwm-0').text(motor_0.speed)
  $('#pwm-1').text(motor_1.speed)

  // sliders
  if(motor_0.value < 0) {
    $('#speed-0').val(0)
    $('#speedValue-0').text(0)
  } else {
    $('#speed-0').val(motor_0.value)
    $('#speedValue-0').text(motor_0.value)
  }
  if(motor_1.value < 0) {
    $('#speed-1').val(0)
    $('#speedValue-1').text(0)
  } else {
    $('#speed-1').val(motor_1.value)
    $('#speedValue-1').text(motor_1.value)
  }

  // universal
  if (motor_0.isOn == false && motor_1.isOn == false) { // both off
    $('#status-all').text('false')
    if(motor_0.speed == motor_1.speed) {
      $('#coupled-status').text('true')
      $('#coupled').prop({ disabled: false })
    } else {
      $('#coupled-status').text('false')
      $('#coupled').prop({ disabled: true })
    }
  } else if (motor_0.isOn == true && motor_1.isOn == true) { // both on
    $('#status-all').text('true')
    if(motor_0.speed == motor_1.speed) {
      $('#coupled-status').text('true')
      $('#coupled').prop({ disabled: false })
    } else {
      $('#coupled-status').text('false')
      $('#coupled').prop({ disabled: true })
    }
  } else { // mixed
    $('#status-all').text('mixed')
    $('#coupled-status').text('false')
    $('#coupled').prop({ disabled: true })
  }
}

/* update compass raw data output from server */
function updateCompassFields(values) {
  $('#compass-x').text(values.x_axis)
  $('#compass-y').text(values.y_axis)
  $('#compass-z').text(values.z_axis)
  $('#compass-heading').text(values.heading)
}

/* update gyro raw data output from server */
function updateGyroFields(values) {
  $('#gyro-x').text(values.x_axis)
  $('#gyro-y').text(values.y_axis)
  $('#gyro-z').text(values.z_axis)
}

/* update accel raw data output from server */
function updateAccelFields(values) {
  $('#accel-x').text(values.x_axis)
  $('#accel-y').text(values.y_axis)
  $('#accel-z').text(values.z_axis)
}

/* update line graph for compass data */
let compass_tick = 0;
function updateCompassGraphs(chart, compass) {
  chart.data.labels.push(compass_tick)
  chart.data.datasets[0].data.push(compass.x_axis)
  chart.data.datasets[1].data.push(compass.y_axis)
  chart.data.datasets[2].data.push(compass.z_axis)
  if (compass_tick > 100) {
    chart.data.labels.shift()
    chart.data.datasets[0].data.shift()
    chart.data.datasets[1].data.shift()
    chart.data.datasets[2].data.shift()
  }
  chart.update(0)
  compass_tick++
}

/* update line graph for gyroscope data */
let gyro_tick = 0;
function updateGyroGraphs(chart, gyro) {
  chart.data.labels.push(gyro_tick)
  chart.data.datasets[0].data.push(gyro.x_axis)
  chart.data.datasets[1].data.push(gyro.y_axis)
  chart.data.datasets[2].data.push(gyro.z_axis)
  if (gyro_tick > 100) {
    chart.data.labels.shift()
    chart.data.datasets[0].data.shift()
    chart.data.datasets[1].data.shift()
    chart.data.datasets[2].data.shift()
  }
  chart.update(0)
  gyro_tick++
}

/* Update line & live graphs for accelerometer data */
let accel_tick = 0;
function updateAccelGraphs(charts, accel) {
  // Live - XY
  let xy = charts[0]
  xy.data.datasets[0].data[0] = {
    x: accel.x_axis,
    y: accel.y_axis
  }
  xy.update()

  // Live - Z
  let z = charts[1]
  z.data.datasets[0].data[0] = {
    x: 0,
    y: accel.z_axis
  }
  z.update()

  // Line - XYZ
  let line = charts[2]
  line.data.labels.push(accel_tick)
  line.data.datasets[0].data.push(accel.x_axis)
  line.data.datasets[1].data.push(accel.y_axis)
  line.data.datasets[2].data.push(accel.z_axis)
  if (accel_tick > 100) {
    line.data.labels.shift()
    line.data.datasets[0].data.shift()
    line.data.datasets[1].data.shift()
    line.data.datasets[2].data.shift()
  }
  line.update(0)
  accel_tick++
}

function updateCubeSliders(data) {
  $('#accel-x-anime').val(data.accel.x_axis)
  $('#accel-y-anime').val(data.accel.y_axis)
  $('#accel-z-anime').val(data.accel.z_axis)
  $('#accel-x-val-anime').text(data.accel.x_axis)
  $('#accel-y-val-anime').text(data.accel.y_axis)
  $('#accel-z-val-anime').text(data.accel.z_axis)
}

export {
  updateMotorFields,
  updateCompassFields,
  updateGyroFields,
  updateAccelFields,
  updateCompassGraphs,
  updateGyroGraphs,
  updateAccelGraphs,
  updateCubeSliders
}
