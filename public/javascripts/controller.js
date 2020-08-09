var socket = io();

function updateMotorFields(motor_0, motor_1) {
    // on/off
    $('#status-0').text(motor_0.isOn)
    $('#status-1').text(motor_1.isOn)

    // speed
    $('#pwm-0').text(motor_0.speed)
    $('#pwm-1').text(motor_1.speed)

    // universal
    if(motor_0.isOn == false && motor_1.isOn == false) { // both on
        $('#status-all').text('false')
    } else if(motor_0.isOn == true && motor_1.isOn == true) { // both off
        $('#status-all').text('true')
    } else { // mixed
        $('#status-all').text('mixed')
    }
}

function updateCompassFields(values) {
    $('#compass-x').text(values.x_axis)
    $('#compass-y').text(values.y_axis)
    $('#compass-z').text(values.z_axis)
}

function updateGyroFields(values) {
    $('#gyro-x').text(values.x_axis)
    $('#gyro-y').text(values.y_axis)
    $('#gyro-z').text(values.z_axis)
}

function updateAccelFields(values) {
    $('#accel-x').text(values.x_axis)
    $('#accel-y').text(values.y_axis)
    $('#accel-z').text(values.z_axis)
}

let compass_tick = 0;
function updateCompassGraphs(chart, compass) {
    chart.data.labels.push(compass_tick)
    chart.data.datasets[0].data.push(compass.x_axis)
    chart.data.datasets[1].data.push(compass.y_axis)
    chart.data.datasets[2].data.push(compass.z_axis)
    if(compass_tick > 100) {
        chart.data.labels.shift()
        chart.data.datasets[0].data.shift()
        chart.data.datasets[1].data.shift()
        chart.data.datasets[2].data.shift()
    }
    chart.update(0)
    compass_tick++
}

let gyro_tick = 0;
function updateGyroGraphs(chart, gyro) {
    chart.data.labels.push(gyro_tick)
    chart.data.datasets[0].data.push(gyro.x_axis)
    chart.data.datasets[1].data.push(gyro.y_axis)
    chart.data.datasets[2].data.push(gyro.z_axis)
    if(gyro_tick > 100) {
        chart.data.labels.shift()
        chart.data.datasets[0].data.shift()
        chart.data.datasets[1].data.shift()
        chart.data.datasets[2].data.shift()
    }
    chart.update(0)
    gyro_tick++
}

let accel_tick = 0;
function updateAccelGraphs(charts, accel) {
    // Line
    let line = charts[0]
    line.data.labels.push(accel_tick)
    line.data.datasets[0].data.push(accel.x_axis)
    line.data.datasets[1].data.push(accel.y_axis)
    line.data.datasets[2].data.push(accel.z_axis)
    if(accel_tick > 100) {
        line.data.labels.shift()
        line.data.datasets[0].data.shift()
        line.data.datasets[1].data.shift()
        line.data.datasets[2].data.shift()
    }
    line.update(0)
    accel_tick++

    // Radar
    let radar = charts[1]
    radar.data.datasets[0].data[0] = accel.x_axis
    radar.data.datasets[0].data[1] = accel.y_axis
    radar.update(0)
}

function compassLineGraph() {    
    var ctx = document.getElementById('compass-line-graph').getContext('2d');
    return window.myLine = Chart.Line(ctx, {
        data: {
            labels: [],
            datasets: [{
                label: 'X-Axis',
                borderColor: 'rgb(255, 0, 0)',
                backgroundColor: 'rgb(255, 0, 0)',
                fill: false,
                data: [],
                yAxisID: 'y-axis-1',
            }, {
                label: 'Y-Axis',
                borderColor: 'rgb(0, 255, 0)',
                backgroundColor: 'rgb(0, 255, 0)',
                fill: false,
                data: [],
                yAxisID: 'y-axis-1'
            }, {
                label: 'Z-Axis',
                borderColor: 'rgb(0, 0, 255)',
                backgroundColor: 'rgb(0, 0, 255)',
                fill: false,
                data: [],
                yAxisID: 'y-axis-1'
            }]
        },
		options: {
            responsive: true,
            hoverMode: 'index',
            stacked: false,
            title: {
                display: false,
                text: 'Compass'
            },
            scales: {
                yAxes: [{
                    type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: 'left',
                    id: 'y-axis-1',
                }]
            }
        }
    })
}

function gyroLineGraph() {    
    var ctx = document.getElementById('gyro-line-graph').getContext('2d');
    return window.myLine = Chart.Line(ctx, {
        data: {
            labels: [],
            datasets: [{
                label: 'X-Axis',
                borderColor: 'rgb(255, 0, 0)',
                backgroundColor: 'rgb(255, 0, 0)',
                fill: false,
                data: [],
                yAxisID: 'y-axis-1',
            }, {
                label: 'Y-Axis',
                borderColor: 'rgb(0, 255, 0)',
                backgroundColor: 'rgb(0, 255, 0)',
                fill: false,
                data: [],
                yAxisID: 'y-axis-1'
            }, {
                label: 'Z-Axis',
                borderColor: 'rgb(0, 0, 255)',
                backgroundColor: 'rgb(0, 0, 255)',
                fill: false,
                data: [],
                yAxisID: 'y-axis-1'
            }]
        },
		options: {
            responsive: true,
            hoverMode: 'index',
            stacked: false,
            title: {
                display: false,
                text: 'Gyrometer'
            },
            scales: {
                yAxes: [{
                    type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: 'left',
                    id: 'y-axis-1',
                }]
            }
        }
    })
}

function accelLineGraph() {    
    var ctx = document.getElementById('accel-line-graph').getContext('2d');
    return window.myLine = Chart.Line(ctx, {
        data: {
            labels: [],
            datasets: [{
                label: 'X-Axis',
                borderColor: 'rgb(255, 0, 0)',
                backgroundColor: 'rgb(255, 0, 0)',
                fill: false,
                data: [],
                yAxisID: 'y-axis-1',
            }, {
                label: 'Y-Axis',
                borderColor: 'rgb(0, 255, 0)',
                backgroundColor: 'rgb(0, 255, 0)',
                fill: false,
                data: [],
                yAxisID: 'y-axis-1'
            }, {
                label: 'Z-Axis',
                borderColor: 'rgb(0, 0, 255)',
                backgroundColor: 'rgb(0, 0, 255)',
                fill: false,
                data: [],
                yAxisID: 'y-axis-1'
            }]
        },
		options: {
            responsive: true,
            hoverMode: 'index',
            stacked: false,
            title: {
                display: false,
                text: 'Accelerometer'
            },
            scales: {
                yAxes: [{
                    type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: 'left',
                    id: 'y-axis-1',
                }]
            }
        }
    })
}

function accelRadarGraph() {    
    return window.myRadar = new Chart(document.getElementById('accel-radar-graph-xy'), {
        type: 'radar',
        data: {
            labels: ['Y+', 'X+', 'Y-', 'X-'],
            datasets: [{
                label: 'Live Data',
                backgroundColor: 'rgb(0, 0, 255)',
                borderColor: 'rgb(0, 0, 255)',
                pointBackgroundColor: 'rgb(0, 0, 255)',
                data: []
            }]
        },
		options: {
            legend: {
                position: 'top',
                display: false
            },
            title: {
                display: false,
                text: 'Accel XY'
            },
            scale: {
                ticks: {
                    beginAtZero: true
                }
            }
        }
    });    
}

function motorOn() {
    $( '#on-universal' ).click( event => {
        socket.emit('motor-on', { motor: 0 })
        socket.emit('motor-on', { motor: 1 })
    })
    $( '#on-0' ).click( event => {
        socket.emit('motor-on', { motor: 0 })
    })
    $( '#on-1' ).click( event => {
        socket.emit('motor-on', { motor: 1 })
    }) 
}

function motorOff() {
    $( '#off-universal' ).click( event => {
        socket.emit('motor-off', { motor: 0 })
        socket.emit('motor-off', { motor: 1 })
    })
    $( '#off-0' ).click( event => {
        socket.emit('motor-off', { motor: 0 })
    })
    $( '#off-1' ).click( event => {
        socket.emit('motor-off', { motor: 1 })
    })
}

function adjustSpeed() {
    // SLIDER-0
    var slider0 = document.getElementById("speed-0");
    var output0 = document.getElementById("speedValue-0");
    output0.innerHTML = slider0.value;
    slider0.onchange = function() {
        output0.innerHTML = this.value;
        var data_0 = {
            motor: 0,
            speed: this.value
        }
        socket.emit( 'adjust-speed' , data_0)
    }
    
    // SLIDER-1
    var slider1 = document.getElementById("speed-1");
    var output1 = document.getElementById("speedValue-1");
    output1.innerHTML = slider1.value;
    slider1.onchange = function() {
        output1.innerHTML = this.value;
        var data_1 = {
            motor: 1,
            speed: this.value
        }
        socket.emit( 'adjust-speed' , data_1)
    }
}

function tune() {
    // SLIDER-Crossfade
    var crossfade = document.getElementById("crossfade");
    var output_crossfade = document.getElementById("crossfade-value");
    output_crossfade.innerHTML = 0;
    crossfade.onchange = function() {
        if(this.value <= 68) {
            output_crossfade.innerHTML = this.value - 68;
        } else {
            output_crossfade.innerHTML = `+${this.value - 68}`;
        }
        var data = {
            offset: this.value
        }
        socket.emit( 'tune' , data)
    }
}

function coupled() {
    // SLIDER-coupled
    var coupled_slider = document.getElementById("coupled");
    var output_coupled = document.getElementById("coupled-value");
    output_coupled.innerHTML = coupled_slider.value;
    coupled_slider.onchange = function() {
        output_coupled.innerHTML = this.value;
        socket.emit( 'adjust-speed' , {
            motor: 0,
            speed: this.value
        })
        socket.emit( 'adjust-speed' , {
            motor: 1,
            speed: this.value
        })
    }
}

var i = 0
var then = Date.now();
var now;
$( document ).ready( () => {
    // INPUTS
    motorOn()
    motorOff()
    adjustSpeed()
    tune()
    coupled()
    var compassLine   = compassLineGraph()
    var gyroLine      = gyroLineGraph()
    var accelLine     = accelLineGraph()
    var accelRadar    = accelRadarGraph()

    socket.emit( 'init-motors' , {
        motor_0_pin: 18,
        motor_1_pin: 23
    })
    
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
    
    socket.emit( 'ready-for-data' , {})
    
    socket.on( 'new-data' , (data) => {
        // Fields
        updateMotorFields(data.motor_0, data.motor_1)
        updateCompassFields(data.compass)
        updateGyroFields(data.gyro)
        updateAccelFields(data.accel)

        // Graphs
        updateCompassGraphs(compassLine, data.compass)
        updateGyroGraphs(gyroLine, data.gyro)
        updateAccelGraphs([accelLine, accelRadar], data.accel)
        
        ++i;
        now = Date.now()
        if(now - then >= 1000) {
            console.log(`Refreshes = ${i}`)
            console.log(`Time      = ${now - then}`)
            then = now;
            i = 0;
        }
        socket.emit( 'ready-for-data' , {})
        // console.log(data)
    })

    socket.on( 'error-reading-data' , () => {
        socket.emit( 'ready-for-data' , {})
    })
});

/*************************MIDI****************************** */
/*
var timeThen = 0;
var timeNow;

var log = console.log.bind(console);
var keyData = document.getElementById('key_data');
var midi;
var data, cmd, channel, type, note, velocity;

// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No MIDI support in your browser.");
}

// midi functions
function onMIDISuccess(midiAccess) {
    midi = midiAccess;
    var inputs = midi.inputs.values();
    // loop through all inputs
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // listen for midi messages
        input.value.onmidimessage = onMIDIMessage;
        // this just lists our inputs in the console
        listInputs(input);
    }
    // listen for connect/disconnect message
    midi.onstatechange = onStateChange;
}

function onMIDIMessage(event) {
    midiEvent = parseMidiMessage(event.data);
    console.log(midiEvent)
    if(midiEvent.command === 11) { // slider
        if(midiEvent.channel === 1 && midiEvent.note === 19) { // channel 1
            adjustSlider(0, midiEvent.value);
        } else if(midiEvent.channel === 3 && midiEvent.note === 19) { // channel 2
            adjustSlider(1, midiEvent.value);
        } else if(midiEvent.channel === 1 && midiEvent.note === 0) { // tune
            tuneSlider(midiEvent.value);
        }
    } else if(midiEvent.command == 9 && midiEvent.channel == 8 && midiEvent.value > 0) { // button
        if(midiEvent.note ==  6) { // motor_0 OFF
            $.post('http://10.0.0.5:3000/off', {motor: 0}, function(data, status) {
                console.log('Client: POST --> off-0')
                refreshData()
            })
        } else if(midiEvent.note == 7) { // motor_1 OFF
            $.post('http://10.0.0.5:3000/off', {motor: 1}, function(data, status) {
                console.log('Client: POST --> off-1')
                refreshData()
            })
        } else if(midiEvent.note == 2) { // motor_0 ON
            $.post('http://10.0.0.5:3000/on', {motor: 0}, function(data, status) {
                console.log('Client: POST --> on-0')
                refreshData()
            })
        } else if(midiEvent.note == 3) { // motor_1 ON
            $.post('http://10.0.0.5:3000/on', {motor: 1}, function(data, status) {
                console.log('Client: POST --> on-1')
                refreshData()
            })
        }
    }
}

function onStateChange(event) {
    var port = event.port,
        state = port.state,
        name = port.name,
        type = port.type;
    if (type == "input") console.log("name", name, "port", port, "state", state);
}

function listInputs(inputs) {
    var input = inputs.value;
    log("Input port : [ type:'" + input.type + "' id: '" + input.id +
        "' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
        "' version: '" + input.version + "']");
}

function onMIDIFailure(e) {
    log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}

function parseMidiMessage(data) {
    return {
        command: data[0] >> 4,
        channel: data[0] & 0xf,
        note: data[1],
        value: Math.floor((data[2] / 127) * 135.0)
    }
}

function adjustSlider(motor, value) {
    timeNow = Date.now()
    if((timeNow - timeThen) > 500) { // allow every X millisecond
        if(motor == 0) {
            if(slider0.value != value) { // dont post if value hasn't changed
                slider0.value = value;
                output0.innerHTML = value;
                var data = {
                    motor: 0,
                    speed: value
                }
                $.post('http://10.0.0.5:3000/adjust-speed', data, function(data, status) {
                    console.log('Client: POST --> adjust speed')
                    timeThen = timeNow;
                    refreshData();
                })
            }
        } else if(motor == 1) {
            if(slider1.value != value) { // dont post if value hasn't changed
                slider1.value = value;
                output1.innerHTML = value;
                var data = {
                    motor: 1,
                    speed: value
                }
                $.post('http://10.0.0.5:3000/adjust-speed', data, function(data, status) {
                    console.log('Client: POST --> adjust speed')
                    timeThen = timeNow;
                    refreshData();
                })
            }
        }
    }
}

function tuneSlider(value) {
    // midi tune slider logic
}

*/
