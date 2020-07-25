var socket = io();

function updateMotorFields(motor_0, motor_1) {
    // on/off
    $('#status-0').text(motor_0.isOn)
    $('#status-1').text(motor_1.isOn)

    // speed
    $('#pwm-0').text(motor_0.speed)
    $('#pwm-1').text(motor_0.speed)
}

function motorOn() {
    $( '#on-0' ).click( event => {
        socket.emit('motor-on', { motor: 0 })
    })

    $( '#on-1' ).click( event => {
        socket.emit('motor-on', { motor: 1 })
    })
}

function motorOff() {
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
    output_crossfade.innerHTML = crossfade.value;
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


$( document ).ready( () => {
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
        updateMotorFields(data.motor_0, data.motor_1)
    })

    // INPUTS
    motorOn()
    motorOff()
    adjustSpeed()
    tune()
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
