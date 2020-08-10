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